import { Command } from "@/discord/base";
import { isInVoiceChannel } from "@/functions/isInVoiceChannel";
import { config } from "@/settings/config";
import { useQueue } from "discord-player";
import { ApplicationCommandType, Embed, EmbedBuilder } from "discord.js";

new Command({
  name: "queue",
  description: "Exibe a fila de músicas.",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    const inVoiceChannel = await isInVoiceChannel(interaction);
    if (!inVoiceChannel) {
      return;
    }

    const queue = useQueue(interaction.guild.id);

    if (!interaction.deferred) {
      await interaction.deferReply();
    }

    const errorEmbed = new EmbedBuilder()
      .setDescription(
        ":no_entry: Você precisa estar em um canal de voz para usar este comando!"
      )
      .setColor(config.colors.error);

    if (!queue || !queue.currentTrack) {
      return void interaction.followUp({ embeds: [errorEmbed] });
    }

    if (queue.size + 1 > 0) {
      const lista = queue.tracks
        .toArray()
        .slice(0, 25)
        .map((musica, index) => `\`${index + 1}\` **${musica.title}**`)
        .join("\n");

      const queueEmbed = new EmbedBuilder()
        .setTitle("Tocando agora")
        .setDescription(`:notes: **${queue.currentTrack.title}**!\n${lista}`)
        .setColor(config.colors.mainColor);

      return void interaction.followUp({
        embeds: [queueEmbed],
      });
    }
  },
});
