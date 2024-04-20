import { Relay } from "nostr-tools/relay";
import { finalizeEvent, getPublicKey } from "nostr-tools/pure";
import * as nip19 from "nostr-tools/nip19";
import { EventTemplate } from "nostr-tools/core";
import { currUnixtime } from "../common/utils.ts";

const RELAY_URL = "wss://yabu.me";

// 2-1. Bot用のアカウントを設定する
const BOT_NSEC = "nsec1...<botの秘密鍵>";

const composeProfile = (): EventTemplate => {
  const profile = {
    name: "enshu_bot",
    display_name: "演習bot",
    about: "のぶこ本演習botです!",
    // picture: "https://example.com/icon.png",
  };
  return {
    kind: 0,
    content: JSON.stringify(profile),
    tags: [],
    created_at: currUnixtime(),
  };
};

export const updateBotProfile = async () => {
  const relay = await Relay.connect(RELAY_URL);
  const profileEv = composeProfile();
  await publishEvent(relay, profileEv);
};
// 2-1. ここまで

// 2-2. 定期的に自動投稿するBot
export const timeSignalBot = async () => {
  const relay = await Relay.connect(RELAY_URL);
  setInterval(async () => {
    const ev = composeTextEvent(`${currTimeString()}をお知らせします！`);
    await publishEvent(relay, ev);
  }, 60 * 1000);
};

export const cronTimeSignalBot = async () => {
  const relay = await Relay.connect(RELAY_URL);
  Deno.cron("time signal", "* * * * *", async () => {
    const ev = composeTextEvent(`${currTimeString()}をお知らせします！`);
    await publishEvent(relay, ev);
  });
};
// 2-2. ここまで

// 2-3. キーワードを含む投稿にリアクションするBot
const composeReactionEvent = (
  reaction: string,
  targetPubkey: string,
  targetEventId: string
): EventTemplate => {
  return {
    kind: 7,
    content: reaction,
    tags: [
      ["p", targetPubkey, ""],
      ["e", targetEventId, ""],
    ],
    created_at: currUnixtime(),
  };
};

export const keywordReactionBot = async (keyword: string) => {
  const relay = await Relay.connect(RELAY_URL);

  relay.subscribe([{ kinds: [1], since: currUnixtime() }], {
    onevent: async (ev) => {
      if (ev.content.includes(keyword)) {
        console.log("キーワード入りの投稿を受信!", ev);

        const reaction = composeReactionEvent("+", ev.pubkey, ev.id);
        await publishEvent(relay, reaction);
      }
    }
  })
};
// 2-3. ここまで

// 2-4. 自分宛てのリプライにリプライを返すBot
export const autoReplyBot = async () => {
  const relay = await Relay.connect(RELAY_URL);
  const botPubkey = getPublicKey(nip19.decode(BOT_NSEC).data);

  relay.subscribe([{ kinds: [1], "#p": [botPubkey], since: currUnixtime() }], {
    onevent: async (ev) => {
      console.log("リプライを受信!", ev);

      const reply = composeReplyEvent("こんにちは！", ev.pubkey, ev.id);
      await publishEvent(relay, reply);
    }
  })
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

const currTimeString = () => new Date().toLocaleString("ja-JP");
