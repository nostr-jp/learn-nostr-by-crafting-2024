import { Relay } from "nostr-tools/relay";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools/pure";
import * as nip19 from "nostr-tools/nip19";
import { bytesToHex } from "@noble/hashes/utils";
import { EventTemplate } from "nostr-tools/core";
import { TODO, currUnixtime } from "../common/utils.ts";

// 1-1. とにかくイベントを取得してみよう
const RELAY_URL = TODO;

export const fetchEvents = async () => {
  TODO;
};
// 1-1. ここまで

// 1-2. テキスト投稿に絞って取得してみよう
export const fetchTextEvents = async () => {
  TODO;
};
// 1-2. ここまで

// 1-3. 鍵ペアを生成してみよう
export const generateKeyPair = () => {
  const seckey = TODO;
  const pubkey = TODO;

  console.log("秘密鍵: %s (hex: %s)", nip19.nsecEncode(seckey), bytesToHex(seckey));
  console.log("公開鍵: %s (hex: %s)", nip19.npubEncode(pubkey), pubkey);
};
// 1-3. ここまで

// 1.4 自分から投稿してみよう
const MY_NSEC = "nsec1...<あなたの秘密鍵>";

const composeTextEvent = (text: string): EventTemplate => {
  return TODO;
};

const publishEvent = async (relay: Relay, ev: EventTemplate) => {
  const seckey = TODO;
  const signed = TODO;

  TODO;

  console.log("投稿成功！");
  console.log(signed);
};

export const postText = async (text: string) => {
  TODO;
};
// 1-4. ここまで

// 1-5. 投稿にリプライしてみよう
const composeReplyEvent = (
  text: string,
  targetEventId: string,
  targetPubkey: string,
): EventTemplate => {
  return TODO;
};

export const postReply = async (text: string) => {
  const relay = TODO;
  const replyEv = TODO;
  TODO;
  relay.close();
};
// 1-5. ここまで
