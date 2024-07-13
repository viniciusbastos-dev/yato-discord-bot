import { Command } from "@/discord/base";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { QueryType, useMainPlayer } from "discord-player";
import { config } from "@/settings/config";
import { isInVoiceChannel } from "@/functions";

const player = useMainPlayer();

new Command({
  name: "play",
  description: "Toca músicas a partir de uma busca",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "query",
      description: "Digite o nome ou link da música que deseja tocar",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],
  async autoComplete(interaction, store) {
    const value = interaction.options.getFocused().toLowerCase();

    const result = await player.search(value, {
      searchEngine: QueryType.YOUTUBE_SEARCH,
    });
    const trimString = (str: string, max: number) =>
      str.length > max ? `${str.slice(0, max - 3)}...` : str;

    const choices = result.tracks
      .map((track) => ({
        name: trimString(`${track.title}`, 100),
        value: track.url,
      }))
      .slice(0, 5);

    if (!interaction) return;

    await interaction.respond(choices.map((choice) => choice));
  },
  async run(interaction) {
    const isUserInVoiceChannel = await isInVoiceChannel(interaction);

    if (!isUserInVoiceChannel) return;

    try {
      const { options } = interaction;
      const query = options.getString("query");

      const searchResult = await player.search(query!, {
        searchEngine: QueryType.AUTO,
      });

      await player.play(
        interaction?.member?.voice?.channel?.id!,
        searchResult,
        {
          nodeOptions: {
            metadata: {
              channel: interaction.channel,
              client: interaction.guild?.members.me,
            },
            leaveOnEmptyCooldown: 60000,
            leaveOnEmpty: true,
            leaveOnEndCooldown: 60000,
            leaveOnEnd: true,
            bufferingTimeout: 0,
            volume: 20,
          },
        }
      );

      await interaction.followUp({
        embeds: [
          {
            description: `:stopwatch: Carregando sua ${
              searchResult.playlist ? "playlist" : "música"
            }...`,
            color: config.colors.mainColor,
          },
        ],
      });
    } catch (error) {
      await interaction.followUp({
        embeds: [
          {
            description:
              "Ocorreu um erro ao tentar tocar a música. Por favor, tente novamente.",
            color: config.colors.error,
          },
        ],
      });
      console.log(error);
    }
  },
});
