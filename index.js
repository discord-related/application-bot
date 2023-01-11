const { Client, Collection, Partials } = require("discord.js");

const client = new Client({
  intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
  partials: [Partials.Channel],
});
const yaml = require("yaml");
const fs = require("fs");


const configFile = fs.readFileSync("./config.yml", "utf8");
client.config = yaml.parse(configFile);
console.clear();


const { loadButtons } = require("./src/handlers/buttonHandler.js");
const { loadCommands } = require("./src/handlers/commandHandler.js");
const { loadEvents } = require("./src/handlers/eventHandler.js");
const { loadModals } = require("./src/handlers/modalHandler.js");
const { loadSelectMenus } = require("./src/handlers/selectMenuHandler.js");
const { validateConfig } = require("./src/functions/validateConfig");

client.buttons = new Collection();
client.commands = new Collection();
client.events = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();


(async function () {
  console.log(await validateConfig(client.config));
  await loadButtons(client);
  await loadEvents(client);
  await loadModals(client);
  await loadSelectMenus(client);
}) ();


client.login(client.config.token).then(async () => {
  await loadCommands(client);
});