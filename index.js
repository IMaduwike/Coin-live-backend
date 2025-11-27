import express from "express";
import { ensureSocket, getPrice } from "./ws-manager.js";

const app = express();
const PORT = process.env.PORT || 10000;

// health check
app.get("/", (req, res) => {
  res.send("Price Engine Running");
});

// MAIN ENDPOINT
app.get("/price", (req, res) => {
  let { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({
      error: "symbol is required"
    });
  }

  symbol = symbol.toUpperCase();

  // ensure WebSocket exists & is running
  ensureSocket(symbol);

  // return cached price
  const price = getPrice(symbol);

  res.json({
    symbol,
    price
  });
});

app.listen(PORT, () => {
  console.log("Live Price Engine running on port " + PORT);
});
