import { ApplicationCommand, Locale } from "lilybird";

export class OptionBuilder {
  constructor(data: ApplicationCommand.Option.Base) {
    this.pdata = data;
  }

  protected pdata: ApplicationCommand.Option.Base;

  get data() {
    return this.pdata as Readonly<ApplicationCommand.Option.Base>;
  }

  setName(name: string): this {
    this.pdata.name = name;
    return this;
  }

  setDescription(description: string): this {
    this.pdata.description = description;
    return this;
  }

  setRequired(required: boolean): this {
    this.pdata.required = required;
    return this;
  }

  setDescriptionLocalizations(
    descriptionLocalizations: Record<Locale, string>,
  ): this {
    this.pdata.description_localizations = descriptionLocalizations;
    return this;
  }

  setNameLocalizations(nameLocalizations: Record<Locale, string>): this {
    this.pdata.name_localizations = nameLocalizations;
    return this;
  }
}
