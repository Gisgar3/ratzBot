// COPYRIGHT (C) GAVIN ISGAR 2017-2019
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Discord = require("discord.js");
var DiscordRPC = require("discord-rpc");
var tf = require('@tensorflow/tfjs');
var opus = require("opusscript");
var ffmpeg = require("ffmpeg-binaries");
var ytdl = require("ytdl-core");
var bot = new Discord.Client();
var msg = new Discord.Message();
var net = require('net');
var http = require("http");
var url = require("url");
var path = require("path");
var cryptog = require("crypto");
var request = require("request");
var commands = require("./commands.json");
var tokens = require("./exclude/tokens.json");
var fs = require("fs");
var os = require("os");
var readline = require("readline");
var packagefile = require("./package.json");
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var date = new Date();
var messagedata = require("./exclude/removedauthmessages.json");
var advertdata = require("./exclude/adverts.json");
//-----SERVER EVENTS-----
var activeevent = "";
// ---------
// -----CHANNELS-----
var logChannel = "423939166401855518";
var newcomerChannel = "423937750937501697";
var mainChannel = "443227379712917505";
var liveChannel = "423938014801166346";
var selfPromoChannel = "438003121755783199";
// ----------
bot.on('message', function (message) {
    try {
        if (message.channel.type == "dm") {
            if (message.author.id == "434154972834299904") {
                // Do nothing
            }
            else {
                if (message.content.toString() == "/ratz getremovedmessages") {
                    if (!messagedata.users[0][message.author.id]) {
                        message.channel.send("No message data exists for your UserID.");
                        console.log("Private data requested and failed from " + message.author.username);
                    }
                    else {
                        message.channel.send(messagedata.users[0][message.author.id]);
                        console.log("Private data requested and given to " + message.author.username);
                    }
                }
            }
        }
        else {
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
                            removeMessage(message.content.toString(), message.author.id);
                            message["delete"]();
                            message.channel.send(message.author + ", hello and welcome to the server! You have to read the rules and enter the specified password to access the server (for the sake of spammers \u2661).");
                            // Old method
                            //fs.appendFileSync("./exclude/removedauthmessages.ratz", "\r\n(" + message.author.username + " [" + message.author.id + "], " + message.createdTimestamp + ") " + message.content.toString());
                            //message["delete"]();
                            //message.channel.send(message.author + ", hello and welcome to the server! You have to read the rules and enter the specified password to access the server (for the sake of spammers \u2661).");
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
                            appendError(TYPE.BACKEND, ERROR.RATZx0000008, message.author.id, err);
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
                            .addField("Version Number", packagefile.version)
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
                                    appendError(TYPE.BACKEND, ERROR.RATZx0000007, message.author.id, error);
                                }
                            }
                            catch (err) {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000007));
                                appendError(TYPE.BACKEND, ERROR.RATZx0000007, message.author.id, err);
                            }
                        });
                    }
                    if (message.content.toString() == "/ratz releaseinfo") {
                        try {
                            request.post({
                                url: "https://api.github.com/graphql",
                                json: true,
                                body: {"query": "query { repository(owner: \"Gisgar3\", name: \"ratzBot\") { releases(last: 1) {nodes {author {name login avatarUrl} url tagName name publishedAt isPrerelease description} } } }"},
                                headers: {
                                    "User-Agent": "Gisgar3",
                                    "Authorization": `bearer ${tokens.githubpersonaltoken}`
                                }
                            }, function (err, httpResponse, body) {
                                if (!err && httpResponse.statusCode == 200) {
                                    var embed = new Discord.RichEmbed()
                                        .setTitle("ratzBot GitHub Release Information")
                                        .setThumbnail(bot.user.avatarURL)
                                        .setColor(0xcb00ff)
                                        .setURL(body.data.repository.releases.nodes[0].url)
                                        .addField("Latest Release", body.data.repository.releases.nodes[0].name)
                                        .addField("Tag", body.data.repository.releases.nodes[0].tagName)
                                        .addField("Changelog", body.data.repository.releases.nodes[0].description)
                                        .addField("Pre-Release Status", body.data.repository.releases.nodes[0].isPrerelease)
                                        .addField("Author", `${body.data.repository.releases.nodes[0].author.name} (${body.data.repository.releases.nodes[0].author.login})`);
                                    if (body.data.repository.releases.nodes[0].isPrerelease == true && body.data.repository.releases.nodes[0].tagName.endsWith("-RC")) {
                                        embed.setFooter("BUILD STAGE: Release Candidate", body.data.repository.releases.nodes[0].author.avatarUrl);
                                    }
                                    else if (body.data.repository.releases.nodes[0].isPrerelease == true && body.data.repository.releases.nodes[0].tagName.endsWith("-Beta")) {
                                        embed.setFooter("BUILD STAGE: Beta", body.data.repository.releases.nodes[0].author.avatarUrl);
                                    }
                                    else if (body.data.repository.releases.nodes[0].isPrerelease == true && body.data.repository.releases.nodes[0].tagName.endsWith("-Alpha")) {
                                        embed.setFooter("BUILD STAGE: Alpha", body.data.repository.releases.nodes[0].author.avatarUrl);
                                    }
                                    else if (body.data.repository.releases.nodes[0].isPrerelease == false) {
                                        embed.setFooter("BUILD STAGE: General Availability", body.data.repository.releases.nodes[0].author.avatarUrl);
                                    }
                                    message.channel.send(embed);
                                } 
                                else {
                                    sendError(TYPE.BACKEND, RATZx0000006);
                                    appendError(TYPE.BACKEND, RATZx0000006, message.author.id, err);
                                }
                            });
                        }
                        catch (err) {
                            appendError(TYPE.BACKEND, RATZx0000006, "SYSTEM", err)
                        }
                    }
                    if (message.content.toString() == "/ratz machineinfo") {
                        var embed = new Discord.RichEmbed()
                            .setTitle("ratzBot Machine Information")
                            .setDescription("Information of the current machine running **ratzBot**.")
                            .setColor(0xcb00ff)
                            .addField("Machine Architecture", os.arch().toString())
                            .addField("Machine CPU", os.cpus().model.toString())
                            .addField("OS Type", os.type().toString())
                            .addField("Uptime", os.uptime().toString());
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
                                    appendError(TYPE.BACKEND, ERROR.RATZx0000006, message.author.id, error);
                                }
                            }
                            catch (err) {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000006));
                                appendError(TYPE.BACKEND, ERROR.RATZx0000006, message.author.id, err);
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
                                    appendError(TYPE.BACKEND, ERROR.RATZx0000006, message.author.id, error);
                                }
                            }
                            catch (err) {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000006));
                                appendError(TYPE.BACKEND, ERROR.RATZx0000006, message.author.id, err);
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
                                    appendError(TYPE.BACKEND, ERROR.RATZx0000005, message.author.id, error);
                                }
                            }
                            catch (err) {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000005));
                                appendError(TYPE.BACKEND, ERROR.RATZx0000005, message.author.id, err);
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
                                appendError(TYPE.BACKEND, ERROR.RATZx0000004, message.author.id, err);
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
                                    appendError(TYPE.BACKEND, ERROR.RATZx0000003, message.author.id, error);
                                }
                            }
                            catch (err) {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000003));
                                appendError(TYPE.BACKEND, ERROR.RATZx0000003, message.author.id, err);
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
                                    appendError(TYPE.BACKEND, ERROR.RATZx0000002, message.author.id, error);
                                }
                            }
                            catch (err) {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000002));
                                appendError(TYPE.BACKEND, ERROR.RATZx0000002, message.author.id, err);
                            }
                        });
                    }
                    /* -----REDDIT API/CUSTOM-----
                    STILL NEEDS AUTH VIA CODE IN TOKENS.JSON
                    if (message.content.toString() == "/ratz motivationalquote") {
                        var getNewReddit = {
                            url: "https://www.reddit.com/api/v1/r/GetMotivated/new",
                            method: "GET",
                            headers: {
                                "User-Agent": "windows:yMuEkegXP0k93A:v3.1.1 (by /u/Gisgar3)"
                            }
                        };
                        request(getNewReddit, function (error, response, body) {
                            try {
                                if (!error && response.StatusCode == 200) {
                                    var stats = JSON.parse(body);
                                    message.channel.send(stats);
                                }
                                else {
                                    message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000010));
                                    appendError(TYPE.BACKEND, ERROR.RATZx0000010, message.author.id, error);
                                }
                            }
                            catch (err) {
                                message.channel.send(sendError(TYPE.BACKEND, ERROR.RATZx0000010));
                                appendError(TYPE.BACKEND, ERROR.RATZx0000010, message.author.id, err);
                            }
                        });
                    */
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
                                    appendError(TYPE.BACKEND, ERROR.RATZx0000001, message.author.id, err);
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
                                appendError(TYPE.BACKEND, ERROR.RATZx0000001, message.author.id, err);
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
                    // --------------------------------
                    /*if (message.content.startsWith("/ratz testdetermine")) {
                        message.channel.send(teachAI());
                    }*/
                }
            }
        }
    }
    catch (err) {
        appendError(TYPE.BACKEND, ERROR.RATZx0000009, "SYSTEM", err.toString());
    }
});
bot.on("guildMemberAdd", function (member) {
    bot.channels.get(newcomerChannel).send("**| WELCOME |** " + member + " has joined the server!");
});
bot.on("guildMemberRemove", function (member) {
    bot.channels.get(newcomerChannel).send("**| GOODBYE |** " + member + " has left the server!");
});
bot.on("error", function (error) {
    appendError(TYPE.BACKEND, ERROR.RATZx0000009, "SYSTEM", error.toString());
});
bot.on("disconnect", function (userconnection) {
    try {
        bot.login(tokens.bottoken);
    }
    catch (err) {
        console.log("**RECON. ERROR**: " + err);
    }
});
bot.on("ready", function (ready) {
    //setInterval(rollAdvert, 7200000); 
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
    if (input.toString() == "/ratz clear") {
        console.clear();
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
    ERROR["RATZx0000009"] = "RATZx0000009";
    ERROR["RATZx0000010"] = "RATZx0000010";
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
    return "An error occured during the process: **| TYPE: " + TYPE + " | CODE: " + ERROR + " |**";
}
function appendError(TYPE, ERROR, USER, ERRORDES) {
    fs.appendFileSync("./exclude/errors.ratz", "ERROR CODE: " + ERROR + "\r\nERROR TYPE: " + TYPE + "\r\nUSER: " + USER + "\r\nRECEIVED: " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "\r\nERROR DESCRIPTION: " + ERRORDES + "\r\n\r\n");
}
function removeMessage(content, authorid) {
    if (!messagedata.users[0][authorid]) {
        messagedata.users[0][authorid] = [];
    }
    var data = messagedata.users[0][authorid];
    data.push(content);
    var txt = JSON.stringify(messagedata);
    fs.writeFileSync("./exclude/removedauthmessages.json", txt);
}
//-----ADVERT FUNCTIONS-----
function rollAdvert() {
    // Uses the part of a GitHub repo URL to run into the API
    var integer;
    var random = Math.floor(Math.random() * 2);
    var result = advertdata.adverts[random];
    var getAdvertInfo = {
        method: "GET",
        url: "https://api.github.com/repos/" + result,
        headers: {
            "User-Agent": "Gisgar3"
        }
    };
    request(getAdvertInfo, function (error, response, body) {
        try {
            if (!error && response.statusCode == 200) {
                var stats = JSON.parse(body);
                var embed = new Discord.RichEmbed()
                    .setTitle("ADVERTISEMENT")
                    .setDescription("**" + stats.name + "**")
                    .setURL(stats.html_url)
                    .setThumbnail(bot.user.avatarURL)
                    .setColor(0xcb00ff)
                    .addField("Owner", "" + stats.owner.login)
                    .addField("Program Name", "" + stats.name)
                    .addField("Program Description", "" + stats.description)
                    .addField("License", "" + stats.license.name);
                bot.channels.get(selfPromoChannel).send(embed);
            }
            else {
                appendError(TYPE.BACKEND, ERROR.RATZx0000006, "SYSTEM", error);
            }
        }
        catch (err) {
            appendError(TYPE.BACKEND, ERROR.RATZx0000006, "SYSTEM", error);
        }
    });
}
// ----------
function teachAI() {
    return __awaiter(this, void 0, void 0, function () {
        var model, xs, ys, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    model = tf.sequential();
                    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
                    model.compile({
                        loss: 'meanSquaredError',
                        optimizer: 'sgd'
                    });
                    xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
                    ys = tf.tensor2d([0.10, 1.20, 2.30, 3.40, 4.50, 5.60], [6, 1]);
                    // Train the model
                    return [4 /*yield*/, model.fit(xs, ys, { epochs: 500 })];
                case 1:
                    // Train the model
                    _b.sent();
                    result = model.predict(tf.tensor2d([7], [1, 1])).print();
                    return [2 /*return*/];
            }
        });
    });
}