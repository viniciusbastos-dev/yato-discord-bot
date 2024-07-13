import { Command } from "@/discord/base";
import { isInVoiceChannel } from "@/functions";
import { isQueueEmpty } from "@/functions/isQueueEmpty";
import { config } from "@/settings/config";
import { useQueue } from "discord-player";
import { ApplicationCommandType } from "discord.js";

new Command({
  name: "next",
  description: "Pula para proxima música",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    const queue = useQueue(interaction.guildId);

    const isUserInVoiceChannel = await isInVoiceChannel(interaction);
    const isQueueEmptyCheck = await isQueueEmpty(interaction, queue);

    if (!isUserInVoiceChannel || isQueueEmptyCheck) return;

    queue?.node.skip();

    interaction.followUp({
      embeds: [
        {
          description: "Pulando para a próxima música...",
          color: config.colors.mainColor,
        },
      ],
    });
  },
});
