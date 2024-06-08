import { OptionBuilder } from "./OptionBuilder.js";
import { ApplicationCommand, ApplicationCommandOptionType } from "lilybird";

export class StringOptionBuilder extends OptionBuilder {
  #data: ApplicationCommand.Option.StringStructure;
  constructor(
    data: Partial<Omit<ApplicationCommand.Option.StringStructure, "type">> = {},
  ) {
    super({
      ...data,
      type: ApplicationCommandOptionType.STRING,
    } as ApplicationCommand.Option.StringStructure);
    this.#data = super.data as ApplicationCommand.Option.StringStructure;
  }

  override get data() {
    return this.#data as Readonly<ApplicationCommand.Option.StringStructure>;
  }

  setMaxLength(maxLength: number): this {
    this.#data.max_length = maxLength;
    return this;
  }

  setMinLength(minLength: number): this {
    this.#data.min_length = minLength;
    return this;
  }
}
