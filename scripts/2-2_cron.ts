import { cronTimeSignalBot } from "../exercises/2_bot.ts";

try {
  await cronTimeSignalBot();
} catch (e) {
  console.error("エラー:", e);
}
