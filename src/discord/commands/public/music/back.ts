import { Command } from "@/discord/base";
import { config } from "@/settings/config";
import { useHistory } from "discord-player";
import { ApplicationCommandType } from "discord.js";

new Command({
  name: "back",
  description: "Volta para a música anterior",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    await interaction.deferReply();

    const history = useHistory(interaction.guildId);

    if (!history || history.isEmpty()) {
      return interaction.followUp({
        embeds: [
          {
            description: ":no_entry: Nenhuma música tocando no momento",
            color: config.colors.mainColor,
          },
        ],
      });
    }

    await history.back();

    interaction.followUp({
      embeds: [
        {
          description: "Voltando para a música anterior.",
          color: config.colors.mainColor,
        },
      ],
    });
  },
});
