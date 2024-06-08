import {
  defaultTransformers,
  Message,
  Interaction,
  type ApplicationCommandData,
} from "@lilybird/transformers";
import { join } from "node:path";
import { ApplicationCommandType, Client } from "lilybird";
import { Command } from "./Command.js";
import { container } from "../container.js";
import { bold } from "colorette";
import { Listener } from "./Listener.js";
import { parse } from "shell-quote";
import minimist from "minimist";
import { filterMap } from "../utils.js";
import { CommandBuilder } from "./builders/CommandBuilder.js";
import { Component } from "./Component.js";
import { MessageArgumentProcessor } from "./MessageArgumentProcessor.js";

export class Handler extends Component {
  protected readonly guildCommandStore: Map<string, Command> = new Map();
  protected readonly globalCommandStore: Map<string, Command> = new Map();
  protected readonly commandStore: Map<string, Command> = new Map();
  protected readonly listenerStore: Map<string, Listener> = new Map();
  protected readonly commandAliases: Map<string, string> = new Map();
  protected readonly directories: HandlerDirectories;
  protected readonly prefix: string;

  private glob = new Bun.Glob("**/*.{ts,tsx,js,jsx}");

  constructor(directories: HandlerDirectories, prefix: string) {
    super();
    this.directories = directories;
    this.prefix = prefix;
  }

  async registerGlobalCommands(client: Client) {
    await client.rest.bulkOverwriteGlobalApplicationCommand(
      client.user.id,
      [...this.globalCommandStore.values()].map(
        (e) => e.getData(new CommandBuilder()).data,
      ),
    );
  }

  async registerGuildCommands(client: Client) {
    for (const command of this.guildCommandStore.values()) {
      const temp: Promise<unknown>[] = [];
      for (const guildId of command.meta.guildIds!) {
        temp.push(
          client.rest.createGuildApplicationCommand(
            client.user.id,
            guildId,
            command.getData(new CommandBuilder()).data,
          ),
        );
      }
      await Promise.all(temp);
    }
  }

  async readCommands(directory = this.directories.commands) {
    if (typeof directory === "undefined") return false;
    const files = this.glob.scan(directory);

    for await (const fileName of files) {
      if (fileName.endsWith(".d.ts")) continue;

      const rawCommand: typeof Command = (
        await import(join(directory, fileName))
      ).default;

      if (typeof rawCommand === "undefined") {
        container.logger.warn(
          `Application command ${bold(fileName)} has no default export!`,
        );
        continue;
      }

      const command = new rawCommand();
      this.commandStore.set(command.meta.name, command);

      if (command.meta.aliases && command.meta.aliases.length > 0) {
        if (command.meta.aliases.length === 1)
          this.commandAliases.set(command.meta.aliases[0], command.meta.name);
        else
          for (let i = 0; i < command.meta.aliases.length; i++)
            this.commandAliases.set(command.meta.aliases[i], command.meta.name);
      }

      if (
        command.meta.guildIds === undefined ||
        command.meta.guildIds.length === 0
      )
        this.globalCommandStore.set(command.meta.name, command);
      else this.guildCommandStore.set(command.meta.name, command);
    }
    return true;
  }

  async readListeners(directory = this.directories.listeners) {
    if (typeof directory === "undefined") return false;
    const files = this.glob.scan(directory);

    for await (const fileName of files) {
      if (fileName.endsWith(".d.ts")) continue;

      const rawListener: typeof Listener = (
        await import(join(directory, fileName))
      ).default;
      if (typeof rawListener === "undefined") {
        container.logger.warn(
          `Listener ${bold(fileName)} has no default export!`,
        );
        continue;
      }
      const listener = new rawListener();
      this.listenerStore.set(listener.meta.event, listener);
    }
    return true;
  }

  async onInteraction(interaction: Interaction) {
    if (interaction.isApplicationCommandInteraction()) {
      const isGuild = interaction.data.isGuildApplicationCommand();
      switch (interaction.data.type) {
        case ApplicationCommandType.CHAT_INPUT:
          return await (
            isGuild ? this.guildCommandStore : this.globalCommandStore
          )
            .get(interaction.data.name)
            ?.onChatInput(interaction);
        case ApplicationCommandType.MESSAGE:
          return await (
            isGuild ? this.guildCommandStore : this.globalCommandStore
          )
            .get(interaction.data.name)
            ?.onMessageContext(
              interaction as unknown as Interaction<
                ApplicationCommandData<undefined>,
                Message
              >,
            );
        case ApplicationCommandType.USER:
          return await (
            isGuild ? this.globalCommandStore : this.guildCommandStore
          )
            .get(interaction.data.name)
            ?.onUserContext(interaction);
      }
    } else if (interaction.isAutocompleteInteraction()) {
      await this.globalCommandStore
        .get(interaction.data.name)
        ?.onAutocomplete?.(interaction);
      if (interaction.inGuild())
        await this.guildCommandStore
          .get(interaction.data.name)
          ?.onAutocomplete?.(interaction);
    }
  }

