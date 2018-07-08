const Discord = require("discord.js");
const DiscordRPC = require("discord-rpc");
const bot = new Discord.Client();
const msg = new Discord.Message();
var net = require('net');
var http = require("http");
var url = require("url");
var path = require("path");
var request = require("request");
var commands = require("./commands.json");
var tokens = require("./exclude/tokens.json");
var fs = require("fs");
const package = require("./package.json");
const { app, BrowserWindow } = require('electron');
var date = new Date();

// -----CHANNELS-----
var logChannel = "423939166401855518";
var newcomerChannel = "423937750937501697";
// ----------

function createWindow() {
    var win = new BrowserWindow({ width: 1300, height: 800, frame: false })
    win.on('closed', () => {
        win = null
    })
    win.show();
    win.setTitle("ratzBot Server");
    win.loadURL(url.format({
        pathname: path.join(__dirname, "main.html"),
        protocol: "file",
        slashes: true
    }))
}

app.on(`ready`, createWindow);

bot.on('message', (message) => {
    try {
        if (fs.readFileSync("./exclude/bannedusers.ratz").includes(message.author.id.toString()) == true) {
            message.channel.send(`${message.author}, you are banned from communicating in the server.`);
            message.delete();
        }
        else {
            if (fs.readFileSync("./exclude/users.ratz").includes(message.author.id.toString()) == false) {
                if (message.content.toString() == "/ratz slimedog") {
                    fs.appendFileSync("./exclude/users.ratz", `\r\n${message.author.id.toString()}`);
                    message.delete();
                    message.channel.send(`${message.author}, you now have access to type in the server!`);
                }
                else {
                    message.delete();
                    message.channel.send(`${message.author}, you have not completely read the rules in order to have access to chat. To get access, re-read the rules and type the secret response message specified.`)
                }
            }
            else {
                // ---COMMANDS---
                if (message.content.toString().startsWith("/ratz discorduserinfo ")) {
                    var result = message.content.slice(22);
                    try {
                        var user = bot.users.find("id", result);
                        var embed = new Discord.RichEmbed()
                            .setTitle(`Discord User Information for ${user.username}`)
                            .setColor(0xcb00ff)
                            .setThumbnail(user.avatarURL)
                            .addField(`Username`, user.username)
                            .addField(`ID`, user.id)
                            .addField(`Tag`, user.tag)
                            .addField(`Account Created`, user.createdTimestamp)
                            .addField(`Last Message ID`, user.lastMessageID)
                        message.channel.send(embed);
                    }
                    catch (err) {
                        message.channel.send(`${message.author}, there was a problem that occurred while processing the command.`);
                    }
                }
                if (message.content.toString() == "/ratz slimedog") {
                    message.channel.send(`${message.author}, you are already authorized to type in the server!`);
                }
                if (message.content.toString() == "/ratz showcommands") {
                    var i;
                    const embed = new Discord.RichEmbed()
                        .setTitle(`Commands for ratzBot`)
                        .setColor(0xcb00ff)
                        .setThumbnail(bot.user.avatarURL.toString())
                    for (i = 0; commands.names[i]; i++) {
                        for (i = 0; commands.definitions[i]; i++) {
                            embed.addField(commands.names[i], commands.definitions[i]);
                        }
                    }
                    message.channel.send({ embed });
                }
                if (message.content.toString() == "/ratz botinfo") {
                    var embed = new Discord.RichEmbed()
                        .setTitle("ratzBot Information")
                        .setThumbnail(bot.user.avatarURL.toString())
                        .setColor(0xcb00ff)
                        .addField("Developer", "Gavin Isgar (https://www.github.com/gisgar3/)")
                        .addField("Version Number", package.version)
                        .addField("Source Languages", "JavaScript\nTypeScript")
                        .addField("GitHub Repository", "https://www.github.com/gisgar3/ratzbot/")
                    message.channel.send(embed);
                }
                if (message.content.startsWith("/ratz steamuserinfo ")) {
                    var result = message.content.slice(20);
                    var getSteamProfile = {
                        method: "GET",
                        url: `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${tokens.steamtoken}&steamids=${result}`,
                    }
                    request(getSteamProfile, (error, response, body) => {
                        try {
                            if (!error & response.statusCode == 200) {
                                var stats = JSON.parse(body);
                                const embed = new Discord.RichEmbed()
                                    .setTitle(`Steam User Information for ${stats.response.players[0].steamid}`)
                                    .setURL(stats.response.players[0].profileurl)
                                    .setColor(0xcb00ff)
                                    .setThumbnail(stats.response.players[0].avatarfull)
                                    .addField("Username", stats.response.players[0].personaname)
                                    .addField("Profile State", stats.response.players[0].profilestate)
                                    .addField("Primary Clan", stats.response.players[0].primaryclanid)
                                    .addField("Last Logoff", stats.response.players[0].lastlogoff)
                                    .addField("Account Created", stats.response.players[0].timecreated);
                                message.channel.send({ embed });
                            }
                        }
                        catch (err) {
                            console.log(`ERROR: ${err}`);
                        }
                    })
                }
                // -----TOPIC DETECTION AND REVIEW-----
                if ((message.content.includes("XXXTentacion") || message.content.includes("xxxtentacion")) && (message.content.includes("death") || message.content.includes("died"))) {
                    if (fs.readFileSync("./exclude/approvedmessages.ratz").includes(message.content.toString())) {
                        // Nothing
                    }
                    else {
                        fs.appendFileSync("./exclude/bannedmessages.ratz", `\r\n(${message.author.username} [${message.author.id}], ${message.createdTimestamp}) ${message.content.toString()}`);
                        message.delete();
                        message.channel.send(`${message.author}, your message was deleted because it possibly relates to a blocked topic. To appeal the deletion of your message, contact an administrator.`);
                    }
                }
            }
        }
    }
    catch (err) {
        var date = new Date();
        fs.appendFileSync("./exclude/errors.ratz", `\r\nERROR at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}: ${err}`);
    }
})

bot.on("guildMemberAdd", (member) => {
    bot.channels.get(newcomerChannel).send(`**| WELCOME |** ${member} has joined the server!`);
})

bot.on("guildMemberRemove", (member) => {
    bot.channels.get(newcomerChannel).send(`**| GOODBYE |** ${member} has left the server!`);
})

bot.on("error", (error) => {
    fs.appendFileSync("./exclude/errors.ratz", `\r\nERROR at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}: ${error.name} | ${error.message}\n`);
})


bot.login(tokens.bottoken);