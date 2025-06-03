import { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Events, WebhookClient } from 'discord.js';
import dotenv from 'dotenv';
import { db } from './firebase.js';

dotenv.config();

const LOG_CHANNEL_ID = '1379267859611521024';

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildWebhooks
  ], 
  partials: ['CHANNEL', 'MESSAGE'] 
});

const commands = [
  new SlashCommandBuilder().setName('check').setDescription('تحقق من ربط حسابك بالموقع'),
  new SlashCommandBuilder().setName('my-scripts').setDescription('عرض السكربتات الخاصة بك'),
  new SlashCommandBuilder()
    .setName('set-channel')
    .setDescription('تحديد قناة لعرض السكربتات الجديدة')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('القناة المطلوبة')
        .setRequired(true)
    )
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands.map(cmd => cmd.toJSON()) });
    console.log('✅ تم تسجيل الكوماندات');
  } catch (err) {
    console.error(err);
  }
})();

client.once('ready', () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
});

async function logChange(user, scriptId, field, oldValue, newValue) {
  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setTitle('🔧 تعديل على سكربت')
    .setColor('Orange')
    .addFields(
      { name: '👤 المستخدم', value: user.tag, inline: true },
      { name: '🆔 معرف السكربت', value: scriptId, inline: true },
      { name: '✏️ الجزء المعدل', value: field },
      { name: '📤 قبل التعديل', value: oldValue?.toString()?.slice(0, 100) || 'غير متوفر' },
      { name: '✅ بعد التعديل', value: newValue?.toString()?.slice(0, 100) || 'غير متوفر' }
    )
    .setTimestamp();

  await logChannel.send({ embeds: [embed] });
}

