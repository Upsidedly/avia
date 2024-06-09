import { MessageCommandArgumentType } from "src/enums";
import { MessageCommandArgumentTypeObject } from "./MessageCommandArgumentTypeObject";

export class RoleTypeObject<
  O extends boolean = false,
  D extends undefined = undefined,
> extends MessageCommandArgumentTypeObject<
  MessageCommandArgumentType.ROLE,
  O,
  D
> {
  constructor() {
    super(MessageCommandArgumentType.ROLE);
  }

  override optional(): RoleTypeObject<true, D> {
    this.meta.optional = true as O;
    return this as RoleTypeObject<true, D>;
  }

  override required(): RoleTypeObject<false, D> {
    this.meta.optional = false as O;
    return this as RoleTypeObject<false, D>;
  }
}
