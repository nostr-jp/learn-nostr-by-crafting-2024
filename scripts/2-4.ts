import { autoReplyBot } from "../exercises/2_bot.ts";

try {
  await autoReplyBot();
} catch (e) {
  console.error("エラー:", e);
}
