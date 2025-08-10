import React from "react";

export default function ChatHeader({ name, lastSeen }) {
  return (
    <div className="chat__header">
      <div className="chat__header-left">
        <div className="avatar-small">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#ddd" />
            <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fill="#666">U</text>
          </svg>
        </div>
        <div>
          <div className="chat__name">{name}</div>
          <div className="chat__lastseen">Last seen: {lastSeen}</div>
        </div>
      </div>

      <div className="chat__header-right">
        <button className="icon-btn">⋮</button>
      </div>
    </div>
  );
}
