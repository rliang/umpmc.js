# umpmc.js
[![npm](https://img.shields.io/npm/v/umpmc.svg)](https://www.npmjs.org/package/umpmc)
[![size](https://img.shields.io/bundlephobia/minzip/umpmc.svg)](https://bundlephobia.com)
[![deps](https://david-dm.org/rliang/umpmc/status.svg)](https://david-dm.org/rliang/umpmc)

Unbuffered multi-producer multi-consumer queue.

## Installation

```sh
npm i umpmc
```

## Usage

```ts
import umpmc from "umpmc";
import WebSocket from "ws";

(async () => {
  const ws = new WebSocket("...");

  const q = umpmc<
    | { type: "ws-open" }
    | { type: "ws-msg", data: string }
    | { type: "ws-close"; code: number }
    | { type: "timeout" }
  >();

  // q.send() is type-safe: It only accepts q's type parameters.
  ws.onopen = () => q.send({ type: "ws-open" });
  ws.onmessage = ({ data }) => q.send({ type: "ws-msg", data });
  ws.onclose = ({ code }) => q.send({ type: "ws-close", code });
  let timer = setTimeout(() => q.send({ type: "timeout" }), 1000);

  // q.next() is type-safe: It only resolves to q's type parameters
  // that match the patterns in the first argument,
  // and ignores other events.
  // typeof event === { type: "ws-open" } | { type: "timeout" }
  const event = await q.next([{ type: "ws-open" }, { type: "timeout" }]);
  clearTimeout(timer);
  try {
    while (true) {
      timer = setTimeout(() => q.send({ type: "timeout" }), 1000);
      // The patterns in the second argument
      // specifies which events reject the promise.
      // typeof event === { type: "ws-msg", data: string }
      const event = await q.next(
        [{ type: "ws-msg" }],
        [{ type: "ws-close" }, { type: "timeout" }]
      );
      clearTimeout(timer);
    }
  } catch (e) {
    // Although Typescript doesn't know about thrown types...
    // typeof e === { type: "ws-close", code: number } | { type: "timeout" }
  }
})();
```
