import React from "react";

export default function SidebarChat({ chat, active, onClick }) {
  const preview = chat.messages.length ? chat.messages[chat.messages.length - 1].text : chat.lastMessage;
  return (
    <div className={`sidebarChat ${active ? "active" : ""}`} onClick={onClick}>
      <div className="sidebarChat__avatar">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#ddd" />
          <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="#666">U</text>
        </svg>
      </div>
      <div className="sidebarChat__info">
        <div className="sidebarChat__top">
          <strong>{chat.name}</strong>
          <span className="sidebarChat__time">{chat.messages.slice(-1)[0]?.time ?? ""}</span>
        </div>
        <div className="sidebarChat__bottom">
          <span className="sidebarChat__preview">{preview}</span>
        </div>
      </div>
    </div>
  );
}