async function sendScriptToWebhook(scriptData, webhookInfo) {
  try {
    const webhook = new WebhookClient({ id: webhookInfo.id, token: webhookInfo.token });

    const embed = new EmbedBuilder()
      .setTitle(`📢 سكربت جديد: ${scriptData.name}`)
      .setDescription(scriptData.desc || 'لا يوجد وصف')
      .addFields(
        { name: '👤 الناشر', value: scriptData.publisher || 'غير معروف', inline: true },
        { name: '🗺️ الماب', value: scriptData.map || 'غير محدد', inline: true }
      )
      .setImage(scriptData.imageUrl || null)
      .setColor('#5865F2')
      .setTimestamp();

    await webhook.send({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('تحميل السكربت')
            .setURL(`https://scriptbot.cloud/scripts/${scriptData.id}`)
            .setStyle(ButtonStyle.Link)
        )
      ]
    });
  } catch (error) {
    console.error('Error sending to webhook:', error);
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'check') {
      const userId = interaction.user.id;
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('discord.id', '==', userId).get();

      if (snapshot.empty) {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('انشاء حساب الآن 🔗')
            .setURL('https://scriptbot.cloud/register')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setLabel('تسجيل الدخول 🔗')
            .setURL('https://scriptbot.cloud/login')
            .setStyle(ButtonStyle.Link)
        );

        return interaction.reply({
          content: `❌ لم يتم العثور على حساب مرتبط بهذا الديسكورد.`,
          components: [row],
          ephemeral: true
        });
      }

      const userData = snapshot.docs[0].data();
      const embed = new EmbedBuilder()
        .setTitle('🔍 معلومات حسابك')
        .setColor('Blue')
        .addFields(
          { name: '📛 الاسم', value: userData.publisher || 'غير معروف', inline: true },
          { name: '📧 البريد', value: userData.email || 'غير متوفر', inline: true },
          { name: '🆔 معرف المستخدم', value: snapshot.docs[0].id }
        )
        .setFooter({ text: 'ScriptBot | تحقق من ربط الحساب' });

      await interaction.user.send({ embeds: [embed] }).catch(() => {
        interaction.reply({ content: 'لم أتمكن من إرسال رسالة خاصة لك. تأكد من تفعيل الرسائل الخاصة.', ephemeral: true });
      });

      return interaction.reply({ content: '✅ تم إرسال معلوماتك في الخاص.', ephemeral: true });
    }

    if (interaction.commandName === 'my-scripts') {
      const discordId = interaction.user.id;
      const userSnap = await db.collection('users').where('discord.id', '==', discordId).limit(1).get();

      if (userSnap.empty) return interaction.reply({ content: '❌ لم يتم ربط حسابك بعد.', ephemeral: true });
      const userId = userSnap.docs[0].id;

      const scriptsSnap = await db.collection('scripts').where('userId', '==', userId).get();
      if (scriptsSnap.empty) return interaction.reply({ content: '❌ لا توجد سكربتات مضافة.', ephemeral: true });

      const options = scriptsSnap.docs.map(doc => {
        const data = doc.data();
        return new StringSelectMenuOptionBuilder()
          .setLabel(data.name)
          .setValue(doc.id)
          .setDescription(data.map || 'بدون ماب');
      });

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select-script')
        .setPlaceholder('اختر سكربت')
        .addOptions(options);

      const row = new ActionRowBuilder().addComponents(selectMenu);

      return interaction.reply({ content: '📜 اختر سكربت من سكربتاتك:', components: [row], ephemeral: true });
    }

    if (interaction.commandName === 'set-channel') {
      const channel = interaction.options.getChannel('channel');
      const userId = interaction.user.id;

      // التحقق من ربط الحساب
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('discord.id', '==', userId).get();

      if (snapshot.empty) {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('تسجيل الدخول 🔗')
            .setURL('https://scriptbot.cloud/login')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setLabel('إنشاء حساب 🔗')
            .setURL('https://scriptbot.cloud/register')
            .setStyle(ButtonStyle.Link)
        );

        return interaction.reply({
          content: '❌ يجب أن يكون حسابك مرتبطًا بالموقع لاستخدام هذا الأمر.',
          components: [row],
          ephemeral: true
        });
      }

      // التحقق من صلاحيات القناة
      if (channel.type !== 0) { // 0 = GUILD_TEXT
        return interaction.reply({
          content: '❌ يجب تحديد قناة نصية صالحة.',
          ephemeral: true
        });
      }

      try {
        // التحقق من وجود ويب هوك موجود مسبقا وحذفه إذا وجد
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (userData.webhook) {
          try {
            const oldWebhook = new WebhookClient({ id: userData.webhook.id, token: userData.webhook.token });
            await oldWebhook.delete();
          } catch (error) {
            console.log('No existing webhook to delete or error deleting:', error);
          }
        }

        // إنشاء ويب هوك جديد
        const webhook = await channel.createWebhook({
          name: 'ScriptBot Announcements',
          avatar: client.user.displayAvatarURL({ format: 'png' }),
          reason: 'ScriptBot - قناة عرض السكربتات'
        });

        // حفظ معلومات الويب هوك في Firebase
        await usersRef.doc(userDoc.id).update({
          webhook: {
            id: webhook.id,
            token: webhook.token,
            channelId: channel.id,
            guildId: interaction.guild.id,
            url: webhook.url,
            createdAt: new Date().toISOString()
          }
        });

        const embed = new EmbedBuilder()
          .setTitle('✅ تم إعداد القناة بنجاح')
          .setDescription(`سيتم الآن عرض السكربتات الجديدة في ${channel}`)
          .addFields(
            { name: '🆔 معرف الويب هوك', value: webhook.id },
            { name: '📅 تاريخ الإعداد', value: new Date().toLocaleString() },
            { name: '🔗 رابط القناة', value: `[${channel.name}](${webhook.url})` }
          )
          .setColor('Green')
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        return interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error('Error creating webhook:', error);
        return interaction.reply({
          content: '❌ حدث خطأ أثناء إنشاء الويب هوك. تأكد من صلاحيات البوت (Manage Webhooks).',
          ephemeral: true
        });
      }
    }
  }

  if (interaction.isStringSelectMenu() && interaction.customId === 'select-script') {
    const scriptId = interaction.values[0];
    const scriptDoc = await db.collection('scripts').doc(scriptId).get();
    if (!scriptDoc.exists) return interaction.reply({ content: '❌ السكربت غير موجود.', ephemeral: true });

    const script = scriptDoc.data();
    const embed = new EmbedBuilder()
      .setTitle(`📄 ${script.name}`)
      .setDescription(script.desc || 'بدون وصف')
      .addFields(
        { name: '👁️ المشاهدات', value: `${script.views || 0}`, inline: true },
        { name: '📥 التحميلات', value: `${script.downloads || 0}`, inline: true },
        { name: '🗺️ الماب', value: script.map || 'غير محددة', inline: true },
        { name: '🆔 معرف السكربت', value: scriptId, inline: false }
      )
      .setImage(script.imageUrl || null)
      .setColor('#1d4ed8')
      .setFooter({ text: 'ScriptBot | إدارة السكربتات' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`edit_${scriptId}`).setLabel('✏️ تعديل').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`delete_${scriptId}`).setLabel('🗑️ حذف').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`changeimg_${scriptId}`).setLabel('🖼️ تغيير الصورة').setStyle(ButtonStyle.Secondary)
    );

    return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }

  if (interaction.isButton() && interaction.customId.startsWith('delete_')) {
    const scriptId = interaction.customId.split('_')[1];
    await db.collection('scripts').doc(scriptId).delete();
    return interaction.reply({ content: '🗑️ تم حذف السكربت بنجاح.', ephemeral: true });
  }

  if (interaction.isButton() && interaction.customId.startsWith('edit_')) {
    const scriptId = interaction.customId.split('_')[1];
    const scriptDoc = await db.collection('scripts').doc(scriptId).get();
    if (!scriptDoc.exists) return;

    const script = scriptDoc.data();
    const modal = new ModalBuilder()
      .setCustomId(`editmodal_${scriptId}`)
      .setTitle('✏️ تعديل السكربت')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId('new_name').setLabel('اسم السكربت').setStyle(TextInputStyle.Short).setValue(script.name)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId('new_desc').setLabel('الوصف').setStyle(TextInputStyle.Paragraph).setValue(script.desc || '')
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder().setCustomId('new_content').setLabel('نص السكربت').setStyle(TextInputStyle.Paragraph).setValue(script.content?.substring(0, 1000) || '')
        )
      );

    return interaction.showModal(modal);
  }

  if (interaction.isButton() && interaction.customId.startsWith('changeimg_')) {
    const scriptId = interaction.customId.split('_')[1];
    await interaction.reply({ content: '📤 أرسل صورة جديدة الآن لتحديث صورة السكربت. يدعم الأنواع: PNG, JPG, JPEG, WEBP, GIF (بحد أقصى 8MB)', ephemeral: true });

    const filter = m => {
      if (m.author.id !== interaction.user.id || m.attachments.size === 0) return false;

      const attachment = m.attachments.first();
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
      const isValidType = validTypes.includes(attachment.contentType);
      const isValidSize = attachment.size <= 8 * 1024 * 1024;

      return isValidType && isValidSize;
    };

    const collector = interaction.channel.createMessageCollector({ 
      filter, 
      max: 1, 
      time: 60000 
    });

    collector.on('collect', async message => {
      try {
        const image = message.attachments.first();
        const scriptRef = db.collection('scripts').doc(scriptId);
        const scriptDoc = await scriptRef.get();

        if (!scriptDoc.exists) {
          return message.reply('❌ السكربت غير موجود.');
        }

        const oldImageUrl = scriptDoc.data().imageUrl;
        await scriptRef.update({ imageUrl: image.url });

        await message.reply('✅ تم تحديث الصورة بنجاح.');
        await logChange(interaction.user, scriptId, 'الصورة', oldImageUrl, image.url);
      } catch (error) {
        console.error('Error updating image:', error);
        await interaction.followUp({ content: '❌ حدث خطأ أثناء تحديث الصورة.', ephemeral: true });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp({ 
          content: '⏰ انتهى الوقت ولم يتم إرسال صورة صالحة.', 
          ephemeral: true 
        });
      }
    });
  }

  if (interaction.isModalSubmit() && interaction.customId.startsWith('editmodal_')) {
    const scriptId = interaction.customId.split('_')[1];
    const scriptRef = db.collection('scripts').doc(scriptId);
    const scriptDoc = await scriptRef.get();
    const script = scriptDoc.data();

    const newName = interaction.fields.getTextInputValue('new_name');
    const newDesc = interaction.fields.getTextInputValue('new_desc');
    const newContent = interaction.fields.getTextInputValue('new_content');

    await scriptRef.update({ name: newName, desc: newDesc, content: newContent });

    await interaction.reply({ content: '✅ تم تعديل السكربت بنجاح.', ephemeral: true });

    if (script.name !== newName) await logChange(interaction.user, scriptId, 'الاسم', script.name, newName);
    if (script.desc !== newDesc) await logChange(interaction.user, scriptId, 'الوصف', script.desc, newDesc);
    if (script.content !== newContent) await logChange(interaction.user, scriptId, 'السكربت', script.content, newContent);
  }
});

client.login(process.env.DISCORD_TOKEN);