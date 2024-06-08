import { Event } from "@lilybird/handlers";
import { DefaultTransformers } from "@lilybird/transformers";
import { ClientListeners } from "lilybird";
import { Component } from "./Component.js";

export interface ListenerMeta<EventName extends EventString = EventString> {
  event: Event<EventName, Required<ClientListeners<DefaultTransformers>>>['event']
}

export class Listener<EventName extends EventString = EventString> extends Component {
    public name?: string;
    public meta: ListenerMeta<EventName> = { event: '' as EventName };
    public onRun(..._: Parameters<Event<EventName, Required<ClientListeners<DefaultTransformers>>>['run']>) {};
    constructor(name?: string) {
        super();
        this.name = name;
    }
}

export type EventString =
  | "raw"
  | "ready"
  | "resumed"
  | "applicationCommandPermissionsUpdate"
  | "autoModerationRuleCreate"
  | "autoModerationRuleUpdate"
  | "autoModerationRuleDelete"
  | "autoModerationActionExecution"
  | "channelCreate"
  | "channelUpdate"
  | "channelDelete"
  | "channelPinsUpdate"
  | "threadCreate"
  | "threadUpdate"
  | "threadDelete"
  | "threadListSync"
  | "threadMemberUpdate"
  | "threadMembersUpdate"
  | "guildCreate"
  | "guildUpdate"
  | "guildDelete"
  | "guildAuditLogEntryCreate"
  | "guildBanAdd"
  | "guildBanRemove"
  | "guildEmojisUpdate"
  | "guildStickersUpdate"
  | "guildIntegrationsUpdate"
  | "guildMemberAdd"
  | "guildMemberRemove"
  | "guildMemberUpdate"
  | "guildMembersChunk"
  | "guildRoleCreate"
  | "guildRoleUpdate"
  | "guildRoleDelete"
  | "guildScheduledEventCreate"
  | "guildScheduledEventUpdate"
  | "guildScheduledEventDelete"
  | "guildScheduledEventUserAdd"
  | "guildScheduledEventUserRemove"
  | "integrationCreate"
  | "integrationUpdate"
  | "integrationDelete"
  | "interactionCreate"
  | "inviteCreate"
  | "inviteDelete"
  | "messageCreate"
  | "messageUpdate"
  | "messageDelete"
  | "messageDeleteBulk"
  | "messageReactionAdd"
  | "messageReactionRemove"
  | "messageReactionRemoveAll"
  | "messageReactionRemoveEmoji"
  | "presenceUpdate"
  | "stageInstanceCreate"
  | "stageInstanceUpdate"
  | "stageInstanceDelete"
  | "typingStart"
  | "userUpdate"
  | "voiceStateUpdate"
  | "voiceServerUpdate"
  | "webhookUpdate"
  | "messagePollVoteAdd"
  | "messagePollVoteRemove";