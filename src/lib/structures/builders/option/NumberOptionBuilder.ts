import { OptionBuilder } from "./OptionBuilder.js";
import { ApplicationCommand, ApplicationCommandOptionType } from "lilybird";

export class NumberOptionBuilder extends OptionBuilder {
  pdata: ApplicationCommand.Option.NumericStructure;
  constructor(
    data?: Partial<Omit<ApplicationCommand.Option.NumericStructure, "type">>,
  ) {
    super({
      ...data,
      type: ApplicationCommandOptionType.NUMBER,
    } as ApplicationCommand.Option.NumericStructure);
    this.pdata = super.data as ApplicationCommand.Option.NumericStructure;
  }

  override get data() {
    return this.pdata as Readonly<ApplicationCommand.Option.NumericStructure>;
  }

  setMaxValue(maxValue: number): this {
    this.pdata.max_value = maxValue;
    return this;
  }

  setMinValue(minValue: number): this {
    this.pdata.min_value = minValue;
    return this;
  }
}
