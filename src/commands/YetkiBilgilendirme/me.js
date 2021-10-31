const moment = require("moment");
require("moment-duration-format");
const conf = require("../../configs/sunucuayar.json");
const messageUserChannel = require("../../schemas/messageUserChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
const voiceUserParent = require("../../schemas/voiceUserParent");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const cezapuan = require("../../schemas/cezapuan");
const coin = require("../../schemas/coin");
const taggeds = require("../../schemas/taggeds");
const yetkis = require("../../schemas/yetkis");
const ceza = require("../../schemas/ceza");
const toplams = require("../../schemas/toplams");
const inviterSchema = require("../../schemas/inviter");
const gorev = require("../../schemas/invite");
const kayitg = require("../../schemas/kayitgorev");
const mesaj = require("../../schemas/mesajgorev");
const tagli = require("../../schemas/taggorev");
const {  xp, gulucuk, mesaj2, altin, altin2 ,rewards ,star , fill, empty, fillStart, emptyEnd, fillEnd, red } = require("../../configs/emojis.json");
const { TeamMember, MessageEmbed } = require("discord.js");
const { MessageButton,MessageActionRow } = require('discord-buttons');

module.exports = {
  conf: {
    aliases: ["ystat"],
    name: "yetkim",
    help: "yetkim"
  },

  run: async (client, message, args, embed) => {
    if(!conf.staffs.some(rol => message.member.roles.cache.has(rol))) return message.react(red)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!conf.staffs.some(rol => member.roles.cache.has(rol))) return message.react(red)
    const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.user.id }).sort({ channelData: -1 });
    const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.user.id }).sort({ channelData: -1 });

    Active1.length > 0 ? messageTop = Active1.splice(0, 5).map(x => `<#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "Veri bulunmuyor."
    Active2.length > 0 ? voiceTop = Active2.splice(0, 5).map(x => `<#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika] s [saniye]")}\``).join("\n") : voiceTop = "Veri bulunmuyor."
    
    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const messageWeekly = messageData ? messageData.weeklyStat : 0;
    const messageDaily = messageData ? messageData.dailyStat : 0;
    
    const coinData = await coin.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });

 

    const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] || client.ranks[client.ranks.length-1];
    const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: member.user.id });
    const toplamData = await toplams.findOne({ guildID: message.guild.id, userID: member.user.id });
    const yetkiData = await yetkis.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezaData = await ceza.findOne({ guildID: message.guild.id, userID: member.user.id });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      const gorevData = await gorev.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total2 = gorevData ? gorevData.invite : 0;
    const maxValue1 = "10"
    const coinStatus1 = client.ranks.length > 0 ?
`**İnvite Görev Durumu :** 
<a:staff:899680505119780895> ${progressBar1(gorevData ? gorevData.invite : 0, 10, 10)} \`${total2} (${total2}/10)\` 
` : "";
          //
    const kayitgData = await kayitg.findOne({ guildID: message.guild.id, userID: member.user.id });
    const kayittotal = kayitgData ? kayitgData.kayit : 0;
    const maxValue2 = "10"
    const coinStatus2 = client.ranks.length > 0 ?
`**Kayıt Görev Durumu :**  
<a:Muhabbet:899339317896429641> ${progressBar(kayitgData ? kayitgData.kayit : 0, 10, 10)} \`${kayittotal} (${kayittotal}/10)\`
` : "";
          //
    const mesajData = await mesaj.findOne({ guildID: message.guild.id, userID: member.user.id });
    const mesajtotal = mesajData ? mesajData.mesaj : 0;
    const maxValue3 = "10"
    const coinStatus3 = client.ranks.length > 0 ?
`**Mesaj Görev Durumu :**  
${mesaj2} ${progressBar1(mesajData ? mesajData.mesaj : 0, 500, 5)} \`${mesajtotal} (${mesajtotal}/500)\`
` : "";
          //
    const tagData = await tagli.findOne({ guildID: message.guild.id, userID: member.user.id });
    const tagTotal = tagData ? tagData.tagli : 0;
    const maxValue4 = "5"
    const coinStatus4 = client.ranks.length > 0 ?
`**Taglı Üye Durumu :**  
<a:galp:899680513806184570> ${progressBar1(tagData ? tagData.tagli : 0, 5, 5)} \`${tagTotal} (${tagTotal}/5)\`
` : "";

