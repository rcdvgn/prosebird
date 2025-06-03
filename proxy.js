require("dotenv").config();
const WebSocket = require("ws");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PROXY_PORT || 8080;
const OPENAI_WS_URL =
  "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";

if (!OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing in .env");
  process.exit(1);
}

const server = new WebSocket.Server({ port: PORT }, () => {
  console.log(`🟢 Proxy started and listening on ws://localhost:${PORT}`);
});

server.on("connection", (client) => {
  console.log("➕ Client connected");

  const openai = new WebSocket(OPENAI_WS_URL, {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "OpenAI-Beta": "realtime=v1",
    },
  });

  openai.on("open", () => {
    console.log("🟢 Connected to OpenAI Realtime API");
  });

  openai.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log("[OpenAI Response Type]:", message.type);

      // Log important events
      if (message.type === "session.updated") {
        console.log("✅ Session updated successfully");
      } else if (
        message.type === "conversation.item.input_audio_transcription.completed"
      ) {
        console.log("📝 Transcription:", message.transcript);
      } else if (message.type === "error") {
        console.error("❌ OpenAI Error:", message.error);
      }

      // Forward all messages to client
      client.send(data);
    } catch (err) {
      console.log("[OpenAI Raw Response]:", data.toString());
      client.send(data);
    }
  });

  openai.on("close", (code, reason) => {
    console.log(
      `🔴 Disconnected from OpenAI. Code: ${code}, Reason: ${reason?.toString()}`
    );
    client.close();
  });

  openai.on("error", (err) => {
    console.error("❌ OpenAI Realtime WS error:", err);
    client.close();
  });

  client.on("message", (data, isBinary) => {
    if (openai.readyState === WebSocket.OPEN) {
      try {
        if (isBinary) {
          // Handle binary audio data
          console.log(
            "[Proxy] Forwarding binary audio data:",
            data.length,
            "bytes"
          );

          // Convert binary data to base64 and send as JSON message
          const audioMessage = {
            type: "input_audio_buffer.append",
            audio: Buffer.from(data).toString("base64"),
          };

          openai.send(JSON.stringify(audioMessage));
        } else {
          // Handle JSON messages (session config, etc.)
          const message = JSON.parse(data.toString());
          console.log("[Proxy] Forwarding JSON message:", message.type);

          openai.send(data.toString());
        }
      } catch (error) {
        console.error("❌ Error processing client message:", error);
      }
    } else {
      console.warn("⚠️ OpenAI connection not ready, dropping message");
    }
  });

  client.on("close", () => {
    console.log("➖ Client disconnected");
    if (openai.readyState === WebSocket.OPEN) {
      openai.close();
    }
  });

  client.on("error", (err) => {
    console.error("❌ Client WS error:", err);
    if (openai.readyState === WebSocket.OPEN) {
      openai.close();
    }
  });
});
