import {
  BitFieldResolvable,
  Client,
  GatewayIntentsString,
  IntentsBitField,
  Partials,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

export class ExtendedClient extends Client {
  constructor() {
    super({
      intents: [
        Object.keys(IntentsBitField.Flags) as BitFieldResolvable<
          GatewayIntentsString,
          number
        >,
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.ThreadMember,
        Partials.GuildScheduledEvent,
      ],
    });
  }
  public start() {
    this.login(process.env.TOKEN);
  }
}
