//---------------------------------------------------Get twitch api
require("dotenv").config({ path: "./.env" });
const request = require("request");
const Discord = require("discord.js");
const client = new Discord.Client();
let sended = false;

const getToken = (url, callback) => {
  const options = {
    url: "https://id.twitch.tv/oauth2/token",
    json: true,
    body: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "client_credentials",
    },
  };

  request.post(options, (err, res, body) => {
    if (err) return console.log(err);

    callback(res);
  });
};

let AT = "";

getToken(process.env.GET_TOKEN, (res) => {
  //Get authToken
  AT = res.body.access_token;
  return AT;
});

const getOnline = (url, accessToken, callback) => {
  const onlineOption = {
    url: process.env.URL,
    method: "GET",
    headers: {
      "Client-ID": process.env.CLIENT_ID,
      Authorization: "Bearer " + accessToken,
    },
  };

  request.get(onlineOption, (err, res, body) => {
    if (err) return console.log(err);
    //API twich info
    var live = JSON.parse(body);

    try {
      if (live.data[0].type === "live") {
        console.log("live");
        send();
      }
    } catch (error) {
      console.log("pas live");
    }
  });
};
//---------------------------------------------------Send Discord message
setTimeout(() => {
  getOnline(process.env.GET_GAMES, AT, (res) => {});
}, 1000);

setInterval(() => {
  getOnline(process.env.GET_GAMES, AT, (res) => {});
}, 1000000);

const send = async () => {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);

    if (sended === false) {
      const channel = client.channels.cache.get(process.env.CHANNEL_ID);
      channel.send("live");
      sended = true;
    }
    setTimeout(() => {
      sended = false;
    }, 36000000);
  });
  //login discord
  client.login(process.env.DISCORD_TOKEN);
};
