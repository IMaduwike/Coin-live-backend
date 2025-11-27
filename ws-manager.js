import WebSocket from "ws";

const sockets = {};   // symbol -> websocket instance
const prices = {};    // symbol -> latest price

export function getPrice(symbol) {
  return prices[symbol] || null;
}

export function ensureSocket(symbol) {
  symbol = symbol.toUpperCase();

  if (sockets[symbol]) {
    return; // already running
  }

  console.log(`Opening WS for ${symbol}...`);

  const stream = symbol.toLowerCase() + "@ticker";
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`);

  sockets[symbol] = ws;

  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw);
      prices[symbol] = data.c; // last price
    } catch (err) {}
  });

  ws.on("close", () => {
    console.log(`${symbol} socket closed. Reconnecting...`);
    delete sockets[symbol];
    setTimeout(() => ensureSocket(symbol), 1000);
  });

  ws.on("error", () => {
    ws.close();
  });
}
