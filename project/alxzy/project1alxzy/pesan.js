await import("./config.js?v=" + Date.now());

global.gameTimers = new Map();
global.db = {};

import axios from "axios";
import os from "os";
import process from "process";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
import util from "util";
import lodash from "lodash";
import { Low, JSONFile } from "lowdb";

import { CustomFile } from "telegram/client/uploads.js";
import AdmZip from 'adm-zip';
import { Api } from 'telegram/tl/index.js';

import { renderBoard, checkWinner, resetInactivityTimer, clearInactivityTimer, handleGameMove } from "./lib/game.js";
import Pterodactyl from "./lib/pterodactyl.js";
import scraper from "./lib/scraper.js";

const blpath = "./database/blacklist.json";
const reseller = "./database/reseller.json";

let bldata = fs.existsSync(blpath)
    ? JSON.parse(fs.readFileSync(blpath, "utf-8"))
    : [];
    
let _reseller = fs.existsSync(reseller)
    ? JSON.parse(fs.readFileSync(reseller, "utf-8"))
    : [];
global.db = new Low(new JSONFile("database/database.json"));
global.DATABASE = global.db;

global.loadDatabase = async () => {
  if (global.db.READ) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!global.db.READ) {
          clearInterval(interval);
          resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
        }
      }, 1000);
    });
  }

  if (global.db.data !== null) return;

  global.db.READ = true;
  await global.db.read();
  global.db.READ = false;
  global.db.data = {
    settings: {},
    users: {},
    game: {},
    ...(global.db.data || {}),
  };

  global.db.chain = lodash.chain(global.db.data);
};

