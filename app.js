const express = require("express");
const mongo = require("./db/mongo");
const cron = require("./cjs/cron");
const bot_endpoints = require("./routes/bot_endpoints");
const app = express();
bot_endpoints.bot_init();
mongo(app);
cron();