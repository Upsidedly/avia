import { OptionBuilder } from "./OptionBuilder.js";
import { ApplicationCommand, ApplicationCommandOptionType } from "lilybird";

export class UserOptionBuilder extends OptionBuilder {
  #data: ApplicationCommand.Option.Structure;

  override get data(): ApplicationCommand.Option.Structure {
    return this.#data as Readonly<ApplicationCommand.Option.Structure>;
  }

  constructor(
    data: Partial<Omit<ApplicationCommand.Option.Structure, "type">> = {},
  ) {
    super({
      ...data,
      type: ApplicationCommandOptionType.USER,
    } as ApplicationCommand.Option.Structure);
    this.#data = super.data as ApplicationCommand.Option.Structure;
  }
}
