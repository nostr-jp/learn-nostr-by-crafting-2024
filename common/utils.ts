// 現在のunixtime(秒単位)を取得
export const currUnixtime = () => Math.floor(Date.now() / 1000);

export const runExercise = async (
  f: () => void | Promise<void>,
  runType: "oneshot" | "persistent"
) => {
  try {
    if (runType === "persistent") {
      console.log("Ctrl + C で終了します");
    }
    await f();
    if (runType === "oneshot") {
      Deno.exit(0);
    }
  } catch (e) {
    console.error("エラー:", e);
    Deno.exit(1);
  }
};

export const TODO: any = undefined;
