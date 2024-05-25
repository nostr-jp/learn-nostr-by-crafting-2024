import { Relay } from "nostr-tools/relay";
import { finalizeEvent, getPublicKey } from "nostr-tools/pure";
import * as nip19 from "nostr-tools/nip19";
import { EventTemplate } from "nostr-tools/core";
import { TODO, currUnixtime } from "../common/utils.ts";

const RELAY_URL = "wss://yabu.me";

// 2-1. Botのプロフィールを設定する
const BOT_NSEC = "nsec1...<botの秘密鍵>";

const composeProfile = (): EventTemplate => {
  const profile = TODO;
  return TODO;
};

export const updateBotProfile = async () => {
  TODO;
};
// 2-1. ここまで

// 2-2. 定期的に自動投稿するBot
export const timeSignalBot = async () => {
  TODO;
};
// 2-2. ここまで

// 2-3. キーワードを含む投稿にリアクションするBot
const composeReactionEvent = (
  reaction: string,
  targetEventId: string,
  targetPubkey: string
): EventTemplate => {
  return TODO;
};

export const keywordReactionBot = async (keyword: string) => {
  TODO;
};
// 2-3. ここまで

// 2-4. 自分宛てのリプライにリプライを返すBot
export const autoReplyBot = async () => {
  TODO;
};
// 2-4. ここまで

const publishEvent = async (relay: Relay, ev: EventTemplate) => {
  const seckey = nip19.decode(BOT_NSEC).data;
  const signed = finalizeEvent(ev, seckey);

  await relay.publish(signed);

  console.log("イベント送信成功！");
  console.log(signed);

  relay.close();
};

const composeTextEvent = (text: string): EventTemplate => {
  return {
    kind: 1,
    content: text,
    tags: [],
    created_at: currUnixtime(),
  };
};

const composeReplyEvent = (
  text: string,
  targetEventId: string,
  targetPubkey: string
): EventTemplate => {
  return {
    kind: 1,
    content: text,
    tags: [
      ["e", targetEventId, ""],
      ["p", targetPubkey, ""],
    ],
    created_at: currUnixtime(),
  };
};

// 現在時刻の文字列を得る
const currTimeString = () => new Date().toLocaleString("ja-JP");

/* 暴走・無限リプライループ対策 */
// クールタイム: 60秒
const COOL_TIME_DUR_SEC = 60;

// 公開鍵ごとの最後にリプライを返した時刻(unixtime)を記録
const lastReplyTimePerPubkey = new Map();

// 引数の公開鍵(=投稿者)からのポストに最近リプライを返したかどうか
const repliedRecently = (pubkey: string) => {
  const now = currUnixtime();
  const lastReplyTime = lastReplyTimePerPubkey.get(pubkey);
  if (lastReplyTime !== undefined && now - lastReplyTime < COOL_TIME_DUR_SEC) {
    return true;
  }
  lastReplyTimePerPubkey.set(pubkey, now);
  return false;
};
