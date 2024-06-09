import { MessageCommandArgumentType } from "src/enums";
import { MessageCommandArgumentTypeObject } from "./MessageCommandArgumentTypeObject";
import { ChannelType } from "lilybird";
import { Channel } from "@lilybird/transformers";

export class ChannelTypeObject<
  O extends boolean = false,
  D extends undefined = undefined,
> extends MessageCommandArgumentTypeObject<
  MessageCommandArgumentType.CHANNEL,
  O,
  D
> {
  constructor() {
    super(MessageCommandArgumentType.CHANNEL);
  }

  override optional(): ChannelTypeObject<true, D> {
    this.meta.optional = true as O;
    return this as ChannelTypeObject<true, D>;
  }

  override required(): ChannelTypeObject<false, D> {
    this.meta.optional = false as O;
    return this as ChannelTypeObject<false, D>;
  }

  channelTypes(channelTypes: ChannelType[]): this {
    this.meta.validators.set('channelTypes', (ch: Channel) => channelTypes.includes(ch.type));
    return this;
  }
}
