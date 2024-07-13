import { Command } from "@/discord/base";
import { isInVoiceChannel } from "@/functions/isInVoiceChannel";
import { isQueueEmpty } from "@/functions/isQueueEmpty";
import { config } from "@/settings/config";
import { useQueue } from "discord-player";
import { ApplicationCommandType, Embed, EmbedBuilder } from "discord.js";

new Command({
  name: "queue",
  description: "Exibe a fila de músicas.",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    const queue = useQueue(interaction.guild.id);

    const isUserInVoiceChannel = await isInVoiceChannel(interaction);
    const isQueueEmptyCheck = await isQueueEmpty(interaction, queue);

    if (!isUserInVoiceChannel || isQueueEmptyCheck) return;

    if (queue && queue?.size + 1 > 0) {
      const lista = queue?.tracks
        .toArray()
        .slice(0, 25)
        .map((musica, index) => `\`${index + 1}\` **${musica.title}**`)
        .join("\n");

      const queueEmbed = new EmbedBuilder()
        .setTitle("Tocando agora")
        .setDescription(`:notes: **${queue?.currentTrack?.title}**!\n${lista}`)
        .setColor(config.colors.mainColor);

      return void interaction.followUp({
        embeds: [queueEmbed],
      });
    }
  },
});
