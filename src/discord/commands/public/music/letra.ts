import { Command } from "@/discord/base";
import { config } from "@/settings/config";
import { lyricsExtractor } from "@discord-player/extractor";
import { useQueue } from "discord-player";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";

new Command({
  name: "letra",
  description: "Exibe a letra da música atual.",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    await interaction.deferReply();

    const lyricsFinder = lyricsExtractor(process.env.GENIUS_CLIENT_ACCESS);
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue?.currentTrack) {
      return interaction.followUp({
        content: "Não há nenhuma música tocando no momento.",
      });
    }

    function removeEmojis(text: string) {
      return text.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
        ""
      );
    }

    const searchResult = await lyricsFinder
      .search(removeEmojis(queue?.currentTrack?.title))
      .catch(() => null);

    if (!searchResult) {
      return interaction.followUp({
        content: "Não foi possível encontrar a letra da música.",
      });
    }

    const trimmedLyrics = searchResult.lyrics.substring(0, 1997);

    const embed = new EmbedBuilder()
      .setTitle(searchResult.title)
      .setURL(searchResult.url)
      .setThumbnail(searchResult.thumbnail)
      .setAuthor({
        name: searchResult.artist.name,
        iconURL: searchResult.artist.image,
        url: searchResult.artist.url,
      })
      .setDescription(
        trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics
      )
      .setColor(config.colors.mainColor);

    interaction.followUp({ embeds: [embed] });
  },
});
