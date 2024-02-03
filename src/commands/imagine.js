const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');
const { REPLICATE_API_KEY } = require('../../config.json');
const models = require('../models');

module.exports = {
  run: async ({ interaction }) => {
    try {
      await interaction.deferReply();

      const { default: Replicate } = await import('replicate');

      const replicate = new Replicate({
        auth: process.env.REPLICATE_API,
      });

      const prompt = interaction.options.getString('prompt');
      const model = interaction.options.getString('model') || models[0].value;

      const output = await replicate.run(model, { input: { prompt } });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel(`Загрузить`)
          .setStyle(ButtonStyle.Link)
          .setURL(`${output[0]}`)
          .setEmoji('1101133529607327764')
      );

      const resultEmbed = new EmbedBuilder()
        .setTitle('Изображение создано!')
        .addFields({ name: 'Запрос', value: prompt })
        .setImage(output[0])
        .setColor('BLURPLE')
        .setFooter({
          text: `Запросил ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });

      await interaction.editReply({
        embeds: [resultEmbed],
        components: [row],
      });
    } catch (error) {
      const errEmbed = new EmbedBuilder()
        .setTitle('Произошла ошибка')
        .setDescription('```' + error + '```')
        .setColor('RED');

      interaction.editReply({ embeds: [errEmbed] });
    }
  },

  data: {
    name: 'imagine',
    description: 'Генирация изображение за запросом.',
    options: [
      {
        name: 'prompt',
        description: 'Введите запрос.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'model',
        description: 'Модель изображения.',
        type: ApplicationCommandOptionType.String,
        choices: models,
        required: false,
      },
    ],
  },
};
