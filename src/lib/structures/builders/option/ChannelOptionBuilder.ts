import { OptionBuilder } from "./OptionBuilder.js";
import {
  ApplicationCommand,
  ApplicationCommandOptionType,
  ChannelType,
} from "lilybird";

export class ChannelOptionBuilder extends OptionBuilder {
  protected pdata: ApplicationCommand.Option.ChannelStructure;
  constructor(
    data: Partial<
      Omit<ApplicationCommand.Option.ChannelStructure, "type">
    > = {},
  ) {
    super({
      ...data,
      type: ApplicationCommandOptionType.CHANNEL,
    } as ApplicationCommand.Option.ChannelStructure);
    this.pdata = super.data as ApplicationCommand.Option.ChannelStructure;
  }

  override get data() {
    return this.pdata as Readonly<ApplicationCommand.Option.ChannelStructure>;
  }

  addChannelType(channelType: ChannelType): this {
    this.pdata.channel_types ??= [];
    this.pdata.channel_types.push(channelType);
    return this;
  }

  setChannelTypes(channelTypes: ChannelType[]): this {
    this.pdata.channel_types = channelTypes;
    return this;
  }
}
