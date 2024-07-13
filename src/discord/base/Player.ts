import { Player } from "discord-player";
import { Client } from "discord.js";

export async function createPlayer(client: Client) {
  const player = new Player(client);
  await player.extractors.loadDefault();

  return player;
}
