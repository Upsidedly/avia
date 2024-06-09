import { OptionBuilder } from "./OptionBuilder.js";
import {
  ApplicationCommand,
  ApplicationCommandOptionType,
  ChannelType,
} from "lilybird";

export class ChannelOptionBuilder extends OptionBuilder {
  #data: ApplicationCommand.Option.ChannelStructure;

  override get data(): ApplicationCommand.Option.ChannelStructure {
    return this.#data as Readonly<ApplicationCommand.Option.ChannelStructure>;
  }

  constructor(
    data: Partial<
      Omit<ApplicationCommand.Option.ChannelStructure, "type">
    > = {},
  ) {
    super({
      ...data,
      type: ApplicationCommandOptionType.CHANNEL,
    } as ApplicationCommand.Option.ChannelStructure);
    this.#data = super.data as ApplicationCommand.Option.ChannelStructure;
  }

  addChannelType(channelType: ChannelType): this {
    this.#data.channel_types ??= [];
    this.#data.channel_types.push(channelType);
    return this;
  }

  setChannelTypes(channelTypes: ChannelType[]): this {
    this.#data.channel_types = channelTypes;
    return this;
  }
}
