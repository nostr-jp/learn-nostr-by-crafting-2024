import { keywordReactionBot } from "../exercises/2_bot.ts";

try {
  if (Deno.args.length === 0) {
    console.error("エラー: 反応するキーワードを指定してください");
    console.error('例: deno task 2-3 "Nostr"');
    Deno.exit(1);
  }
  await keywordReactionBot(Deno.args[0]);
} catch (e) {
  console.error("エラー:", e);
}
