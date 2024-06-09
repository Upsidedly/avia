import {
  ApplicationCommandData,
  AutocompleteData,
  Interaction,
  Message,
} from "@lilybird/transformers";
import { Component } from "./Component.js";
import { CommandBuilder } from "./builders/CommandBuilder.js";
import { InferArguments, MessageCommandArguments } from "./type-objects/MessageCommandArgumentTypeObject.js";

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
