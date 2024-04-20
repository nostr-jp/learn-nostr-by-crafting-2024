import { postText } from "../exercises/1_basics.ts";
import { runExercise } from "../common/utils.ts";

runExercise(async () => {
    if (Deno.args.length === 0) {
    console.error("エラー: 投稿内容を指定してください");
    console.error('例: deno task 1-4 "Hello, Nostr!"');
    Deno.exit(1);
  }
  await postText(Deno.args[0]!);
}, "oneshot");
