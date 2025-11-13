await import("./config.js?v=" + Date.now());

import { TelegramClient } from "telegram";
import { StoreSession } from "telegram/sessions/index.js";
import { NewMessage } from "telegram/events/index.js"; 
import { pesan } from "./pesan.js";
import readline from "readline";

const auth = new StoreSession("sessions");

const rl = readline.Interface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  console.log("Menghubungkan bot...");
  const client = new TelegramClient(auth, api_id, api_hash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => {
      console.log("➡️ Silakan masukkan nomor HP Anda lalu tekan Enter:");
      return new Promise((resolve) => 
        rl.question("", resolve)
      );
    },
    password: async () => {
      console.log("➡️ Silakan masukkan password (2FA) Anda:");
      return new Promise((resolve) =>
        rl.question("", resolve)
      );
    },
    phoneCode: async () => {
      console.log("➡️ Silakan masukkan kode verifikasi yang dikirim ke Telegram:");
      return new Promise((resolve) =>
        rl.question("", resolve)
      );
    },
    onError: (err) => console.log(err),
  });

  console.log("========================================");
  console.log("========================================");
  console.log("Anda berhasil terhubung! Bot sekarang aktif.");
  console.log("========================================");

  await client.sendMessage("me", { message: "Bot online!" });
await (await import("./system/alxzy.js?v=" + Date.now())).default();
client.addEventHandler(pesan, new NewMessage({}));


})();