export async function pesan(event) {
  try {
    await global.loadDatabase();
    const text = event.message?.message?.trim();
    if (!text) return;

    const parts = text.startsWith("/") ? text.slice(1).split(" ").filter(Boolean) : [];
    const cmd = parts[0] || "";
    const args = parts.slice(1);
    const command = cmd.toLowerCase();
    const sender = await event.message.getSender();

    const replyMessage = event.message.replyToMsgId
      ? await event.message.getReplyMessage()
      : null;

    let user_q = null;
    if (replyMessage) {
      const sender_q = await replyMessage.getSender();
      user_q = {
        id: Number(sender_q?.id) || "Tidak diketahui",
        username: sender_q?.username || "Tidak ada username",
        firstName: sender_q?.firstName || "",
        lastName: sender_q?.lastName || "",
        isBot: sender_q?.bot || false,
      };
    }

    const user = {
      id: Number(sender?.id) || "Tidak diketahui",
      username: sender?.username || "Tidak ada username",
      firstName: sender?.firstName || "",
      lastName: sender?.lastName || "",
      isBot: sender?.bot || false,
    };

    await (await import("./lib/database.js?v=" + Date.now())).default(user)
    const isOwner = global.owner.map(String).includes(String(user.id));
    const isBL = bldata.map(String).includes(String(event.chatId));
    const isSeller = _reseller.map(String).includes(String(user.id));
    const send = async (msg, opts = {}) => {
      await event.client.sendMessage(event.chatId, { message: msg, ...opts });
    };

    const reply = async (msg, opts = {}, replyTo = event.message.id) => {
      await event.client.sendMessage(event.chatId, {
        message: msg,
        replyTo,
        ...opts,
      });
    };
    
    switch (command) {
case "start":
case "menu": {
    const MENU_BOT_USERNAME = global.botfather.username;

    try {
        await event.message.delete();
        
        const inlineResults = await event.client.invoke(
            new Api.messages.GetInlineBotResults({
                bot: MENU_BOT_USERNAME,
                peer: event.chatId,
                query: '',
                offset: '',
            })
        );

        if (!inlineResults || !inlineResults.results || inlineResults.results.length === 0) {
            throw new Error(`Bot inline @${MENU_BOT_USERNAME} tidak merespon.`);
        }

        const result = inlineResults.results[0];
        
        await event.client.invoke(
            new Api.messages.SendInlineBotResult({
                peer: event.chatId,
                queryId: inlineResults.queryId,
                id: result.id,
                clearDraft: true,
            })
        );

    } catch (err) {
        console.error(err);
        await send(event.chatId, `<b>❌ Gagal memuat menu.</b>\n\n<pre>${err.message}</pre>`, {
            parseMode: "html",
        });
    }
}
break;
case "addseller": {
    if (!isOwner) return await send(mess.ownerOnly, { parseMode: "html" });

    const userId = args[0];
    if (!userId) return await send("Contoh: /addseller <id>");

    if (_reseller.includes(userId)) {
        return await send(`ID ${userId} sudah terdaftar sebagai reseller.`);
    }
    _reseller.push(userId);
    try {
        fs.writeFileSync(reseller, JSON.stringify(_reseller, null, 2));
        
        await send(`Berhasil menambahkan akses reseller ke ${userId}`);
    } catch (err) {
        _reseller.pop(); 
        console.error("Gagal menyimpan reseller:", err); 
        await send(`<b>Gagal menyimpan file reseller.</b>\n<pre>${err.message}</pre>`, { parseMode: "html" });
    }
}
break;
case "cpanel": {
    if (!(isSeller || isOwner)) {
        return await event.client.sendMessage(event.chatId, {
            message: "Cpanel hanya tersedia untuk reseller dan owner"
        });
    }

    const panel = new Pterodactyl(
    global.panel.apiKey,
    global.panel.url,
    global.panel.nestId,
    global.panel.eggId,
    global.panel.locId
);
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

    const subCommand = args[0]?.toLowerCase();
    const name = args[1];
    const targetEntity = args[2] || event.chatId;

    if (!subCommand) {
        const helpMessage = `
**Contoh Penggunaan Perintah CPanel:**

\`/cpanel <ram> <nama> [target_id]\`
Contoh: \`/cpanel 1gb alxzy\`
Contoh: \`/cpanel 2gb budi 123456789\`
Contoh: \`/cpanel 2gb budi @username\`

\`/cpanel admin <nama> [target_id]\`
Contoh: \`/cpanel admin bos_panel\`

\`/cpanel unli <nama> [target_id]\`
Contoh: \`/cpanel unli unlimited_user\`

Jika **[target_id]** tidak diisi, data akan dikirim ke chat ini.
        `;
        return await event.client.sendMessage(event.chatId, { message: helpMessage, parseMode: 'markdown' });
    }

    if (!name) {
        return await event.client.sendMessage(event.chatId, {
            message: `Nama (username) diperlukan. Contoh: \`/cpanel ${subCommand} alxzy\``,
            parseMode: 'markdown'
        });
    }

    if (!panel) {
        return await event.client.sendMessage(event.chatId, { message: "Error: Instance panel Pterodactyl tidak ditemukan." });
    }

    const newPassword = generatePassword(12);
    const safeUsername = name.toLowerCase().replace(/[^a-z0-9_.-]/g, '');
    const email = `${safeUsername}@bot.com`;

    if (subCommand === 'admin') {
        await event.client.sendMessage(event.chatId, { message: `⏳ Sedang memproses pembuatan admin **${safeUsername}**...`, parseMode: 'markdown' });

        const result = await panel.createAdmin({
            username: safeUsername,
            email: email,
            firstName: name,
            lastName: 'Admin',
            password: newPassword
        });

        if (result.message) {
            return await event.client.sendMessage(event.chatId, { message: `❌ Gagal membuat admin: ${result.message}` });
        }

        const adminMessage = `
✅ **Admin Berhasil Dibuat**

Berikut adalah detail akun untuk *${result.username}*:
**Username:** \`${result.username}\`
**Password:** \`${newPassword}\`
**Email:** \`${result.email}\`
**Panel URL:** ${panel.panelUrl}

*Catatan:* Akun ini memiliki akses *Admin* penuh ke panel.
        `;

        try {
            await event.client.sendMessage(targetEntity, { message: adminMessage, parseMode: 'markdown' });

            if (targetEntity !== event.chatId) {
                await event.client.sendMessage(event.chatId, { message: `✅ Sukses! Data admin telah dikirim.` });
            }
        } catch (e) {
            await event.client.sendMessage(event.chatId, { message: `❌ Gagal mengirim pesan ke target ${targetEntity}: ${e.message}` });
        }
        return;
    }

    if (RAM_OPTIONS[subCommand]) {
        const specs = RAM_OPTIONS[subCommand];
        await event.client.sendMessage(event.chatId, { message: `⏳ Sedang memproses server **${safeUsername}** (${subCommand})...`, parseMode: 'markdown' });

        const result = await panel.createServer({
            name: name,
            password: newPassword,
            ram: specs.ram,
            disk: specs.disk,
            cpuPercent: specs.cpu,
            admin: false
        });

        if (result.message) {
            return await event.client.sendMessage(event.chatId, { message: `❌ Gagal membuat server: ${result.message}` });
        }

        const serverMessage = `
✅ **Server Berhasil Dibuat**

Berikut adalah detail akun dan server untuk *${result.username}*:
**Username:** \`${result.username}\`
**Password:** \`${newPassword}\`
**Panel URL:** ${result.panelUrl}
**Server ID:** \`${result.serverIdentifier}\`
        `;

        try {
            await event.client.sendMessage(targetEntity, { message: serverMessage, parseMode: 'markdown' });

            if (targetEntity !== event.chatId) {
                await event.client.sendMessage(event.chatId, { message: `✅ Sukses! Data server telah dikirim.` });
            }
        } catch (e) {
            await event.client.sendMessage(event.chatId, { message: `❌ Gagal mengirim pesan ke target ${targetEntity}: ${e.message}` });
        }
        return;
    }

    return await event.client.sendMessage(event.chatId, { message: `❌ Perintah tidak dikenal: "${subCommand}".\nPilihan yang tersedia: "admin", "unli", atau "1gb" - "10gb".` });
}
break
      case "broadcast":
case "bc": {
  try {
    if (!isOwner) {
      return await reply(mess.ownerOnly, { parseMode: "html" });
    }

    const replied = await event.message.getReplyMessage();
    const textToSend = args.join(" ");

    if (!replied && !textToSend) {
      return await reply(
        "<b>Perintah Salah</b>\n\nReply ke pesan atau berikan teks.\nContoh: <code>/broadcast Halo</code>",
        { parseMode: "html" }
      );
    }

    // Baca blacklist
    let blacklist = [];
    try {
      const data = fs.readFileSync("./database/blacklist.json", "utf8");
      blacklist = JSON.parse(data);
    } catch {
      console.warn(
        "⚠️ Warning: ./database/blacklist.json tidak ditemukan atau format salah."
      );
    }

    const msg = await event.client.sendMessage(event.chatId, {
      message: "<i>Mengambil daftar grup dari akun...</i>",
      parseMode: "html",
    });

    const dialogs = await event.client.getDialogs({});
    const allChats = dialogs
      .map((d) => d.entity)
      .filter(
        (e) =>
          (e.className === "Channel" && e.megagroup) ||
          (e.className === "Chat" && e.participantsCount > 0)
      );

    if (!allChats.length) {
      return await msg.edit({
        text: "<b>Gagal</b>\n\nTidak ada grup di akun ini.",
        parseMode: "html",
      });
    }

    let sentCount = 0;
    let failedCount = 0;
    let blacklistedCount = 0;
    const totalChats = allChats.length;

    await msg.edit({
      text: `<i>Memulai broadcast ke ${totalChats} grup...</i>`,
      parseMode: "html",
    });

    for (const chat of allChats) {
      const chatId = Number(chat.id);
      try {
        if (blacklist.includes(chatId)) {
          blacklistedCount++;
          continue;
        }

        if (replied) {
          await event.client.forwardMessages(chatId, {
            messages: replied.id,
            fromPeer: event.chatId,
          });
        } else {
          await event.client.sendMessage(chatId, {
            message: textToSend,
            parseMode: "html",
          });
        }

        sentCount++;
        await new Promise((r) => setTimeout(r, 2000)); // delay 2 detik
      } catch (err) {
        console.error(`❌ Gagal kirim broadcast ke ${chatId}:`, err.message);
        failedCount++;
      }
    }

    await msg.edit({
      text:
        `<b>✅ Broadcast Selesai</b>\n\n` +
        `📤 Terkirim: ${sentCount}\n` +
        `⚠️ Gagal: ${failedCount}\n` +
        `🚫 Di-blacklist: ${blacklistedCount}\n` +
        `👥 Total Grup: ${totalChats}`,
      parseMode: "html",
    });
  } catch (error) {
    console.error("Error di case 'broadcast':", error);
    await reply(
      `<b>❌ Terjadi Kesalahan Internal</b>\n\n<code>${error.message}</code>`,
      { parseMode: "html" }
    );
  }
  break;
}

      case "tiktok": 
      case "tt": {
        if ((db.data.users?.[user.id]?.limit || 0) < 1) {
            const pesan = "<b>❗️ Akses Ditolak</b>\n\n<i>Limit harian kamu telah habis. Silahkan membeli limit di @alxzy_beginner</i>";
            return await reply(pesan, { parseMode: "html" });
        }
        
        if (!args[0]) {
            return await reply("<b>⚠️ Perintah Salah</b>\n\nMasukan URL TikTok setelah perintah.\nContoh: <code>/tiktok https://vt.tiktok.com/ZSyxqAW9H/</code>", { parseMode: "html" });
        }

        let data;
        try {
            await reply("<i>Sedang mengambil data video, mohon tunggu...</i>", { parseMode: "html" });
      
            data = await scraper.tiktok(args[0]);

            if (!data || data.no_watermark.startsWith("Gagal") || data.no_watermark === "#") {
                return await reply("<b>❌ Gagal</b>\n\nTidak dapat mengambil data video dari URL tersebut. Pastikan link valid.", { parseMode: "html" });
            }

            await event.client.sendFile(event.chatId, {
                file: data.cover,
                caption: `<b>${data.title}</b>`,
                parseMode: "html"
            });

            await event.client.sendFile(event.chatId, {
                file: data.no_watermark,
                caption: "Video (Tanpa Tanda Air)"
            });

         /*   await event.client.sendFile(event.chatId, {
                file: data.audio,
                caption: "Audio (MP3)"
            });*/
            
            db.data.users[user.id].limit -= 1;

        } catch (error) {
            console.error("Error di case 'tiktok':", error);
            await reply("<b>❌ Terjadi Kesalahan</b>\n\nBot mengalami error internal saat mencoba memproses permintaan Anda.", { parseMode: "html" });
        }
        
        break; 
      }
    case "cvaudio": {
  let msg;
  try {
    fs.mkdirSync('./tmp', { recursive: true });
    const replied = await event.message.getReplyMessage();
    const [option = "", rawValue = ""] = args;
    const value = parseFloat(rawValue);
    if (!replied || option.toLowerCase() === "help") {
      return await reply(
        `<b>🎧 Panduan Penggunaan /cvaudio</b>\n\n` +
        `<b>Fungsi:</b> Mengonversi audio/video menjadi MP3, dengan beberapa opsi efek tambahan.\n\n` +
        `<b>🔹 Format Umum:</b>\n` +
        `<code>/cvaudio [opsi] [nilai]</code>\n\n` +
        `<b>📚 Daftar Opsi:</b>\n` +
        `• <b>enchanted-audio 1</b> → Meningkatkan kualitas audio (compressor + volume boost)\n` +
        `• <b>enchanted-video 1</b> → Meningkatkan kontras, saturasi & audio video\n` +
        `• <b>speed 1.2–5</b> → Mempercepat audio/video (default: <code>1.5</code>)\n` +
        `• <b>slow 0.5–0.9</b> → Memperlambat audio/video (default: <code>0.8</code>)\n` +
        `• <b>(tanpa opsi)</b> → Mengonversi ke audio MP3 biasa\n\n` +
        `<b>💡 Contoh:</b>\n` +
        `<code>/cvaudio</code> (default MP3)\n` +
        `<code>/cvaudio speed 1.8</code>\n` +
        `<code>/cvaudio enchanted-audio 1</code>\n` +
        `<code>/cvaudio slow</code>\n\n` +
        `Silakan reply ke audio, video, atau file ZIP yang berisi audio.`,
        { parseMode: "html" }
      );
    }

    msg = await event.message.reply({
      message: "<i>Memproses file...</i>",
      parseMode: "html",
    });

    const mimeType = replied.media.document.mimeType;
    const attributes = replied.media.document.attributes;
    const fileNameAttr = attributes.find(a => a.className === 'DocumentAttributeFilename');
    const originalName = fileNameAttr ? fileNameAttr.fileName : "file_unknown.tmp";
    const ext = originalName.split('.').pop().toLowerCase() || 'tmp';

    const buffer = await event.client.downloadMedia(replied.media);
    const validAudio = mimeType.startsWith('audio/');
    const validVideo = mimeType.startsWith('video/');
    const validZip = mimeType === 'application/zip' || mimeType === 'application/x-zip-compressed';

    if (validAudio || validVideo) {
      await msg.edit({
        text: `<i>Mengonversi ${validVideo ? 'video ' : 'audio'} </i>`,
        parseMode: "html",
      });

      let converted;
      const safeVal =
        isNaN(value) && option === "speed" ? 1.5 :
        isNaN(value) && option === "slow" ? 0.8 :
        value;

      if (option === "enchanted-audio" && safeVal >= 1) {
        converted = await scraper.ffmpeg(buffer, [
          "-vn",
          "-af", "acompressor=threshold=-20dB:ratio=4:attack=200:release=1000,volume=1.2",
          "-c:a", "libmp3lame", "-b:a", "192k"
        ], ext, "mp3");
      }

      else if (option === "enchanted-video" && safeVal >= 1 && validVideo) {
        converted = await scraper.ffmpeg(buffer, [
          "-vf", "eq=contrast=1.2:brightness=0.05:saturation=1.3",
          "-c:v", "libx264", "-c:a", "aac", "-b:a", "128k"
        ], ext, "mp4");
      }

      else if (option === "speed" && safeVal >= 1.2 && safeVal <= 5) {
        converted = await scraper.ffmpeg(buffer, [
          "-filter:a", `atempo=${safeVal.toFixed(2)}`,
          "-c:a", "libmp3lame", "-b:a", "128k"
        ], ext, "mp3");
      }

      else if (option === "slow" && safeVal >= 0.5 && safeVal <= 0.9) {
        converted = await scraper.ffmpeg(buffer, [
          "-filter:a", `atempo=${safeVal.toFixed(2)}`,
          "-c:a", "libmp3lame", "-b:a", "128k"
        ], ext, "mp3");
      }

      else {
        converted = await scraper.toSpeakerMP3(buffer, ext);
      }

      const newFileName = originalName.replace(/\.[^/.]+$/, validVideo ? ".mp4" : ".mp3");

      await event.client.sendFile(event.chatId, {
        file: converted.filename,
        attributes: [
          new Api.DocumentAttributeFilename({ fileName: newFileName })
        ],
        caption: `<b>Konversi Selesai:</b> <code>${newFileName}</code>`,
        parseMode: "html"
      });

      await converted.delete();
      await msg.delete();
    }

    else if (validZip) {
      await msg.edit({ text: "<i>Membuka file ZIP...</i>", parseMode: "html" });
      const zip = new AdmZip(buffer);
      const entries = zip.getEntries();
      const audioFormats = ['mp3', 'm4a', 'ogg', 'opus', 'wav', 'flac', 'aac'];
      const audioEntries = entries.filter(e =>
        !e.isDirectory && audioFormats.includes(e.name.split('.').pop().toLowerCase())
      );

      if (!audioEntries.length) {
        await msg.delete();
        return await reply("<b>⚠️ Tidak ditemukan file audio di ZIP.</b>", { parseMode: "html" });
      }

      await msg.edit({
        text: `<i>Menemukan ${audioEntries.length} file audio. Memulai konversi...</i>`,
        parseMode: "html"
      });

      for (let i = 0; i < audioEntries.length; i++) {
        const entry = audioEntries[i];
        const entryName = entry.entryName;
        const entryExt = entryName.split('.').pop();
        const newFileName = entryName.replace(/\.[^/.]+$/, ".mp3");

        await msg.edit({
          text: `<i>Mengonversi file ${i + 1}/${audioEntries.length}...</i>\n<code>${entryName}</code>`,
          parseMode: "html"
        });

        try {
          const entryBuffer = entry.getData();
          const converted = await scraper.toSpeakerMP3(entryBuffer, entryExt);

          await event.client.sendFile(event.chatId, {
            file: converted.filename,
            attributes: [
              new Api.DocumentAttributeFilename({ fileName: newFileName })
            ],
            caption: `<b>Konversi Selesai:</b> <code>${newFileName}</code>`,
            parseMode: "html"
          });

          await converted.delete();
        } catch (err) {
          console.error(`Gagal konversi ${entryName}:`, err);
          await reply(`<b>❌ Gagal Konversi</b>\n<code>${entryName}</code>\n\n${err.message}`, { parseMode: "html" });
        }
      }

      await msg.edit({
        text: `<i>Semua ${audioEntries.length} file audio telah selesai dikonversi.</i>`,
        parseMode: "html"
      });
    }

    else {
      await msg.delete();
      return await reply("<b>⚠️ File Tidak Didukung</b>\n\nSilakan reply ke file audio, video, atau zip.", { parseMode: "html" });
    }

  } catch (error) {
    console.error("Error di case 'cvaudio':", error);
    if (msg) await msg.delete().catch(() => {});
    await reply(`<b>❌ Terjadi Kesalahan Internal</b>\n\n<code>${error.message}</code>`, { parseMode: "html" });
  }
  break;
}


      case "blacklist":
      case "bl": {
        if (!isOwner) return await reply("❌ Hanya owner yang dapat menggunakan ini.");

        const chatId = event.chatId;
        const blpath = "./database/blacklist.json";
        let data = JSON.parse(fs.readFileSync(blpath, "utf-8")) || [];
        data.push(chatId);
        fs.writeFileSync(blpath, JSON.stringify(data, null, 2));

        bldata = data;
        await reply("✅ Berhasil menambahkan chat ini ke blacklist.");
        break;
      }

      case "info": {
        const target = user_q || user;
        await send(
          `👤 <b>Info Singkat Pengguna</b>\n\n` +
            `🪪 ID: <code>${target.id}</code>\n` +
            `🏷️ Nama: <b>${target.firstName} ${target.lastName}</b>\n` +
            `🔗 Username: @${target.username}\n` +
            `🤖 Bot: ${target.isBot ? "Ya" : "Tidak"}`,
          { parseMode: "html" }
        );
        break;
      }

      case "user": {
        const target = user_q || user;
        await send(
          `🧾 <b>Detail Pengguna Lengkap</b>\n\n` +
            `🪪 ID: <code>${target.id}</code>\n` +
            `🏷️ Username: @${target.username}\n` +
            `📛 Nama Depan: ${target.firstName}\n` +
            `📛 Nama Belakang: ${target.lastName}\n` +
            `🤖 Bot: ${target.isBot ? "Ya" : "Tidak"}\n` +
            `💬 Private Chat: ${event.isPrivate ? "Ya" : "Tidak"}\n` +
            `📤 Outgoing: ${event.out ? "Ya" : "Tidak"}\n` +
            `👥 Group: ${event.isGroup ? "Ya" : "Tidak"}\n` +
            `📣 Supergroup: ${event.isChannel ? "Ya" : "Tidak"}`,
          { parseMode: "html" }
        );
        break;
      }

      case "tictactoe": {
        const chatId = String(event.chatId);
        global.db.data.game[chatId] ??= {};

        if (global.db.data.game[chatId].status === "playing")
          return reply("⚠️ Masih ada game yang berjalan di chat ini!");

        const gameId = Math.random().toString(36).slice(2, 8);
        global.db.data.game[chatId] = {
          id: gameId,
          board: Array(9).fill(null),
          player1: user,
          player2: null,
          turn: 1,
          status: "waiting",
        };

        await send(
          `🎮 <b>TicTacToe Dibuat!</b>\n\n🆔 ID Game: <code>${gameId}</code>\n` +
            `👤 Player 1: <b>${user.firstName}</b>\n` +
            `⏳ Menunggu player lain join dengan:\n<code>/jointictactoe ${gameId}</code>`,
          { parseMode: "html" }
        );
        await resetInactivityTimer(chatId, event.client);
        break;
      }

      case "jointictactoe": {
        const chatId = String(event.chatId);
        const gameId = args[0];
        if (!gameId) return reply("❌ Gunakan: /jointictactoe <id game>");

        const game = global.db.data.game[chatId];
        if (!game || game.id !== gameId) return reply("❌ Game tidak ditemukan.");
        if (game.status !== "waiting") return reply("⚠️ Game sudah dimulai.");
        if (game.player1.id === user.id)
          return reply("😅 Kamu tidak bisa join ke game kamu sendiri.");

        game.player2 = user;
        game.status = "playing";
        game.turn = 1;

        await send(
          `✅ <b>Game Dimulai!</b>\n\n🆔 ID: <code>${gameId}</code>\n` +
            `❌ <b>${game.player1.firstName}</b> vs ⭕ <b>${game.player2.firstName}</b>\n\n` +
            `${renderBoard(game.board)}\n\n` +
            `Giliran: <b>${game.player1.firstName}</b> (❌)\n` +
            `Balas pesan ini dengan angka 1–9.`,
          { parseMode: "html" }
        );
        await resetInactivityTimer(chatId, event.client);
        break;
      }
       case "eval":
case ">": {
  if (!isOwner) return await reply("❌ Hanya owner yang dapat menggunakan perintah ini.", { parseMode: "html" });

  const replied = event.message.replyToMsgId
    ? await event.message.getReplyMessage()
    : null;

  let code = args.join(" ");
  if (!code && replied) code = replied.message?.trim();

  if (!code)
    return await reply(
      "⚙️ <b>Gunakan:</b>\n<code>/eval [kode]</code>\nAtau reply ke pesan berisi kode.",
      { parseMode: "html" }
    );

  try {
    let evaled = await eval(`(async () => { ${code} })()`);
    if (typeof evaled !== "string")
      evaled = util.inspect(evaled, { depth: 2 });

    await reply(`<pre>${evaled}</pre>`, { parseMode: "html" });
  } catch (e) {
    await reply(`<pre>${e}</pre>`, { parseMode: "html" });
  }
  break;
}
await global.db.write();
    }

    if (!text.startsWith("/")) {
      const chatId = String(event.chatId);
      const game = global.db.data.game[chatId];
      if (game && game.status === "playing" && event.message.replyToMsgId) {
        const replyMsg = await event.message.getReplyMessage();
        if (!replyMsg.message.includes("Giliran:")) return;
        const position = parseInt(text);

        await handleGameMove(
          game,
          user,
          position,
          chatId,
          event.client,
          reply,
          send
        );
      }
    }
await global.db.write();
  } catch (err) {
    console.error("Error di handler pesan:", err.message);
  }
}

function generatePassword(length = 12) {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    const allChars = upper + lower + numbers + symbols;
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}