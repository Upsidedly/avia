import { OptionBuilder } from "./OptionBuilder.js";
import { ApplicationCommand, ApplicationCommandOptionType } from "lilybird";

export class BooleanOptionBuilder extends OptionBuilder {
  constructor(
    data: Partial<Omit<ApplicationCommand.Option.Structure, "type">> = {},
  ) {
    super({
      ...data,
      type: ApplicationCommandOptionType.BOOLEAN,
    } as ApplicationCommand.Option.Structure);
  }
}
