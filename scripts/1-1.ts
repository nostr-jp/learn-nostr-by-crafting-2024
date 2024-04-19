import { fetchEvents } from "../exercises/1_basics.ts";

try {
  await fetchEvents();
} catch (e) {
  console.error("エラー:", e);
}
