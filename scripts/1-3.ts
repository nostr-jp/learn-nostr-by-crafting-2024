import { generateKeyPair } from "../exercises/1_basics.ts";

try {
  generateKeyPair();
} catch (e) {
  console.error("エラー:", e);
}
