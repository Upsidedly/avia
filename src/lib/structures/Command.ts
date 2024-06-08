import {
  ApplicationCommandData,
  AutocompleteData,
  Channel,
  GuildMember,
  Interaction,
  Message,
  User,
} from "@lilybird/transformers";
import { Role } from "lilybird";
import { Component } from "./Component.js";
import { CommandBuilder } from "./builders/CommandBuilder.js";
import { MessageCommandArgumentType } from "src/enums.js";

export function OptionalType<const T extends MessageCommandArgumentType>(
  type: T,
): { type: T; optional: true } {
  return {
    type,
    optional: true,
  } satisfies MessageCommandArgument<T>;
}

export type CommandInteraction = Interaction<
  ApplicationCommandData<undefined>,
  undefined
>;

type PositionalArray = (
  | MessageCommandArgumentType
  | Omit<MessageCommandArgument, "aliases">
)[];

export interface MessageCommandArguments {
  positional?: PositionalArray;
  named?: Record<string, MessageCommandArgumentType | MessageCommandArgument>;
}

export interface CommandDetails {
  usage?: string;
  examples?: string[];
}

export interface Meta<
  Arguments extends MessageCommandArguments = MessageCommandArguments,
> {
  guildIds?: string[];
  enabled?: boolean;
  name: string;
  description?: string;
  aliases?: string[];
  details?: CommandDetails;
  messageCommandArguments?: Arguments;
}

export type Mentionable = User | Channel | Role.Structure | GuildMember;

export interface InferMap {
  [MessageCommandArgumentType.STRING]: string;
  [MessageCommandArgumentType.INTEGER]: number;
  [MessageCommandArgumentType.NUMBER]: number;
  [MessageCommandArgumentType.BOOLEAN]: boolean;
  [MessageCommandArgumentType.USER]: User;
  [MessageCommandArgumentType.CHANNEL]: Channel;
  [MessageCommandArgumentType.ROLE]: Role.Structure;
  [MessageCommandArgumentType.MEMBER]: GuildMember;
  // [MessageCommandArgumentType.MENTIONABLE]: Mentionable;
}

export interface MessageCommandArgument<
  T extends MessageCommandArgumentType = MessageCommandArgumentType,
> {
  type: T;
  default?: InferMap[T];
  optional?: boolean;
  aliases?: string[];
}

// Create a mapped type to infer each positional argument
type InferTuple<T extends PositionalArray> = {
  [K in keyof T]: T[K] extends MessageCommandArgumentType
    ? InferMap[T[K]]
    : T[K] extends MessageCommandArgument
      ? NamedArgument<T[K]>
      : never;
};

// type DefaultElse<T extends MessageCommandArgument, D> = undefined extends T['default']

type NamedArgument<
  T extends MessageCommandArgument | MessageCommandArgumentType,
> = T extends MessageCommandArgument
  ? undefined extends T["default"]
    ? T["optional"] extends true
      ? InferMap[T["type"]] | undefined
      : InferMap[T["type"]]
    : InferMap[T["type"]]
  : T extends MessageCommandArgumentType
    ? { type: T }
    : never;

export type InferArguments<Arguments extends MessageCommandArguments> = {
  positional: Arguments["positional"] extends PositionalArray
    ? InferTuple<Arguments["positional"]>
    : [];
  named: {
    [K in keyof Arguments["named"]]: Arguments["named"][K] extends MessageCommandArgument
      ? NamedArgument<Arguments["named"][K]>
      : Arguments["named"][K] extends MessageCommandArgumentType
        ? InferMap[Arguments["named"][K]]
        : never;
  };
};

export type Result = InferArguments<{
  positional: [
    MessageCommandArgumentType.NUMBER,
    MessageCommandArgumentType.NUMBER,
  ];
  named: {
    addInstead: MessageCommandArgumentType.BOOLEAN;
  };
}>;

export class Command<
  Args extends MessageCommandArguments = MessageCommandArguments,
> extends Component {
  public meta: Meta<Args> = { name: "" };
  public getData(builder: CommandBuilder) {
    return builder;
  }
  async onMessage(_: Message, __: InferArguments<Args>): Promise<unknown> {
    return;
  }
  async onMessageContext(
    _: Interaction<ApplicationCommandData<undefined>, Message>,
  ): Promise<unknown> {
    return;
  }
  async onUserContext(
    _: Interaction<ApplicationCommandData<undefined>, undefined>,
  ) {
    return;
  }
  async onChatInput(
    _: Interaction<ApplicationCommandData<undefined>, undefined>,
  ) {
    return;
  }
  async onAutocomplete(_: Interaction<AutocompleteData, undefined>) {
    return;
  }
}
