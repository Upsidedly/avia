import { MessageCommandArgumentType } from "src/enums";
import { MessageCommandArgumentTypeObject } from "./MessageCommandArgumentTypeObject";

export class IntegerTypeObject<
  O extends boolean = false,
  D extends undefined = undefined,
> extends MessageCommandArgumentTypeObject<
  MessageCommandArgumentType.INTEGER,
  O,
  D
> {
  constructor() {
    super(MessageCommandArgumentType.INTEGER);
  }

  override optional(): IntegerTypeObject<true, D> {
    this.meta.optional = true as O;
    return this as IntegerTypeObject<true, D>;
  }

  override required(): IntegerTypeObject<false, D> {
    this.meta.optional = false as O;
    return this as IntegerTypeObject<false, D>;
  }

  maxValue(value: number) {
    this.meta.validators.set("maxLength", (v: number) => v <= value);
    return this;
  }

  minValue(value: number) {
    this.meta.validators.set("minLength", (v: number) => v >= value);
    return this;
  }
}
