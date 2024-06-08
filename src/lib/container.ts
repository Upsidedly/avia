import { LogType, createConsola } from "consola";
import { Client } from "lilybird";
export interface Container {
  logger: Record<LogType, (...args: any[]) => void>;
  client: Client;
  verbose: boolean;
}

export const container: Container = {
  logger: createConsola(),
  client: undefined as unknown as Client,
  verbose: false,
};
