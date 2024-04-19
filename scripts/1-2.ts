import { fetchTextEvents } from "../exercises/1_basics.ts";

try {
  await fetchTextEvents();
} catch (e) {
  console.error("エラー:", e);
}
