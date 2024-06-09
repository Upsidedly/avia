import { MessageCommandArgumentType } from "src/enums";
import { MessageCommandArgumentTypeObject } from "./MessageCommandArgumentTypeObject";

export class StringTypeObject<
O extends boolean = false,
D extends undefined = undefined,
> extends MessageCommandArgumentTypeObject<
  MessageCommandArgumentType.STRING,
  O,
  D
> {
  constructor() {
    super(MessageCommandArgumentType.STRING);
  }

  override optional(): StringTypeObject<true, D> {
    this.meta.optional = true as O;
    return this as StringTypeObject<true, D>;
  }

  override required(): StringTypeObject<false, D> {
    this.meta.optional = false as O;
    return this as StringTypeObject<false, D>;
  }

  maxLength(length: number) {
    this.meta.validators.set("maxLength", (v: string) => v.length <= length);
    return this as unknown as MessageCommandArgumentTypeObject<
      MessageCommandArgumentType.STRING,
      false,
      string
    >;
  }

  minLength(length: number) {
    this.meta.validators.set("minLength", (v: string) => v.length >= length);
    return this as unknown as MessageCommandArgumentTypeObject<
      MessageCommandArgumentType.STRING,
      false,
      string
    >;
  }

  url() {
    this.meta.validators.set("url", (v) =>
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
        v,
      ),
    );
    return this as unknown as MessageCommandArgumentTypeObject<
      MessageCommandArgumentType.STRING,
      false,
      string
    >;
  }
}