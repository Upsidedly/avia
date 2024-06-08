import { ApplicationCommand, ApplicationCommandType } from "lilybird";
import { ChannelOptionBuilder } from "./option/ChannelOptionBuilder.js";
import { StringOptionBuilder } from "./option/StringOptionBuilder.js";
import { IntegerOptionBuilder } from "./option/IntegerOptionBuilder.js";
import { NumberOptionBuilder } from "./option/NumberOptionBuilder.js";
import { BooleanOptionBuilder } from "./option/BooleanOptionBuilder.js";

export class CommandBuilder {
  protected pdata: ApplicationCommand.Create.ApplicationCommandJSONParams;

  get data() {
    return this
      .pdata as Readonly<ApplicationCommand.Create.ApplicationCommandJSONParams>;
  }

  constructor(
    data: ApplicationCommand.Create.ApplicationCommandJSONParams = {} as ApplicationCommand.Create.ApplicationCommandJSONParams,
  ) {
    this.pdata = data;
  }

  public setName(name: string): this {
    this.pdata.name = name;
    return this;
  }

  public setDescription(description: string): this {
    this.pdata.description = description;
    return this;
  }

  public setDefaultMemberPermissions(defaultMemberPermissions: string): this {
    this.pdata.default_member_permissions = defaultMemberPermissions;
    return this;
  }

  public setNSFW(nsfw: boolean): this {
    this.pdata.nsfw = nsfw;
    return this;
  }

  public setDMPermission(dmPermission: boolean): this {
    this.pdata.dm_permission = dmPermission;
    return this;
  }

  public setType(type: ApplicationCommandType): this {
    this.pdata.type = type;
    return this;
  }

  public addChannelOption(f: (builder: ChannelOptionBuilder) => void): this {
    const builder = new ChannelOptionBuilder();
    f(builder);
    this.pdata.options ??= [];
    this.pdata.options.push(builder.data);
    return this;
  }

  public addStringOption(f: (builder: StringOptionBuilder) => void): this {
    const builder = new StringOptionBuilder();
    f(builder);
    this.pdata.options ??= [];
    this.pdata.options.push(builder.data);
    return this;
  }

  public addIntegerOption(f: (builder: IntegerOptionBuilder) => void): this {
    const builder = new IntegerOptionBuilder();
    f(builder);
    this.pdata.options ??= [];
    this.pdata.options.push(builder.data);
    return this;
  }

  public addNumberOption(f: (builder: NumberOptionBuilder) => void): this {
    const builder = new NumberOptionBuilder();
    f(builder);
    this.pdata.options ??= [];
    this.pdata.options.push(builder.data);
    return this;
  }

  public addBooleanOption(f: (builder: BooleanOptionBuilder) => void): this {
    const builder = new BooleanOptionBuilder();
    f(builder);
    this.pdata.options ??= [];
    this.pdata.options.push(builder.data);
    return this;
  }
}
