"use client";

import React, { useState } from "react";
import * as Ably from "ably";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";

// Connect to Ably using the AblyProvider component and your API key
const client = new Ably.Realtime({
  key: "xxx",
});

export default function AblyTest() {
  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="get-started">
        <AblyPubSub />
      </ChannelProvider>
    </AblyProvider>
  );
}

function AblyPubSub() {
  const [messages, setMessages] = useState<any>([]);

  useConnectionStateListener("connected", () => {
    console.log("Connected to Ably!");
  });

  // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook
  const { channel } = useChannel("get-started", "first", (message) => {
    setMessages((previousMessages: any) => [...previousMessages, message]);
  });

  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div>
      <button
        onClick={() => {
          channel.publish("first", "Here is my first message!");
        }}
      >
        Publish
      </button>
      {messages.map((message: any) => {
        return <p key={message.id}>{message.data}</p>;
      })}
    </div>
  );
}
