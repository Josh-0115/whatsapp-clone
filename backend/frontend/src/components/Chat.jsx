import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function Chat({ chat, onSend }) {
  const containerRef = useRef();

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat]);

  if (!chat) {
    return (
      <main className="chat--empty">
        <p>Select a chat to start messaging</p>
      </main>
    );
  }

  return (
    <main className="chat">
      <ChatHeader name={chat.name} lastSeen={"online"} />
      <div className="chat__body" ref={containerRef}>
        {chat.messages.map((m) => (
          <ChatMessage
            key={m.messageId}
            message={{
              text: m.text,
              sender: m.direction === "outgoing" ? "me" : "them",
              time: new Date(m.timestamp * 1000).toLocaleTimeString([], { 
                hour: "2-digit", 
                minute: "2-digit" 
              })
            }}
          />
        ))}
      </div>
      <ChatInput onSend={onSend} />
    </main>
  );
}
