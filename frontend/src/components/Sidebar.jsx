import React from "react";
import SidebarChat from "./SidebarChat";

export default function Sidebar({ chats, activeId, setActiveId }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__title-wrapper">
          <i className="fa-brands fa-whatsapp"></i>
          <div className="sidebar__title">WhatsApp UI</div>
        </div>
        <div className="sidebar__search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input placeholder="Search or start new chat" />
        </div>
      </div>

      <div className="sidebar__chats">
        {chats.map(chat => (
          <SidebarChat
            key={chat.id}
            chat={chat}
            active={chat.id === activeId}
            onClick={() => setActiveId(chat.id)}
          />
        ))}
      </div>

      <div className="sidebar__footer">
        <small>Built with ❤️ — Vite + React</small>
      </div>
    </aside>
  );
}
