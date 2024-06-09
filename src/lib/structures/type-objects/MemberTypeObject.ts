import { MessageCommandArgumentType } from "src/enums";
import { MessageCommandArgumentTypeObject } from "./MessageCommandArgumentTypeObject";

export class MemberTypeObject<
  O extends boolean = false,
  D extends undefined = undefined,
> extends MessageCommandArgumentTypeObject<
  MessageCommandArgumentType.MEMBER,
  O,
  D
> {
  constructor() {
    super(MessageCommandArgumentType.MEMBER);
  }

  override optional(): MemberTypeObject<true, D> {
    this.meta.optional = true as O;
    return this as MemberTypeObject<true, D>;
  }

  override required(): MemberTypeObject<false, D> {
    this.meta.optional = false as O;
    return this as MemberTypeObject<false, D>;
  }
}
