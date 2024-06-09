import { Channel, GuildMember, User } from "@lilybird/transformers";
import { MessageCommandArgumentType } from "src/enums";
import { Role } from "lilybird";
import { StringTypeObject } from "./StringTypeObject";
import { IntegerTypeObject } from "./IntegerTypeObject";
import { MemberTypeObject } from "./MemberTypeObject";
import { RoleTypeObject } from "./RoleTypeObject";
import { ChannelTypeObject } from "./ChannelTypeObject";
import { UserTypeObject } from "./UserTypeObject";
import { BooleanTypeObject } from "./BooleanTypeObject";
import { NumberTypeObject } from "./NumberTypeObject";
// import { MessageCommandArgumentType } from "src/enums";

export type PositionalArray = MessageCommandArgumentTypeObject[];

export interface MessageCommandArguments {
  positional?: PositionalArray;
  named?: Record<string, MessageCommandArgumentTypeObject>;
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

type ArgumentTypeObjectMeta<
  T extends MessageCommandArgumentType,
  O extends boolean,
  D extends InferMap[T] | undefined,
> = {
  type: T;
  optional: O;
  default: D;
  aliases: string[];
  validators: Map<string, (v: any) => boolean>;
};

export class MessageCommandArgumentTypeObject<
  T extends MessageCommandArgumentType = MessageCommandArgumentType,
  O extends boolean = boolean,
  D extends InferMap[T] | undefined = undefined,
> {
  public meta: ArgumentTypeObjectMeta<T, O, D>;

  constructor(public readonly type: MessageCommandArgumentType) {
    this.meta = {
      type: type as T,
      optional: false as O,
      default: undefined as D,
      aliases: [] as string[],
      validators: new Map(),
    } as ArgumentTypeObjectMeta<T, O, D>;
  }

  alias(alias: string): this {
    this.meta.aliases ??= [];
    this.meta.aliases.push(alias);
    return this;
  }

  aliases(aliases: string[]): this {
    this.meta.aliases = aliases;
    return this;
  }

  optional() {
    this.meta.optional = true as O;
    return this as MessageCommandArgumentTypeObject<T, true, D>;
  }

  required() {
    this.meta.optional = false as O;
    return this as MessageCommandArgumentTypeObject<T, false, D>;
  }

  default<const V extends D>(value: V) {
    this.meta.default = value;
    return this as unknown as MessageCommandArgumentTypeObject<T, true, V>;
  }
}

/**
 * MessageCommandArgumentTypeObjects shorthand
 */
export const m = {
  string() {
    return new StringTypeObject();
  },
  integer() {
    return new IntegerTypeObject();
  },
  number() {
    return new NumberTypeObject();
  },
  boolean() {
    return new BooleanTypeObject();
  },
  user() {
    return new UserTypeObject();
  },
  channel() {
    return new ChannelTypeObject();
  },
  role() {
    return new RoleTypeObject();
  },
  member() {
    return new MemberTypeObject();
  },
};

export interface MessageCommandArgument<
  T extends MessageCommandArgumentType = MessageCommandArgumentType,
> {
  type: T;
  default?: InferMap[T];
  optional?: boolean;
  aliases: string[];
}

// Create a mapped type to infer each positional argument
type InferTuple<T extends PositionalArray> = {
  [K in keyof T]: T[K] extends MessageCommandArgumentTypeObject<
    infer Type,
    infer O,
    infer D
  >
    ? undefined extends D
      ? O extends true
        ? InferMap[Type] | undefined
        : InferMap[Type]
      : InferMap[Type]
    : never;
};

// type DefaultElse<T extends MessageCommandArgument, D> = undefined extends T['default']

type NamedArgument<T extends MessageCommandArgumentTypeObject> =
  T extends MessageCommandArgumentTypeObject<infer Type, infer O, infer D>
    ? undefined extends D
      ? O extends true
        ? InferMap[Type] | undefined
        : InferMap[Type]
      : InferMap[Type]
    : never;

export type InferArguments<Arguments extends MessageCommandArguments> = {
  positional: Arguments["positional"] extends PositionalArray
    ? InferTuple<Arguments["positional"]>
    : [];
  named: {
    [K in keyof Arguments["named"]]: Arguments["named"][K] extends MessageCommandArgumentTypeObject
      ? NamedArgument<Arguments["named"][K]>
      : never;
  };
};
