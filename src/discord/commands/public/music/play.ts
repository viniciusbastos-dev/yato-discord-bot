import { Command } from "@/discord/base";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { QueryType, useMainPlayer } from "discord-player";
import { config } from "@/settings/config";

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
    const { options } = interaction;

    if (!interaction.deferred) {
      await interaction.deferReply();
    }

    if (!interaction.member || !interaction.member.voice.channel) {
      interaction.followUp({
        embeds: [
          {
            description:
              ":no_entry: Você precisa estar em um canal de voz para usar este comando!",
            color: config.colors.error,
          },
        ],
      });
      return;
    }

    if (
      interaction.guild.members.me?.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.members.me?.voice.channelId
    ) {
      interaction.followUp({
        embeds: [
          {
            description:
              ":no_entry:: Você precisa estar no mesmo canal de voz que eu para usar este comando!",
            color: config.colors.error,
          },
        ],
      });
      return;
    }

    try {
      const query = options.getString("query");

      const searchResult = await player.search(query!, {
        searchEngine: QueryType.AUTO,
      });

      await player.play(interaction.member.voice.channel.id, searchResult, {
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
      });

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
