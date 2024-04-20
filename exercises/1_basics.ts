import { Relay } from "nostr-tools/relay";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools/pure";
import * as nip19 from "nostr-tools/nip19";
import { bytesToHex } from "@noble/hashes/utils";
import { EventTemplate } from "nostr-tools/core";
import { currUnixtime } from "../common/utils.ts";

// 1-1. とにかくイベントを取得してみよう
const RELAY_URL = "wss://yabu.me";

export const fetchEvents = async () => {
  const relay = await Relay.connect(RELAY_URL);
  relay.subscribe([{}], {
    onevent: (ev) => {
      console.log(ev);
    },
  });
};
// 1-1. ここまで

// 1-2. テキスト投稿に絞って取得してみよう
export const fetchTextEvents = async () => {
  const relay = await Relay.connect(RELAY_URL);
  relay.subscribe([{ kinds: [1] }], {
    onevent: (ev) => {
      console.log(`${ev.pubkey}: ${ev.content}`);
    },
  });
};
// 1-2. ここまで

// 1-3. 鍵ペアを生成してみよう
export const generateKeyPair = () => {
  const seckey = generateSecretKey();
  const pubkey = getPublicKey(seckey);

  console.log("秘密鍵: %s (hex: %s)", nip19.nsecEncode(seckey), bytesToHex(seckey));
  console.log("公開鍵: %s (hex: %s)", nip19.npubEncode(pubkey), pubkey);
};
// 1-3. ここまで

const MY_NSEC = "nsec1...<あなたの秘密鍵>";

// 1.4 自分から投稿してみよう
const composeTextEvent = (text: string): EventTemplate => {
  return {
    kind: 1,
    content: text,
    tags: [],
    created_at: currUnixtime(),
  };
};

const publishEvent = async (relay: Relay, ev: EventTemplate) => {
  const seckey = nip19.decode(MY_NSEC).data;
  const signed = finalizeEvent(ev, seckey);

  await relay.publish(signed);

  console.log("投稿成功！");
  console.log(signed);

  relay.close();
};

export const postText = async (text: string) => {
  const relay = await Relay.connect(RELAY_URL);
  const textEv = composeTextEvent(text);
  await publishEvent(relay, textEv);
};
// 1-4. ここまで

// 1-5. 投稿にリプライしてみよう
const composeReplyEvent = (
  text: string,
  targetEventId: string,
  targetPubkey: string,
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

export const postReply = async (text: string) => {
  const relay = await Relay.connect(RELAY_URL);
  const replyEv = composeReplyEvent(
    text,
    "<リプライ対象イベントのid>",
    "<リプライ対象イベントのpubkey>",
  );
  await publishEvent(relay, replyEv);
};
// 1-5. ここまで
