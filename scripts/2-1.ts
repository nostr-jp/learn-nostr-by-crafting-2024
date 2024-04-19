import { updateBotProfile } from "../exercises/2_bot.ts";

try {
  await updateBotProfile();
} catch (e) {
  console.error("エラー:", e);
}
