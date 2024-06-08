import { OptionBuilder } from "./OptionBuilder.js";
import { ApplicationCommand, ApplicationCommandOptionType } from "lilybird";

export class StringOptionBuilder extends OptionBuilder {
  protected pdata: ApplicationCommand.Option.StringStructure;
  constructor(
    data: Partial<Omit<ApplicationCommand.Option.StringStructure, "type">> = {},
  ) {
    super({
      ...data,
      type: ApplicationCommandOptionType.STRING,
    } as ApplicationCommand.Option.StringStructure);
    this.pdata = super.data as ApplicationCommand.Option.StringStructure;
  }

  override get data() {
    return this.pdata as Readonly<ApplicationCommand.Option.StringStructure>;
  }

  setMaxLength(maxLength: number): this {
    this.pdata.max_length = maxLength;
    return this;
  }

  setMinLength(minLength: number): this {
    this.pdata.min_length = minLength;
    return this;
  }
}
