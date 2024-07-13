import { CommandInteraction, GuildMember } from "discord.js";

export async function isInVoiceChannel(
  interaction: CommandInteraction
): Promise<boolean> {
  if (!interaction.deferred) {
    await interaction.deferReply();
  }

  const member = interaction.member as GuildMember;

  if (!member || !member.voice.channel) {
    await interaction.followUp({
      embeds: [
        {
          description: "⛔ Você precisar estar em um canal de voz!",
          color: 0xed4245,
        },
      ],
    });
    return false;
  }

  const botMember = interaction.guild?.members.me;

  if (
    botMember?.voice.channelId &&
    member.voice.channelId !== botMember.voice.channelId
  ) {
    await interaction.followUp({
      embeds: [
        {
          description: "⛔ Você precisar estar no mesmo canal que eu!",
          color: 0xed4245,
        },
      ],
    });
    return false;
  }
  return true;
}
