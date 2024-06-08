import { Message } from "@lilybird/transformers";
import {
  Command,
  type InferArguments,
  type InferMap,
  type MessageCommandArguments,
} from "../structures/Command.js";
import { MessageArgumentValidator } from "../structures/MessageArgumentValidator.js";
import { container } from "../container.js";

export abstract class MessageArgumentProcessor {
  static async positional(
    posArray: (InferMap[keyof InferMap] | undefined)[],
    args: { _: string[] } & Record<string, string>,
    message: Message,
    types: MessageCommandArguments,
  ): Promise<void> {
    const requireds = types.positional?.filter(
      (e) =>
        typeof e === "number" || e.optional !== true || e.default !== undefined,
    );

    // Inbalance, cannot run
    if (args._.length < (requireds?.length ?? 0))
      throw new Error(
        `Expected ${requireds?.length} positional arguments, got ${args._.length}`,
      );

    if (types.positional && types.positional.length > 0) {
      // Required positional after optional
      let foundOptional = false;
      for (let i = 0; i < types.positional.length; i++) {
        const type = types.positional[i];
        const arg = args._.at(i);
        if (typeof type === "number") {
          if (arg === undefined)
            throw new Error(`Missing positional argument ${i}`);
          posArray.push(
            await MessageArgumentValidator.validate(message, i, type, arg),
          );
          continue;
        }
        if (type.optional === true || type.default !== undefined) {
          foundOptional = true;
          posArray.push(
            type.default !== undefined
              ? type.default
              : arg === undefined
                ? undefined
                : await MessageArgumentValidator.validate(
                    message,
                    i,
                    type.type,
                    arg,
                  ),
          );
        } else if (foundOptional) {
          throw new Error(
            `Required positional argument ${i} found after optional argument(s)`,
          );
        }
      }
    }
  }

  static async named(
    namedObj: Record<string, InferMap[keyof InferMap] | undefined>,
    args: Record<string, string>,
    message: Message,
    types: MessageCommandArguments,
  ): Promise<void> {
    if (!types.named) return;
    for (const [key, type] of Object.entries(types.named)) {
      if (typeof type === "number") {
        namedObj[key] = await MessageArgumentValidator.validate(
          message,
          key,
          type,
          args[key],
        );
      } else if (type.default !== undefined) {
        const alias =
          type.aliases && type.aliases.length > 1
            ? [key, ...type.aliases].find((alias) => args[alias] !== undefined)
            : key;
        if (alias === undefined) {
          namedObj[key] = type.default;
          continue;
        }
        namedObj[key] =
          !alias || args[key] === undefined
            ? type.default
            : await MessageArgumentValidator.validate(
                message,
                key,
                type.type,
                args[alias],
              );
      } else if (type.optional === true) {
        const alias =
          type.aliases && type.aliases.length > 1
            ? [key, ...type.aliases].find((alias) => args[alias] !== undefined)
            : key;
        namedObj[key] =
          !alias || args[alias] === undefined
            ? undefined
            : await MessageArgumentValidator.validate(
                message,
                key,
                type.type,
                args[key],
              );
      } else {
        const alias =
          type.aliases && type.aliases.length > 1
            ? [key, ...type.aliases].find((alias) => args[alias] !== undefined)
            : key;
        if (alias === undefined) {
            throw container.logger.error(``)
          throw new Error(`Missing named argument: ${key}`);
        }
        namedObj[key] = await MessageArgumentValidator.validate(
          message,
          key,
          type.type,
          args[alias],
        );
      }
    }
  }

  static async processArguments(
    _: Command,
    message: Message,
    args: { _: string[] } & Record<string, string>,
    types: MessageCommandArguments,
  ): Promise<InferArguments<MessageCommandArguments>> {
    const final = {
      positional: [] as (InferMap[keyof InferMap] | undefined)[],
      named: {} as Record<string, InferMap[keyof InferMap] | undefined>,
    };

    await MessageArgumentProcessor.positional(
      final.positional,
      args,
      message,
      types,
    );

    await MessageArgumentProcessor.named(final.named, args, message, types);

    return final as InferArguments<MessageCommandArguments>;
  }
}