  private escapeSpecialStrings(input: string): string {
    const stringsToEscape = [
      "#",
      "||",
      "&&",
      ";;",
      "|&",
      "<(",
      ">>",
      ">&",
      "&",
      ";",
      "(",
      ")",
      "|",
      "<",
      ">",
    ];

    // Escape each string to be used in the regex
    const escapedStrings = stringsToEscape.map((s) =>
      s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );

    // Create a regex pattern to match any of the strings to be escaped
    const regexPattern = new RegExp(escapedStrings.join("|"), "g");

    // Replace each occurrence with the escaped version
    return input.replace(regexPattern, (match) => "\\" + match);
  }

  async onMessage(message: Message) {
    if (message.author.bot || (await message.fetchChannel()).isDM()) return;
    if (!message.content?.startsWith(this.prefix)) return;
    const raw = message.content.slice(this.prefix.length).trim();
    const parsed: string[] = filterMap(
      parse(this.escapeSpecialStrings(raw)),
      (entry) =>
        typeof entry === "string" ? entry : Reflect.get(entry, "pattern"),
    );
    const result = minimist(parsed);
    if (result._.length === 0) return;
    const name = result._.shift()!;

    let command = this.commandStore.get(name);
    if (!command)
      command = this.commandStore.get(this.commandAliases.get(name) ?? "");

    if (command) {
      if (command.meta.enabled === false) return;
      Reflect.deleteProperty(result, "--");
      console.log("swag");
      try {
        const args = await MessageArgumentProcessor.processArguments(
          command,
          message,
          result,
          command.meta.messageCommandArguments ?? { positional: [], named: {} },
        );

        await command.onMessage(message, args);
      } catch (e) {
        this.container.logger.error(e);
        message.reply((e as Error).message);
      }
    }
    //   const args = message.content.slice(this.prefix.length).trim().split(/\s+/g);
    //   if (args.length === 0) return;
    //   const alias = args.shift().toLowerCase();
    //   let command = this.messageCommands.get(alias);
    //   let name = alias;
    //   if (typeof command === "undefined") {
    //     name = this.messageCommandAliases.get(alias);
    //     if (typeof name !== "string") return;
    //     command = this.messageCommands.get(name);
    //     if (typeof command === "undefined") return;
    //   }
    //   if (command.enabled ?? true) await command.run(message, args, { name, alias });
    // }
  }

  async buildListeners() {
    await this.readCommands();
    await this.readListeners();

    const interactionCreateListeners: Listener<"interactionCreate">["onRun"][] =
      [];
    const messageCreateListeners: Listener<"messageCreate">["onRun"][] = [];
    const listeners: Record<string, (...args: any[]) => any> = {};

    if (this.listenerStore.size > 0) {
      for (const [name, listener] of this.listenerStore) {
        if (name === "interactionCreate") {
          interactionCreateListeners.push(
            listener.onRun.bind(
              listener,
            ) as Listener<"interactionCreate">["onRun"],
          );
          continue;
        }

        if (name === "messageCreate") {
          messageCreateListeners.push(
            listener.onRun.bind(listener) as Listener<"messageCreate">["onRun"],
          );
          continue;
        }
        listeners[name] = listener.onRun.bind(listener);
      }
    }

    listeners["interactionCreate"] = async (interaction) => {
      await this.onInteraction(interaction);
      await Promise.all(interactionCreateListeners.map((l) => l(interaction)));
    };

    listeners["messageCreate"] = async (message) => {
      await this.onMessage(message);
      await Promise.all(messageCreateListeners.map((l) => l(message)));
    };

    return listeners;
  }
}

interface HandlerDirectories {
  commands?: string;
  listeners?: string;
}

interface AviaHandlerOptions {
  directories: HandlerDirectories;
  prefix: string;
}

export async function createAviaHandler({
  directories,
  prefix,
}: AviaHandlerOptions) {
  const handler = new Handler(directories, prefix);
  return {
    transformers: defaultTransformers,
    listeners: await handler.buildListeners(),
    customCacheKeys: {
      guild_voice_states: "voiceStates",
    },
    setup: async (client: Client) => {
      container.client = client;
      await handler.registerGlobalCommands(client);
      await handler.registerGuildCommands(client);
    },
  };
}
