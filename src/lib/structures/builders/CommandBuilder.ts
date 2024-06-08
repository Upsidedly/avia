import { ApplicationCommand, ApplicationCommandType } from "lilybird";
import { ChannelOptionBuilder } from "./option/ChannelOptionBuilder.js";
import { StringOptionBuilder } from "./option/StringOptionBuilder.js";
import { IntegerOptionBuilder } from "./option/IntegerOptionBuilder.js";
import { NumberOptionBuilder } from "./option/NumberOptionBuilder.js";
import { BooleanOptionBuilder } from "./option/BooleanOptionBuilder.js";

export class CommandBuilder {
    #data: ApplicationCommand.Create.ApplicationCommandJSONParams;

    get data() {
        return this.#data as Readonly<ApplicationCommand.Create.ApplicationCommandJSONParams>;
    }

    constructor(data: ApplicationCommand.Create.ApplicationCommandJSONParams = {} as ApplicationCommand.Create.ApplicationCommandJSONParams) {
        this.#data = data;
    }

    public setName(name: string): this {
        this.#data.name = name;
        return this;
    }

    public setDescription(description: string): this {
        this.#data.description = description;
        return this;
    }

    public setDefaultMemberPermissions(defaultMemberPermissions: string): this {
        this.#data.default_member_permissions = defaultMemberPermissions;
        return this;
    }

    public setNSFW(nsfw: boolean): this {
        this.#data.nsfw = nsfw;
        return this;
    }

    public setDMPermission(dmPermission: boolean): this {
        this.#data.dm_permission = dmPermission;
        return this;
    }

    public setType(type: ApplicationCommandType): this {
        this.#data.type = type;
        return this;
    }

    public addChannelOption(f: (builder: ChannelOptionBuilder) => void): this {
        const builder = new ChannelOptionBuilder();
        f(builder);
        this.#data.options ??= [];
        this.#data.options.push(builder.data);
        return this;
    }

    public addStringOption(f: (builder: StringOptionBuilder) => void): this {
        const builder = new StringOptionBuilder();
        f(builder);
        this.#data.options ??= [];
        this.#data.options.push(builder.data);
        return this;
    }

    public addIntegerOption(f: (builder: IntegerOptionBuilder) => void): this {
        const builder = new IntegerOptionBuilder();
        f(builder);
        this.#data.options ??= [];
        this.#data.options.push(builder.data);
        return this;
    }

    public addNumberOption(f: (builder: NumberOptionBuilder) => void): this {
        const builder = new NumberOptionBuilder();
        f(builder);
        this.#data.options ??= [];
        this.#data.options.push(builder.data);
        return this;
    }

    public addBooleanOption(f: (builder: BooleanOptionBuilder) => void): this {
        const builder = new BooleanOptionBuilder();
        f(builder);
        this.#data.options ??= [];
        this.#data.options.push(builder.data);
        return this;
    }   
}