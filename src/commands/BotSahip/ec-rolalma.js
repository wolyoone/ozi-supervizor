const Discord = require("discord.js");
const conf = require("../../configs/sunucuayar.json");

module.exports = {
  conf: {
    aliases: [],
    name: "ecrolalma",
    owner: true,
  },

  run: async (client, message, args) => {
    client.api.channels(conf.ecrolalmakanal).messages.post({ data: {"content":"Merhaba **Revulion** üyeleri,\nÇekiliş katılımcısı alarak <:ozinitro:899337278047006831> , <:ozispotify:899337292840312912> , <:ozinetflix:899337280790077491> , <:exxen:900396713116835900> , <:blutv:900396707362246666> gibi çeşitli ödüllerin sahibi olabilirsiniz.\nEtkinlik katılımcısı alarak çeşitli etkinliklerin yapıldığı anlarda herkesten önce haberdar olabilirsiniz ve çekilişlere önceden katılma hakkı kazanabilirsiniz.\n\n__Aşağıda ki butonlara basarak siz de bu ödülleri kazanmaya hemen başlayabilirsiniz!__","components":[{"type":1,"components":[

        {"type":2,"style":3,"custom_id":"buttoncekilis","label":"🎁 Çekiliş Katılımcısı"},
        {"type":2,"style":4,"custom_id":"buttonetkinlik","label":"🎉 Etkinlik Katılımcısı"}
        
        ]}]} })
  },
};

  