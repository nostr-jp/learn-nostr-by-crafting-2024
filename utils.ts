// 現在のunixtime(秒単位)を取得
export const currUnixtime = () => Math.floor(new Date().getTime() / 1000);

// 1番目のコマンドライン引数を取得
export const getCliArg = (errMsg: string) => {
  if (Deno.args.length === 0) {
    console.error(errMsg);
    Deno.exit(1);
  }
  return Deno.args[0];
};
