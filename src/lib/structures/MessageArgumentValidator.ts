import { GuildMember, Message, User } from "@lilybird/transformers";
import { InferMap } from "./Command.js";
import { container } from "../container.js";
import { channelFactory } from "node_modules/@lilybird/transformers/dist/factories/channel.js";
import { MessageCommandArgumentType } from "src/enums.js";

export abstract class MessageArgumentValidator {
  static async validate<T extends MessageCommandArgumentType>(
    message: Message,
    nameOrIndex: string | number,
    type: T,
    rawString: string | boolean | undefined,
  ): Promise<InferMap[T]> {
    rawString ??= '';
    if (typeof rawString === 'boolean') {
      if (type === MessageCommandArgumentType.BOOLEAN) return rawString as InferMap[T];
      else throw new Error(`Invalid argument ${nameOrIndex}`);
    }
    switch (type) {
      case MessageCommandArgumentType.STRING:
        if (rawString.length === 0) throw new Error(`Invalid string argument ${nameOrIndex}`);
        return rawString as InferMap[T];

      case MessageCommandArgumentType.INTEGER: {
        const num = Number(rawString);
        if (Number.isNaN(num))
          throw new Error(`Invalid integer argument ${nameOrIndex}`);
        return Math.round(num) as InferMap[T];
      }

      case MessageCommandArgumentType.NUMBER:
        const num = Number(rawString);
        if (Number.isNaN(num))
          throw new Error(`Invalid number argument ${nameOrIndex}`);
        return num as InferMap[T];

      case MessageCommandArgumentType.BOOLEAN:
        if (["y", "yes", "true", "t", "1"].includes(rawString.toLowerCase()))
          return true as InferMap[T];
        else if (
          ["n", "no", "false", "f", "0"].includes(rawString.toLowerCase())
        )
          return false as InferMap[T];
        else throw new Error(`Invalid boolean argument ${nameOrIndex}`);

      case MessageCommandArgumentType.USER: {
        const id = rawString.match(/<@!?(\d{17,19})>/)?.[0];
        if (id === undefined)
          throw new Error(`Invalid user argument ${nameOrIndex}`);
        return new User(
          container.client,
          await container.client.rest.getUser(id),
        ) as InferMap[T];
      }

      case MessageCommandArgumentType.MEMBER: {
        if (message.guildId === undefined)
          throw new Error(
            `Invalid member argument ${nameOrIndex}; Cannot be used in DM`,
          );
        const memberId = rawString.match(/<@!?(\d{17,19})>/)?.[0];
        if (memberId === undefined)
          throw new Error(
            `Invalid member argument ${nameOrIndex}; Invalid member ID`,
          );
        return new GuildMember(
          container.client,
          await container.client.rest.getGuildMember(message.guildId, memberId),
        ) as InferMap[T];
      }
      case MessageCommandArgumentType.CHANNEL: {
        const channelId = rawString.match(/<#(\d{17,19})>/)?.[1];
        if (channelId === undefined)
          throw new Error(
            `Invalid channel argument ${nameOrIndex}; Invalid channel ID`,
          );
        return channelFactory(
          container.client,
          await container.client.rest.getChannel(channelId),
        ) as InferMap[T];
      }
      case MessageCommandArgumentType.ROLE: {
        if (message.guildId === undefined)
          throw new Error(
            `Invalid role argument ${nameOrIndex}; Cannot be used in DM`,
          );
        const roleId = rawString.match(/<@&(\d{17,19})>/)?.[1];
        if (roleId === undefined)
          throw new Error(
            `Invalid role argument ${nameOrIndex}; Invalid role ID`,
          );

        const role = (
          await container.client.rest.getGuildRoles(message.guildId)
        ).find((v) => v.id === roleId);
        if (role === undefined)
          throw new Error(
            `Invalid role argument ${nameOrIndex}; Invalid role ID`,
          );
        return role as InferMap[T];
      }

      default:
        throw new Error(`Invalid argument type ${type}`);
    }
  }
}
