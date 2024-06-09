import { MessageCommandArgumentType } from "src/enums";
import { MessageCommandArgumentTypeObject } from "./MessageCommandArgumentTypeObject";

export class NumberTypeObject<
  O extends boolean = false,
  D extends undefined = undefined,
> extends MessageCommandArgumentTypeObject<
  MessageCommandArgumentType.NUMBER,
  O,
  D
> {
  constructor() {
    super(MessageCommandArgumentType.NUMBER);
  }

  override optional(): NumberTypeObject<true, D> {
    this.meta.optional = true as O;
    return this as NumberTypeObject<true, D>;
  }

  override required(): NumberTypeObject<false, D> {
    this.meta.optional = false as O;
    return this as NumberTypeObject<false, D>;
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
