import { MessageCommandArgumentType } from "src/enums";
import { MessageCommandArgumentTypeObject } from "./MessageCommandArgumentTypeObject";

export class BooleanTypeObject<
  O extends boolean = false,
  D extends undefined = undefined,
> extends MessageCommandArgumentTypeObject<
  MessageCommandArgumentType.BOOLEAN,
  O,
  D
> {
  constructor() {
    super(MessageCommandArgumentType.BOOLEAN);
  }

  override optional(): BooleanTypeObject<true, D> {
    this.meta.optional = true as O;
    return this as BooleanTypeObject<true, D>;
  }

  override required(): BooleanTypeObject<false, D> {
    this.meta.optional = false as O;
    return this as BooleanTypeObject<false, D>;
  }
}
