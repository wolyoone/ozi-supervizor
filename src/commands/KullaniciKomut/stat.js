const { voice, mesaj2, star} = require("../../configs/emojis.json")
const messageUserChannel = require("../../schemas/messageUserChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const voiceUserParent = require("../../schemas/voiceUserParent");
const moment = require("moment");
const inviterSchema = require("../../schemas/inviter");
require("moment-duration-format");
const { MessageEmbed } = require("discord.js");
const { MessageButton,MessageActionRow } = require('discord-buttons');
const conf = require("../../configs/sunucuayar.json")
module.exports = {
    conf: {
      aliases: ["stat","me"],
      name: "stat",
      help: "stat"
    },
  
run: async (client, message, args, embed, prefix) => {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;
    const regular = inviterData ? inviterData.regular : 0;
    const bonus = inviterData ? inviterData.bonus : 0;
    const leave = inviterData ? inviterData.leave : 0;
    const fake = inviterData ? inviterData.fake : 0;

    const category = async (parentsArray) => {
        const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id });
        const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
        let voiceStat = 0;
        for (var i = 0; i <= voiceUserParentData.length; i++) {
          voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
        }
        return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
      };
      
      const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
      const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
      let messageTop;
      Active1.length > 0 ? messageTop = Active1.splice(0, 5).map(x => `<#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "Veri bulunmuyor."
      Active2.length > 0 ? voiceTop = Active2.splice(0, 5).map(x => `<#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika] s [saniye]")}\``).join("\n") : voiceTop = "Veri bulunmuyor."
      
      const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id });
      const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.id });
      const messageWeekly = messageData ? messageData.weeklyStat : 0;
      const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]");
      const messageDaily = messageData ? messageData.dailyStat : 0;
      const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]");


      var sescat = new MessageButton()
      .setID("ses")
      .setLabel("🎤 Ses Detayları")
      .setStyle("gray")

      var mescat = new MessageButton()
      .setID("mes")
      .setLabel("✉️ Mesaj Detayları")
      .setStyle("gray")

      var main = new MessageButton()
      .setID("main")
      .setLabel("📋 Ana Sayfa")
      .setStyle("gray")

      const row = new MessageActionRow()
      .addComponent(main)
      .addComponent(sescat)
      .addComponent(mescat);

      embed.setDescription(`${member.toString()} üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgileri aşağıda belirtilmiştir.`)
.addFields(
{ name: "__**Toplam Ses**__",  value: `
\`\`\`fix
${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}
\`\`\`
`, inline: true },
{ name: "__**Toplam Mesaj**__",  value: `
\`\`\`fix
${messageData ? messageData.topStat : 0} mesaj
\`\`\`
`, inline: true },
{ name:"__**Toplam Davet**__",  value: `
\`\`\`fix
${inviterData ? `${total} regular`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
 )

embed.addField("<a:yildizkirmizi:899680497427431424> **Sesli Sohbet İstatistiği**", `

${voice} **Genel Toplam Ses :** \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
${mesaj2} **Genel Toplam Mesaj :** \`${messageData ? messageData.topStat : 0} mesaj\`

${voice} **Haftalık Ses :** \`${voiceWeekly}\`
${mesaj2} **Haftalık Chat :** \`${Number(messageWeekly).toLocaleString()} mesaj\`

${voice} **Günlük Ses :** \`${voiceDaily}\`
${mesaj2} **Günlük Chat :** \`${Number(messageDaily).toLocaleString()} mesaj\`

<a:yildizkirmizi:899680497427431424> **Davetleri :** **${total}** (**${regular}** gerçek, **${bonus}** bonus, **${leave}** ayrılmış, **${fake}** fake)

<a:yildizkirmizi:899680497427431424> **Daha geniş çaplı bilgilere erişmek için lütfen aşağıdaki butonları kullanınız!** 
`, false);

      let msg = await message.channel.send({ buttons : [main, sescat, mescat], embed: embed})
      var filter = (button) => button.clicker.user.id === message.author.id;
     
      let collector = await msg.createButtonCollector(filter, { time: 99999999 })
collector.on("collect", async (button) => {
if(button.id === "ses") {
await button.reply.defer()
const embeds = new MessageEmbed()
.setDescription(`${member.toString()} üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses bilgileri aşağıda belirtilmiştir.`)
.addFields(
{ name: "__**Toplam Ses**__",  value: `
\`\`\`fix
${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}
\`\`\`
`, inline: true },
{ name: "__**Haftalık Ses**__",  value: `
\`\`\`fix
${voiceWeekly}
\`\`\`
`, inline: true },
{ name:"__**Günlük Ses**__",  value: `
\`\`\`fix
${voiceDaily}
\`\`\`
`, inline: true },
)

  embeds.addField("<a:yildizkirmizi:899680497427431424> **Sesli Sohbet İstatistiği**", `
<:miniicon:899339236724068372> Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
<:miniicon:899339236724068372> Public Odalar: \`${await category(conf.publicParents)}\`
<:miniicon:899339236724068372> Secret Odalar: \`${await category(conf.privateParents)}\`
<:miniicon:899339236724068372> Alone Odalar: \`${await category(conf.aloneParents)}\`
<:miniicon:899339236724068372> Yönetim Yetkili Odaları: \`${await category(conf.funParents)}\`
<:miniicon:899339236724068372> Kayıt Odaları: \`${await category(conf.registerParents)}\`
 `, false);

msg.edit({
embed: embeds,
components : row
})}
if(button.id === "mes") {
await button.reply.defer()
const embeds = new MessageEmbed()
.setDescription(`${member.toString()} üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam mesaj bilgileri aşağıda belirtilmiştir.`)

.addFields(
{ name: "__**Toplam Mesaj**__",  value: `
\`\`\`fix
${messageData ? messageData.topStat : 0} mesaj
\`\`\`
`, inline: true },
{ name: "__**Haftalık Mesaj**__",  value: `
\`\`\`fix
${Number(messageWeekly).toLocaleString()} mesaj
\`\`\`
`, inline: true },
{ name:"__**Günlük Mesaj**__",  value: `
\`\`\`fix
${Number(messageDaily).toLocaleString()} mesaj
\`\`\`
`, inline: true },
)
embeds.addField("<a:yildizkirmizi:899680497427431424> **Mesaj İstatistiği**", `
${messageTop}
`, false);
msg.edit({
embed: embeds,
components : row
})}
if(button.id === "main") {
await button.reply.defer()
msg.edit({
embed: embed,
components : row
})}
})
},
};
  