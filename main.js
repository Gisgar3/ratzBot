// COPYRIGHT (C) GAVIN ISGAR 2017-2018
var Discord = require("discord.js");
var DiscordRPC = require("discord-rpc");
var opus = require("opusscript");
var ffmpeg = require("ffmpeg-binaries");
var ytdl = require("ytdl-core");
var bot = new Discord.Client();
var msg = new Discord.Message();
var net = require('net');
var http = require("http");
var url = require("url");
var path = require("path");
var request = require("request");
var commands = require("./commands.json");
var tokens = require("./exclude/tokens.json");
var fs = require("fs");
var readline = require("readline");
var package = require("./package.json");
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var date = new Date();
//-----SERVER EVENTS-----
var activeevent = "";
// ---------
// -----CHANNELS-----
var logChannel = "423939166401855518";
var newcomerChannel = "423937750937501697";
var mainChannel = "443227379712917505";
// ----------
bot.on('message', function (message) {
    try {
        if (fs.readFileSync("./exclude/bannedusers.ratz").includes(message.author.id.toString()) == true) {
            message.channel.send(message.author + ", you are banned from communicating in the server.");
            message["delete"]();
        }
        else {
            if (fs.readFileSync("./exclude/users.ratz").includes(message.author.id.toString()) == false) {
                if (message.author.username == "GitHub" && message.author.bot == 1) {
                    // Do nothing
                }
                else {
                    if (message.content.toString() == "/ratz slimedog") {
                        fs.appendFileSync("./exclude/users.ratz", "\r\n" + message.author.id.toString());
                        message["delete"]();
                        message.channel.send(message.author + ", you now have access to type in the server!");
                    }
                    else {
                        fs.appendFileSync("./exclude/removedauthmessages.ratz", "\r\n(" + message.author.username + " [" + message.author.id + "], " + message.createdTimestamp + ") " + message.content.toString());
                        message["delete"]();
                        message.channel.send(message.author + ", you have not completely read the rules in order to have access to chat. To get access, re-read the rules and type the secret response message specified.");
                    }
                }
            }
            else {
                // ---COMMANDS---
                if (message.content.toString().startsWith("/ratz discorduserinfo ")) {
                    var result = message.content.slice(22);
                    try {
                        var user = bot.users.find("id", result);
                        var embed = new Discord.RichEmbed()
                            .setTitle("Discord User Information for " + user.username)
                            .setColor(0xcb00ff)
                            .setThumbnail(user.avatarURL)
                            .addField("Username", user.username)
                            .addField("ID", user.id)
                            .addField("Tag", user.tag)
                            .addField("Account Created", user.createdTimestamp)
                            .addField("Last Message ID", user.lastMessageID);
                        message.channel.send(embed);
                    }
                    catch (err) {
                        message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000008));
                    }
                }
                if (message.content.toString() == "/ratz slimedog") {
                    message.channel.send(message.author + ", you are already authorized to type in the server!");
                }
                if (message.content.toString() == "/ratz showcommands") {
                    var i;
                    var embed_1 = new Discord.RichEmbed()
                        .setTitle("Commands for ratzBot")
                        .setColor(0xcb00ff)
                        .setThumbnail(bot.user.avatarURL.toString());
                    for (i = 0; commands.names[i]; i++) {
                        for (i = 0; commands.definitions[i]; i++) {
                            embed_1.addField(commands.names[i], commands.definitions[i]);
                        }
                    }
                    message.channel.send({ embed: embed_1 });
                }
                if (message.content.toString() == "/ratz botinfo") {
                    var embed = new Discord.RichEmbed()
                        .setTitle("ratzBot Information")
                        .setThumbnail(bot.user.avatarURL.toString())
                        .setColor(0xcb00ff)
                        .addField("Developer", "Gavin Isgar (https://www.github.com/gisgar3/)")
                        .addField("Version Number", package.version)
                        .addField("Source Languages", "JavaScript\nTypeScript")
                        .addField("GitHub Repository", "https://www.github.com/gisgar3/ratzbot/");
                    message.channel.send(embed);
                }
                if (message.content.startsWith("/ratz steamuserinfo ")) {
                    var result = message.content.slice(20);
                    var getSteamProfile = {
                        method: "GET",
                        url: "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=" + tokens.steamtoken + "&steamids=" + result
                    };
                    request(getSteamProfile, function (error, response, body) {
                        try {
                            if (!error && response.statusCode == 200) {
                                var stats = JSON.parse(body);
                                var embed_2 = new Discord.RichEmbed()
                                    .setTitle("Steam User Information for " + stats.response.players[0].steamid)
                                    .setURL(stats.response.players[0].profileurl)
                                    .setColor(0xcb00ff)
                                    .setThumbnail(stats.response.players[0].avatarfull)
                                    .addField("Username", stats.response.players[0].personaname)
                                    .addField("Profile State", stats.response.players[0].profilestate)
                                    .addField("Primary Clan", stats.response.players[0].primaryclanid)
                                    .addField("Last Logoff", stats.response.players[0].lastlogoff)
                                    .addField("Account Created", stats.response.players[0].timecreated);
                                message.channel.send({ embed: embed_2 });
                            }
                            else {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000007));
                            }
                        }
                        catch (err) {
                            message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000007));
                        }
                    });
                }
                if (message.content.toString() == "/ratz releaseinfo") {
                    var getReleaseInfo = {
                        method: "GET",
                        url: "https://api.github.com/repos/Gisgar3/ratzBot/releases",
                        headers: {
                            "User-Agent": "Gisgar3"
                        }
                    };
                    request(getReleaseInfo, function (error, response, body) {
                        try {
                            if (!error && response.statusCode == 200) {
                                var stats = JSON.parse(body);
                                var embed = new Discord.RichEmbed()
                                    .setTitle("ratzBot GitHub Release Information")
                                    .setThumbnail(bot.user.avatarURL)
                                    .setColor(0xcb00ff)
                                    .setURL(stats[0].html_url)
                                    .addField("Latest Release", "" + stats[0].name)
                                    .addField("Release Branch", "" + stats[0].target_commitish)
                                    .addField("Tag", stats[0].tag_name)
                                    .addField("Changelog", stats[0].body)
                                    .addField("Pre-Release Status", "" + stats[0].prerelease)
                                    .addField("Author", stats[0].author.login);
                                if ("" + stats[0].prerelease == "true" && ("" + stats[0].tag_name).endsWith("-RC")) {
                                    embed.setFooter("BUILD STAGE: Release Candidate");
                                }
                                else if ("" + stats[0].prerelease == "true" && ("" + stats[0].tag_name).endsWith("-Beta")) {
                                    embed.setFooter("BUILD STAGE: Beta");
                                }
                                else if ("" + stats[0].prerelease == "true" && ("" + stats[0].tag_name).endsWith("-Alpha")) {
                                    embed.setFooter("BUILD STAGE: Alpha");
                                }
                                else if ("" + stats[0].prerelease == "false") {
                                    embed.setFooter("BUILD STAGE: General Availability");
                                }
                                message.channel.send(embed);
                            }
                            else {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000006));
                            }
                        }
                        catch (err) {
                            message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000006));
                        }
                    });
                }
                if (message.content.startsWith("/ratz gituserinfo ")) {
                    var result = message.content.slice(18);
                    var getGitUserInfo = {
                        method: "GET",
                        url: "https://api.github.com/users/" + result,
                        headers: {
                            "User-Agent": "Gisgar3"
                        }
                    };
                    request(getGitUserInfo, function (error, response, body) {
                        try {
                            if (!error && response.statusCode == 200) {
                                var stats = JSON.parse(body);
                                var embed_3 = new Discord.RichEmbed()
                                    .setTitle("GitHub User Information for " + result)
                                    .setURL(stats.html_url)
                                    .setColor(0xcb00ff)
                                    .setThumbnail(stats.avatar_url)
                                    .addField("Name", stats.name)
                                    .addField("Company", "" + stats.company)
                                    .addField("Bio", "" + stats.bio)
                                    .addField("Location", "" + stats.location)
                                    .addField("Email", "" + stats.email)
                                    .addField("Hireable", "" + stats.hireable)
                                    .addField("Public Repositories", stats.public_repos);
                                message.channel.send(embed_3);
                            }
                            else {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000006));
                            }
                        }
                        catch (err) {
                            message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000006));
                        }
                    });
                }
                if (message.content.startsWith("/ratz gitrepoinfo ")) {
                    var result = message.content.slice(18);
                    var getGitRepoInfo = {
                        method: "GET",
                        url: "https://api.github.com/repos/" + result,
                        headers: {
                            'User-Agent': 'Gisgar3'
                        }
                    };
                    request(getGitRepoInfo, function (error, response, body) {
                        try {
                            if (!error && response.statusCode == 200) {
                                var stats = JSON.parse(body);
                                var embed_4 = new Discord.RichEmbed()
                                    .setTitle("GitHub Repository for " + result)
                                    .setURL(stats.html_url)
                                    .setColor(0xcb00ff)
                                    .setThumbnail(stats.owner.avatar_url)
                                    .addField("Name", stats.name)
                                    .addField("Description", stats.description)
                                    .addField("Owner", stats.owner.login)
                                    .addField("Language", stats.language)
                                    .addField("Archive Status", stats.archived);
                                message.channel.send(embed_4);
                            }
                            else {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000006));
                            }
                        }
                        catch (err) {
                            message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000006));
                        }
                    });
                }
                if (message.content.toString() == "/ratz btcinfo") {
                    var getBTCInfo = {
                        method: "GET",
                        url: "https://api.blockchain.info/stats"
                    };
                    request(getBTCInfo, function (error, response, body) {
                        try {
                            if (!error && response.statusCode == 200) {
                                var stats = JSON.parse(body);
                                var embed_5 = new Discord.RichEmbed()
                                    .setTitle("BTC Information")
                                    .setColor(0xcb00ff)
                                    .setThumbnail(bot.user.avatarURL)
                                    .addField("Market Price (USD)", "$" + stats.market_price_usd)
                                    .addField("BTC Mined", stats.n_btc_mined)
                                    .addField("Blocks Mined", stats.n_blocks_mined)
                                    .addField("Total Blocks", stats.n_blocks_total)
                                    .addField("Total BTC Sent", stats.total_btc_sent);
                                message.channel.send(embed_5);
                            }
                            else {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000005));
                            }
                        }
                        catch (err) {
                            message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000005));
                        }
                    });
                }
                // -----SERVER EVENTS-----
                if (message.content.toString() == "/ratz joinactiveevent") {
                    if (activeevent == "") {
                        message.channel.send(message.author + ", there is no active event on the server.");
                    }
                    else {
                        try {
                            fs.appendFileSync("./exclude/eventuserlist.ratz", "\r\n" + message.author.id);
                            message.channel.send(message.author + ", you are now joined into the " + activeevent + "!");
                        }
                        catch (err) {
                            message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000004));
                        }
                    }
                }
                if (message.content.toString() == "/ratz showactiveevent") {
                    if (activeevent == "") {
                        message.channel.send(message.author + ", there is no active event on the server.");
                    }
                    else {
                        message.channel.send(message.author + ", the active event on the server is the " + activeevent + ".");
                    }
                }
                // -----STREAMLABS INTEGRATION-----
                if (message.content.startsWith("/ratz ratcoininfo ")) {
                    var result = message.content.slice(18);
                    var getRTCInfo = {
                        method: "GET",
                        url: "https://streamlabs.com/api/v1.0/points?access_token=" + tokens.streamlabstoken + "&username=" + result + "&channel=ratzdoll"
                    };
                    request(getRTCInfo, function (error, response, body) {
                        try {
                            if (!error && response.statusCode == 200) {
                                var stats = JSON.parse(body);
                                message.channel.send(message.author + ", " + result + " has " + stats.points + " RTC!");
                            }
                            else {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000003));
                            }
                        }
                        catch (err) {
                            message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000003));
                        }
                    });
                }
                // -----TWITCH NEW API-----
                if (message.content.toString() == "/ratz laststream") {
                    var getStreamVOD = {
                        method: 'GET',
                        url: "https://api.twitch.tv/helix/videos?user_id=157901049&first=1",
                        headers: {
                            "Client-ID": "" + tokens.twitchapiclientid
                        }
                    };
                    request(getStreamVOD, function (error, response, body) {
                        try {
                            if (!error && response.statusCode == 200) {
                                var stats = JSON.parse(body);
                                var embed_6 = new Discord.RichEmbed()
                                    .setTitle("Last Stream VOD from ratzDoll")
                                    .setThumbnail(bot.user.avatarURL)
                                    .setColor(0xcb00ff)
                                    .setURL(stats.data[0].url)
                                    .addField("Title", "" + stats.data[0].title)
                                    .addField("Published At", "" + stats.data[0].published_at)
                                    .addField("Duration", "" + stats.data[0].duration)
                                    .addField("View Count", stats.data[0].view_count);
                                message.channel.send(embed_6);
                            }
                            else {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000002));
                            }
                        }
                        catch (err) {
                            message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000002));
                        }
                    });
                }
                // -----VOICE CHANNELS-----
                if (message.content.startsWith("/ratz play ")) {
                    var result = message.content.slice(11);
                    if (message.member.voiceChannel) {
                        message.member.voiceChannel.join().then(function (connection) {
                            try {
                                var stream = ytdl(result, { filter: "audioonly" });
                                var dispatcher = connection.playStream(stream);
                                message.channel.send(message.author + ", your music is now playing.");
                                dispatcher.on("end", function (end) {
                                    message.channel.send(message.author + ", your music has ended.");
                                    message.member.voiceChannel.leave();
                                });
                            }
                            catch (err) {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000001));
                            }
                        });
                    }
                    else {
                        message.channel.send(message.author + ", you are not in a voice channel. Join a voice channel to play music!");
                    }
                }
                if (message.content.toString() == "/ratz stop") {
                    if (message.member.voiceChannel) {
                        try {
                            message.member.voiceChannel.connection.disconnect();
                            message.member.voiceChannel.leave();
                        }
                        catch (err) {
                            message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000001));
                        }
                    }
                    else {
                        message.channel.send(message.author + ", you are not in a voice channel.");
                    }
                }
                // -----TOPIC DETECTION AND REVIEW-----
                if ((message.content.includes("XXXTentacion") || message.content.includes("xxxtentacion")) && (message.content.includes("death") || message.content.includes("died"))) {
                    if (fs.readFileSync("./exclude/approvedmessages.ratz").includes(message.content.toString())) {
                        // Do nothing
                    }
                    else {
                        fs.appendFileSync("./exclude/bannedmessages.ratz", "\r\n(" + message.author.username + " [" + message.author.id + "], " + message.createdTimestamp + ") " + message.content.toString());
                        message["delete"]();
                        message.channel.send(message.author + ", your message was deleted because it possibly relates to a blocked topic. To appeal the deletion of your message, contact an administrator.");
                    }
                }
                if (message.content.includes("NIGGER") || message.content.includes("nigger") || message.content.includes("NIGGA") || message.content.includes("nigga")) {
                    fs.appendFileSync("./exclude/bannedmessages.ratz", "\r\n(" + message.author.username + " [" + message.author.id + "], " + message.createdTimestamp + ") " + message.content.toString());
                    message["delete"]();
                    message.channel.send(message.author + ", your message was deleted because it possibly relates to a blocked topic. To appeal the deletion of your message, contact an administrator.");
                }
            }
        }
    }
    catch (err) {
        var date = new Date();
        fs.appendFileSync("./exclude/errors.ratz", "\r\nERROR at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + ": " + err);
    }
});
bot.on("guildMemberAdd", function (member) {
    bot.channels.get(newcomerChannel).send("**| WELCOME |** " + member + " has joined the server!");
});
bot.on("guildMemberRemove", function (member) {
    bot.channels.get(newcomerChannel).send("**| GOODBYE |** " + member + " has left the server!");
});
bot.on("error", function (error) {
    fs.appendFileSync("./exclude/errors.ratz", "\r\nERROR at " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + ": " + error.name + " | " + error.message + "\n");
});
bot.on("disconnect", function (userconnection) {
    try {
        bot.login(tokens.bottoken);
    }
    catch (err) {
        console.log("**RECON. ERROR**: " + err);
    }
});
// -----READLINE-----
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", function (input) {
    if (input.toString().startsWith("/ratz userban ")) {
        var result = input.slice(14);
        try {
            bot.guilds.forEach(function (getGuilds) {
                if (getGuilds.name == "ratzcord") {
                    getGuilds.members.forEach(function (getMembers) {
                        if (getMembers.id == "" + result) {
                            getMembers.ban("Banned by ratzBot system.");
                            console.log("**BAN**: User " + result + " was successfully banned.");
                        }
                        else {
                            // Do nothing
                        }
                    });
                }
                else {
                    // Do nothing
                }
            });
        }
        catch (err) {
            console.log("**ERROR**: " + err);
        }
    }
    if (input.toString().startsWith("/ratz writemain ")) {
        var result = input.slice(16);
        try {
            bot.channels.get(mainChannel).send("" + result);
        }
        catch (err) {
            console.log("**ERROR**: " + err);
        }
    }
    // -----SERVER EVENTS-----
    if (input.toString().startsWith("/ratz setevent ")) {
        var result = input.slice(15);
        activeevent = result;
        console.log("**EVENT**: Event has been set.");
    }
});
bot.login(tokens.bottoken);
// -----ERROR REPORTING-----
var ERROR;
(function (ERROR) {
    ERROR["RATZx0000001"] = "RATZx0000001";
    ERROR["RATZx0000002"] = "RATZx0000002";
    ERROR["RATZx0000003"] = "RATZx0000003";
    ERROR["RATZx0000004"] = "RATZx0000004";
    ERROR["RATZx0000005"] = "RATZx0000005";
    ERROR["RATZx0000006"] = "RATZx0000006";
    ERROR["RATZx0000007"] = "RATZx0000007";
    ERROR["RATZx0000008"] = "RATZx0000008";
})(ERROR || (ERROR = {}));
;
var TYPE;
(function (TYPE) {
    TYPE["FRONTEND"] = "FRONTEND";
    TYPE["BACKEND"] = "BACKEND";
})(TYPE || (TYPE = {}));
;
function sendError(TYPE, ERROR) {
    this.type = TYPE;
    this.error = ERROR;
    return "An error occured during the process: **| " + TYPE + " | " + ERROR + " |**";
}
