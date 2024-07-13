import { Command } from "@/discord/base";
import { isInVoiceChannel } from "@/functions";
import { isQueueEmpty } from "@/functions/isQueueEmpty";
import { config } from "@/settings/config";
import { useQueue } from "discord-player";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";

new Command({
  name: "stop",
  description: "Encerra a fila",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    const queue = useQueue(interaction.guildId);

    const isUserInVoiceChannel = await isInVoiceChannel(interaction);
    const isQueueEmptyCheck = await isQueueEmpty(interaction, queue);

    if (!isUserInVoiceChannel || isQueueEmptyCheck) return;

    queue?.node.stop();

    interaction.followUp({
      embeds: [
        {
          description: "Parando a fila",
          color: config.colors.mainColor,
        },
      ],
    });
  },
});
