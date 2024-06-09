import {
  ApplicationCommandData,
  AutocompleteData,
  Interaction,
  Message,
} from "@lilybird/transformers";
import { Component } from "./Component.js";
import { CommandBuilder } from "./builders/CommandBuilder.js";
import {
  InferArguments,
  MessageCommandArguments,
} from "./type-objects/MessageCommandArgumentTypeObject.js";
import { BooleanTypeObject } from "./type-objects/BooleanTypeObject.js";
import { ChannelTypeObject } from "./type-objects/ChannelTypeObject.js";
import { IntegerTypeObject } from "./type-objects/IntegerTypeObject.js";
import { MemberTypeObject } from "./type-objects/MemberTypeObject.js";
import { NumberTypeObject } from "./type-objects/NumberTypeObject.js";
import { RoleTypeObject } from "./type-objects/RoleTypeObject.js";
import { StringTypeObject } from "./type-objects/StringTypeObject.js";
import { UserTypeObject } from "./type-objects/UserTypeObject.js";

export type CommandInteraction = Interaction<
  ApplicationCommandData<undefined>,
  undefined
>;

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
