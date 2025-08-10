import React, { useState, useEffect } from "react";


export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = e => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form className="chat__footer" onSubmit={handleSend}>
      <button type="button" className="icon-btn" aria-hidden>
        <i className="fa-solid fa-paperclip"></i>
      </button>
      <input
        className="chat__input"
        placeholder="Type a message"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button className="send-btn" type="submit">Send
        <i className="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  );
}

