import { MessageCommandArgumentType } from "src/enums";
import { MessageCommandArgumentTypeObject } from "./MessageCommandArgumentTypeObject";

export class UserTypeObject<
  O extends boolean = false,
  D extends undefined = undefined,
> extends MessageCommandArgumentTypeObject<
  MessageCommandArgumentType.USER,
  O,
  D
> {
  constructor() {
    super(MessageCommandArgumentType.USER);
  }

  override optional(): UserTypeObject<true, D> {
    this.meta.optional = true as O;
    return this as UserTypeObject<true, D>;
  }

  override required(): UserTypeObject<false, D> {
    this.meta.optional = false as O;
    return this as UserTypeObject<false, D>;
  }
}