function progressBar1(value, maxValue, size) {
  const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
  const emptyProgress = size - progress > 0 ? size - progress : 0;
  if (progress === maxValue) return "Tamamlandı!";

  const progressText = fill.repeat(progress);
  const emptyProgressText = empty.repeat(emptyProgress);
  
  return emptyProgress > 0 ? fillStart+progressText+emptyProgressText+emptyEnd : fillStart+progressText+emptyProgressText+fillEnd;
  
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;

        const category = async (parentsArray) => {
        const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id });
        const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
        let voiceStat = 0;
        for (var i = 0; i <= voiceUserParentData.length; i++) {
          voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
        }
        return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
      };
      
      let currentRank = client.ranks.filter(x => (coinData ? coinData.coin : 0) >= x.coin);
      currentRank = currentRank[currentRank.length-1];

      const coinStatus = message.member.hasRole(conf.staffs, false) && client.ranks.length > 0 ?
      `${currentRank ?`
      ${currentRank !== client.ranks[client.ranks.length-1] ? `Şu an ${Array.isArray(currentRank.role) ? currentRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${currentRank.role}>`} rolündesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin-coinData.coin}\` puan daha kazanmanız gerekiyor!` : "Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz. :)"}` : ` 
      Şuan ${message.member.roles.highest} rolündesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin - (coinData ? coinData.coin : 0)}\`  Puan daha kazanmanız gerekiyor!`}` : ""
      
    var PuanDetaylari = new MessageButton()
    .setLabel("Puan Detayları")
    .setID("puan_detaylari")
    .setStyle("green")
    .setEmoji("899680530239455282")

    var GenelPuanDetaylari = new MessageButton()
    .setLabel("Genel Puan Detayları")
    .setID("genel_puan_detaylari")
    .setStyle("blurple")
    .setEmoji("899680497427431424")

    var tassk = new MessageButton()
    .setLabel("Görev")
    .setID("tassk_button")
    .setStyle("gray")
    .setEmoji("899680505119780895")

    var Iptal = new MessageButton()
    .setLabel("İptal")
    .setID("iptal_button")
    .setStyle("red")
    .setEmoji("899337291582046228")

    const row = new MessageActionRow()
    .addComponents(PuanDetaylari, GenelPuanDetaylari, tassk, Iptal)

embed.setDescription(`
${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgileri aşağıda belirtilmiştir.
`)

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
{ name:"__**Toplam Kayıt**__",  value: `
\`\`\`fix
${toplamData ? `${toplamData.toplams.length} kişi`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
)
  
.addFields(
{ name: "__**Toplam Davet**__", value: `
\`\`\`fix
${inviterData ? `${total} regular`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
{ name: "__**Toplam Taglı**__", value: `
\`\`\`fix
${taggedData ? `${taggedData.taggeds.length} kişi`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
{ name: "__**Toplam Yetkili**__", value: `
\`\`\`fix
${yetkiData ? `${yetkiData.yetkis.length} kişi` : "Veri bulunmuyor."}
\`\`\`
`, inline: true }
)
  
  
  embed.addField("<a:yildizkirmizi:899680497427431424> **Sesli Sohbet İstatistiği**", `
  <:miniicon:899339236724068372> Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
  <:miniicon:899339236724068372> Public Odalar: \`${await category(conf.publicParents)}\`
  <:miniicon:899339236724068372> Secret Odalar: \`${await category(conf.privateParents)}\`
  <:miniicon:899339236724068372> Alone Odalar: \`${await category(conf.aloneParents)}\`
  <:miniicon:899339236724068372> Yönetim Yetkili Odaları: \`${await category(conf.funParents)}\`
  <:miniicon:899339236724068372> Kayıt Odaları: \`${await category(conf.registerParents)}\`
   `, false);
  
  
  embed.addField("<a:yildizkirmizi:899680497427431424> **Mesaj İstatistiği**", `
  <:miniicon:899339236724068372> Toplam: \`${messageData ? messageData.topStat : 0}\`
  <:miniicon:899339236724068372> Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
  <:miniicon:899339236724068372> Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
   `, false);

   

    let msg = await message.channel.send(embed, { components: [row] });
    var filter = (button) => button.clicker.user.id === message.author.id;
   
    let collector = await msg.createButtonCollector(filter, { time: 99999999 })
    collector.on("collect", async (button) => {
      if(button.id === "puan_detaylari") {
        await button.reply.defer()
      const puan = new MessageEmbed()
      .setDescription(`
      ${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda puanlama tablosu aşağıda belirtilmiştir.
      `) 
      
      .addField("<a:yildizkirmizi:899680497427431424> **Puan Durumu:**", `
      Puanınız: \`${coinData ? Math.floor(coinData.coin) : 0}\`, Gereken Puan: \`${maxValue.coin}\`
      ${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 9)} \`${coinData ? coinData.coin : 0} / ${maxValue.coin}\`
       `, false)
      
      .addField("<a:yildizkirmizi:899680497427431424> **Puan Detayları:**", `
      <:miniicon:899339236724068372> Kayıtlar: \`${toplamData ? toplamData.toplams.length : 0} (Puan Etkisi: +${toplamData ? toplamData.toplams.length*5.5 : 0})\`
      <:miniicon:899339236724068372> Taglılar: \`${taggedData ? taggedData.taggeds.length : 0} (Puan Etkisi: +${taggedData ? taggedData.taggeds.length*25 : 0})\`
      <:miniicon:899339236724068372> Davetler: \`${total} (Puan Etkisi: +${total*15})\`
      <:miniicon:899339236724068372> Yetkililer: \`${yetkiData ? yetkiData.yetkis.length : 0} kişi (Puan Etkisi: +${yetkiData ? yetkiData.yetkis.length*30 : 0})\`
      <:miniicon:899339236724068372> Chat Puan: \`${messageData ? messageData.topStat : 0} mesaj (Puan Etkisi: +${messageData ? messageData.topStat*2 : 0})\`
      <:miniicon:899339236724068372> Sesli Puan: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("m")} dakika (Puan Etkisi: +${moment.duration(voiceData ? voiceData.topStat : 0).format("m")*4})\`
       `, false)
      
      .addField("**<a:yildizkirmizi:899680497427431424> Yetki Durumu:** ", `
      ${coinStatus}
       `, false);  

msg.edit({
  embed : puan,
  components : row
})
      
      }

  if(button.id === "genel_puan_detaylari") {
    await button.reply.defer()
    const ceza = new MessageEmbed()
    .setDescription(`
    ${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden itibaren \`${message.guild.name}\` sunucusunda genel puanlama tablosu aşağıda belirtilmiştir.
`) 
.addField("<a:yildizkirmizi:899680497427431424> **Puan Detayları:**", `
<:miniicon:899339236724068372> Kayıt: (\`Puan Etkisi: +${toplamData ? toplamData.toplams.length*5.5 : 0}\`)
<:miniicon:899339236724068372> Taglı: (\`Puan Etkisi: +${taggedData ? taggedData.taggeds.length*25 : 0}\`)
<:miniicon:899339236724068372> Davet: (\`Puan Etkisi: +${total*15}\`)
<:miniicon:899339236724068372> Yetkili: (\`Puan Etkisi: +${yetkiData ? yetkiData.yetkis.length*30 : 0}\`)
<:miniicon:899339236724068372> Toplam Ses: (\`Puan Etkisi: +${moment.duration(voiceData ? voiceData.topStat : 0).format("m")*4}\`)
<:miniicon:899339236724068372> Toplam Mesaj: (\`Puan Etkisi: +${messageData ? messageData.topStat*2 : 0}\`)
<:miniicon:899339236724068372> Toplam Aldığın Cezalar : ${cezapuanData ? cezapuanData.cezapuan.length : 0} (\`Toplam ${cezaData ? cezaData.ceza.length : 0}\`)
 `, false)

.addField("<a:yildizkirmizi:899680497427431424> **Net Puanlama Bilgisi**", `
<:miniicon:899339236724068372> Kayıt işlemi yaparak, \`+5.5\` puan kazanırsın.
<:miniicon:899339236724068372> Taglı üye belirleyerek, \`+25\` puan kazanırsınız.
<:miniicon:899339236724068372> İnsanları davet ederek, \`+15\` puan kazanırsın.
<:miniicon:899339236724068372> İnsanları yetkili yaparak, \`+30\` puan kazanırsın.
<:miniicon:899339236724068372> Seste kalarak, ortalama olarak \`+4\` puan kazanırsınız.
<:miniicon:899339236724068372> Yazı yazarak, ortalama olarak, \`+2\` puan kazanırsınız.
 `, false)

.addField("<a:yildizkirmizi:899680497427431424> **Puan Durumu:**", `
Puanınız: \`${coinData ? Math.floor(coinData.coin) : 0}\`, Gereken Puan: \`${maxValue.coin}\`
${progressBar(coinData ? coinData.coin : 0, maxValue.coin, 9)} \`${coinData ? coinData.coin : 0} / ${maxValue.coin}\`
 `, false)

.addField("<a:yildizkirmizi:899680497427431424> **Yetki Durumu:** ", `
${coinStatus}
 `, false)

msg.edit({
  embed: ceza,
  components : row
})  
    }

    if(button.id === "tassk_button") {
      await button.reply.defer()
      const task = new MessageEmbed()
      .setDescription(`
      ${member.toString()}, (${member.roles.highest}) rolüne ait görevlerin aşağıda belirtilmiştir. Görevler tamamlandığında tamamladığın görevlerin ödüllerini almak için \`.görevlerim ödül\` komutu ile alabilirsiniz.  

      Kalan Süre: \`${moment.duration(moment().endOf('day').valueOf() - Date.now()).format("H [saat], m [dakika] s [saniye]")}\`
      5 görevi tamamlamak sana toplam \`120 Coin\` verecektir!
                
      ${coinStatus1} **Ödülün :** ${rewards} \`30\` Coin\n
      ${coinStatus2} **Ödülün :** ${rewards} \`30\` Coin\n
      ${coinStatus3} **Ödülün :** ${rewards} \`30\` Coin\n
      ${coinStatus4} **Ödülün :** ${rewards} \`30\` Coin\n
      `)

      .addField("**<a:yildizkirmizi:899680497427431424> Yetki Durumu:** ", `
      ${coinStatus}
       `, false); 

  msg.edit({
    embed: task,
    components : row
  })
      
      }

      if(button.id === "iptal_button") {
        await button.reply.defer()
        const iptal = new MessageEmbed()
        .setDescription(`
${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgileri aşağıda belirtilmiştir.
`)

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
{ name:"__**Toplam Kayıt**__",  value: `
\`\`\`fix
 ${toplamData ? `${toplamData.toplams.length} kişi`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
)
  
.addFields(
{ name: "__**Toplam Davet**__", value: `
\`\`\`fix
${inviterData ? `${total} regular`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
{ name: "__**Toplam Taglı**__", value: `
\`\`\`fix
${taggedData ? `${taggedData.taggeds.length} kişi`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
{ name: "__**Toplam Yetkili**__", value: `
\`\`\`fix
${yetkiData ? `${yetkiData.yetkis.length} kişi` : "Veri bulunmuyor."}
\`\`\`
`, inline: true }
)
  
  
  iptal.addField("<a:yildizkirmizi:899680497427431424> **Sesli Sohbet İstatistiği**", `
  <:miniicon:899339236724068372> Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
  <:miniicon:899339236724068372> Public Odalar: \`${await category(conf.publicParents)}\`
  <:miniicon:899339236724068372> Secret Odalar: \`${await category(conf.privateParents)}\`
  <:miniicon:899339236724068372> Alone Odalar: \`${await category(conf.aloneParents)}\`
  <:miniicon:899339236724068372> Yönetim Yetkili Odaları: \`${await category(conf.funParents)}\`
  <:miniicon:899339236724068372> Kayıt Odaları: \`${await category(conf.registerParents)}\`
   `, false);
  
  
   iptal.addField("<a:yildizkirmizi:899680497427431424> **Mesaj İstatistiği**", `
  <:miniicon:899339236724068372> Toplam: \`${messageData ? messageData.topStat : 0}\`
  <:miniicon:899339236724068372> Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
  <:miniicon:899339236724068372> Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
   `, false);

    msg.edit({
      embed: iptal,
      components : row
    })
        
        }

  })
  }
};

function progressBar(value, maxValue, size) {
const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
const emptyProgress = size - progress > 0 ? size - progress : 0;

const progressText = fill.repeat(progress);
const emptyProgressText = empty.repeat(emptyProgress);

return emptyProgress > 0 ? fillStart+progressText+emptyProgressText+emptyEnd : fillStart+progressText+emptyProgressText+fillEnd;
};
