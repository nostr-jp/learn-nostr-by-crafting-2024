import { timeSignalBot } from "../exercises/2_bot.ts";

try {
  await timeSignalBot();
} catch (e) {
  console.error("エラー:", e);
}
