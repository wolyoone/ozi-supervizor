module.exports = {
    conf: {
      aliases: ["link","url"],
      name: "link",
      help: "link"
    },
  
run: async (client, message, args, embed, prefix) => {
message.lineReply(`discord.gg/${message.guild.vanityURLCode}`)
},
  };
