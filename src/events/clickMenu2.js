const Discord = require("discord.js");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const voiceUserParent = require("../schemas/voiceUserParent");
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const nameData = require("../schemas/names")
const conf = require("../configs/settings.json")
const ayarlar = require("../configs/sunucuayar.json")
const { voice, mesaj2, star} = require("../configs/emojis.json")

const moment = require("moment");
moment.locale("tr");

module.exports = async ( menu, message, args ) => {

    await menu.clicker.fetch();
    menu.reply.think(true)

////////////////////////////////////////////////////////////////////////////////////////////

    const member = menu.clicker.member;
    const inviterData = await inviterSchema.findOne({ guildID: conf.guildID, userID: menu.clicker.member.id });
    const total = inviterData ? inviterData.total : 0;
    const regular = inviterData ? inviterData.regular : 0;
    const bonus = inviterData ? inviterData.bonus : 0;
    const leave = inviterData ? inviterData.leave : 0;
    const fake = inviterData ? inviterData.fake : 0;
    const invMember = await inviteMemberSchema.find({ guildID: conf.guildID, inviter: menu.clicker.member.id });
    const daily = invMember ? menu.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
    const weekly = invMember ? menu.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;
    const tagged = invMember ? menu.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && m.user.username.includes(conf.tag)).size : 0;

////////////////////////////////////////////////////////////////////////////////////////////

   const data = await nameData.findOne({ guildID: conf.guildID, userID: member.user.id });

////////////////////////////////////////////////////////////////////////////////////////////

 const messageData = await messageUser.findOne({ guildID: conf.guildID, userID: menu.clicker.member.id });
 const voiceData = await voiceUser.findOne({ guildID: conf.guildID, userID: menu.clicker.member.id });

      const messageWeekly = messageData ? messageData.weeklyStat : 0;
      const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]");
      const messageDaily = messageData ? messageData.dailyStat : 0;
      const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]");
////////////////////////////////////////////////////////////////////////////////////////////

    const category = async (parentsArray) => {
      const data = await voiceUserParent.find({ guildID: conf.guildID, userID: member.id });
      const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
      let voiceStat = 0;
      for (var i = 0; i <= voiceUserParentData.length; i++) {
        voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
      }
      return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
    };


////////////////////////////////////////////////////////////////////////////////////////////

    if (menu.values[0] === "I") {
        setTimeout(() => { 
        menu.reply.edit(`Sunucuya Katılma Tarihiniz :  \`${moment(menu.clicker.member.joinedAt).format('D/MMMM/YYYY')}\``)
    },3000)  
    }

    if (menu.values[0] === "II") {
        setTimeout(() => { 
        menu.reply.edit(`Üzerinde Bulunan Rollerin Listesi ;
        
${(menu.clicker.member.roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(' ') ? menu.clicker.member.roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(', ') : 'Hiç yok.')}`)
    },3000)  
    }

    if (menu.values[0] === "III") {
        setTimeout(() => { 
        menu.reply.edit(`Hesabınızın Açılış Tarihi :  \`${moment(menu.clicker.member.user.createdAt).format("LLL")}\``)
    },3000)  
    }

    if (menu.values[0] === "IV") {
        setTimeout(() => { 
        menu.reply.edit(`
${menu.clicker.member.toString()}, üyesinin \`${moment(Date.now() + (1000*60*60*3)).format("LLL")}\` tarihinden  itibaren \`Revulion ✬ #MUTLUYARINLAR\` sunucusunda toplam invite bilgileri aşağıda belirtilmiştir.
Toplam **${regular}** davet.

<a:tik:899680497427431424> \`(${total} gerçek, ${bonus} bonus, ${leave} ayrılmış, ${fake} fake)\`
      
<a:tik:899680497427431424> \`Günlük: ${daily}, Haftalık: ${weekly}, Taglı: ${tagged}\`
`)
    },3000)  
    }

    if (menu.values[0] === "V") {
        await member.roles.set(ayarlar.unregRoles);

        setTimeout(() => { 
        menu.reply.edit(`${menu.clicker.member.toString()} üyesi başarıyla kayıtsıza atıldı!`)
    },3000)  
    }

    if (menu.values[0] === "VI") {
        setTimeout(() => { 
        menu.reply.edit(`
<:miniicon:899339236724068372> Sesli kanallardaki üye sayısı : \`${(menu.guild.members.cache.filter((x) => x.voice.channel).size)}\`
<:miniicon:899339236724068372> Sunucudaki toplam üye sayısı : \`${(menu.guild.memberCount)}\`
<:miniicon:899339236724068372> Sunucunun oluşturulma tarihi: \`${moment(menu.guild.createdAt).locale("tr").format("LLL")}\`
<:miniicon:899339236724068372> Sunucu destek numarası : \`${(menu.guild.id)}\`
`)
    },3000)  
    }

    if (menu.values[0] === "VII") {

     const ambed = new Discord.MessageEmbed()
     .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
     .setTitle(`${member.user.username} üyesinin isim bilgileri;`)
     .setDescription(data ? data.names.splice(0, 10).map((x, i) => `\`${i + 1}.\` \`${x.name}\` (${x.rol}) , (<@${x.yetkili}>) , **[**\`${moment(x.date).format("LLL")}\`**]**`).join("\n") : "")
              
        setTimeout(() => { 
        menu.reply.edit(ambed,true)
    },3000)  
    }

    if (menu.values[0] === "VIII") {
        setTimeout(() => { 
        menu.reply.edit(`
${menu.clicker.member.toString()}, üyesinin \`${moment(Date.now() + (1000*60*60*3)).format("LLL")}\` tarihinden  itibaren \`Revulion ✬ #MUTLUYARINLAR\` sunucusunda toplam mesaj bilgileri aşağıda belirtilmiştir.

<a:tik:899680497427431424> **Mesaj İstatistiği**
<:tik:899339236724068372> Toplam: \`${messageData ? messageData.topStat : 0}\`

<:tik:899339236724068372> Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
<:tik:899339236724068372> Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
`)
    },3000)  
    }

    if (menu.values[0] === "IX") {
setTimeout(() => {
menu.reply.edit(`
${menu.clicker.member.toString()}, üyesinin \`${moment(Date.now() + (1000*60*60*3)).format("LLL")}\` tarihinden  itibaren \`Revulion ✬ #MUTLUYARINLAR\` sunucusunda toplam ses bilgileri aşağıda belirtilmiştir.

<a:tik:899680497427431424> **Sesli Sohbet İstatistiği**
<:tik:899339236724068372> Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika] s [saniye]")}\`

<:tik:899339236724068372> Haftalık Ses: \`${voiceWeekly}\`
<:tik:899339236724068372> Günlük Ses: \`${voiceDaily}\`
`,true);

    },3000)  
    }

}
module.exports.conf = {
    name: "clickMenu",
  };

