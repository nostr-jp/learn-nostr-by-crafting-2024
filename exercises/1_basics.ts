import { Relay } from "nostr-tools/relay";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools/pure";
import * as nip19 from "nostr-tools/nip19";
import { bytesToHex } from "@noble/hashes/utils";
import { EventTemplate } from "nostr-tools/core";
import { currUnixtime } from "../utils.ts";

const TODO: any = undefined;

const RELAY_URL = "wss://yabu.me";

// 1.1
export const fetchEvents = async () => {
  const relay = await Relay.connect(RELAY_URL);
  relay.subscribe([{}], {
    onevent: (ev) => {
      console.log(ev);
    },
    oneose: () => {
      console.log("****** EOSE ******");
    },
  });
};

// 1.2
export const fetchTextEvents = async () => {
  const relay = await Relay.connect(RELAY_URL);
  relay.subscribe([{ kinds: [1] }], {
    onevent: (ev) => {
      console.log(ev);
    },
    oneose: () => {
      console.log("****** EOSE ******");
    },
  });
};

// 1.3
export const generateKeyPair = () => {
  const seckey = generateSecretKey();
  const pubkey = getPublicKey(seckey);

  console.log("秘密鍵: %s (hex: %s)", nip19.nsecEncode(seckey), bytesToHex(seckey));
  console.log("公開鍵: %s (hex: %s)", nip19.npubEncode(pubkey), pubkey);
};

const MY_NSEC = "nsec1...<あなたの秘密鍵>";

// 1.4
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

// 1.5
const composeReplyEvent = (
  text: string,
  targetPubkey: string,
  targetEventId: string,
): EventTemplate => {
  const targetNpub = nip19.npubEncode(targetPubkey);
  const refToTargetAuthor = `nostr:${targetNpub}`;

  return {
    kind: 1,
    content: `${refToTargetAuthor} ${text}`,
    tags: [
      ["p", targetPubkey, ""],
      ["e", targetEventId, "", "root"],
    ],
    created_at: currUnixtime(),
  };
};

export const postReply = async (text: string) => {
  const relay = await Relay.connect(RELAY_URL);
  const replyEv = composeReplyEvent(
    text,
    "<リプライ対象イベントのpubkey>",
    "<リプライ対象イベントのid>",
  );
  await publishEvent(relay, replyEv);
};