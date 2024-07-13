import { config } from "@/settings/config";
import { GuildQueue } from "discord-player";
import { CommandInteraction, EmbedBuilder } from "discord.js";

export async function isQueueEmpty(
  interaction: CommandInteraction,
  queue: GuildQueue | null
): Promise<boolean> {
  if (!interaction.deferred) {
    await interaction.deferReply();
  }

  const errorEmbed = new EmbedBuilder()
    .setDescription(":no_entry: Nenhuma música tocando no momento")
    .setColor(config.colors.error);

  if (!queue || !queue.currentTrack) {
    interaction.followUp({ embeds: [errorEmbed] });
    return true;
  }
  return false;
}
