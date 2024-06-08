import { ApplicationCommand, Locale } from "lilybird";

export class OptionBuilder {
    constructor(data: ApplicationCommand.Option.Base) {
        this.#data = data;
    }

    #data: ApplicationCommand.Option.Base;

    get data() {
        return this.#data as Readonly<ApplicationCommand.Option.Base>;
    }

    setName(name: string): this {
        this.#data.name = name;
        return this;
    }

    setDescription(description: string): this {
        this.#data.description = description;
        return this;
    }

    setRequired(required: boolean): this {
        this.#data.required = required;
        return this;
    }

    setDescriptionLocalizations(descriptionLocalizations: Record<Locale, string>): this {
        this.#data.description_localizations = descriptionLocalizations;
        return this;
    }

    setNameLocalizations(nameLocalizations: Record<Locale, string>): this {
        this.#data.name_localizations = nameLocalizations;
        return this;
    }
}