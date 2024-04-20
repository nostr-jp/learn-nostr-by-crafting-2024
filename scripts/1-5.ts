import { postReply } from "../exercises/1_basics.ts";
import { runExercise } from "../common/utils.ts";

runExercise(async () => {
  if (Deno.args.length === 0) {
    console.error("エラー: リプライの内容を指定してください");
    console.error('例: deno task 1-5 "こんにちは!"');
    Deno.exit(1);
  }
  await postReply(Deno.args[0]!);
}, "oneshot");
