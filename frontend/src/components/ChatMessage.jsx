import React from "react";

export default function ChatMessage({ message }) {
  const isMe = message.sender === "me";
  return (
    <div className={`msg ${isMe ? "msg--me" : "msg--them"}`}>
      <div className="msg__bubble">
        <div className="msg__text">{message.text}</div>
        <div className="msg__time">{message.time}</div>
      </div>
    </div>
  );
}
