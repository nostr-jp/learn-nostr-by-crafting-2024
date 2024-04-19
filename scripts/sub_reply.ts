import { relayInit as r } from "nostr-tools";
if (Deno.args.length <= 1) {
  console.error("usage: deno task sub-reply <relay-url> <your pubkey>");
  Deno.exit(1);
}
const [n, c] = Deno.args.slice(0, 2);
const e = async () => {
  const e = r(n);
  e.on("error", () => {
    console.error("failed to connect");
  });
  await e.connect();
  console.log("connected to relay");
  const o = e.sub([{ kinds: [1], "#p": [c], since: Math.floor((new Date()).getTime() / 1e3) }]);
  o.on("event", (e) => {
    console.log("received reply!");
    console.log(e);
  });
};
e().catch((e) => console.error(e));
