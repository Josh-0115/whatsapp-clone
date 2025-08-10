import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import API from "./api/api";
import socket from "./api/socket";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // fetch messages
  const fetchMessages = async () => {
    try {
      const res = await API.get("/messages");
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();

    // connect socket
    socket.connect();

    // When a new message arrives from server
    socket.on("new_message", (msg) => {
      setMessages(prev => {
        // prevent duplicates: messageId unique
        if (prev.some(m => m.messageId === msg.messageId)) return prev;
        return [...prev, msg];
      });
    });

    // When a status update arrives
    socket.on("status_update", (update) => {
      setMessages(prev => prev.map(m => m.messageId === update.messageId ? { ...m, status: update.status } : m));
    });

    socket.on("connect", () => console.log("socket connected", socket.id));
    socket.on("disconnect", () => console.log("socket disconnected"));

    return () => {
      socket.off("new_message");
      socket.off("status_update");
      socket.disconnect();
    };
  }, []);

  // send message (calls backend /send)
  const sendMessage = async (payload) => {
    try {
      const res = await API.post("/send", payload);
      // message is emitted from backend; but also optimistic update below is optional
      // optimistic:
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Error sending", err);
    }
  };

  // group messages by contact id (as before)
  const groupedChats = messages.reduce((acc, msg) => {
    const contactId = msg.direction === "outgoing" ? msg.contactId : msg.contactId;
    if (!acc[contactId]) acc[contactId] = [];
    acc[contactId].push(msg);
    return acc;
  }, {});

  const chatList = Object.keys(groupedChats).map(id => ({
    id,
    name: groupedChats[id][0]?.contactName || id,
    messages: groupedChats[id]
  }));

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar chats={chatList} activeId={activeChat} setActiveId={setActiveChat} />
        <Chat
          chat={chatList.find(c => c.id === activeChat)}
          onSend={(text) =>
            sendMessage({
              contactId: activeChat,
              contactName: chatList.find(c => c.id === activeChat)?.name,
              text
            })
          }
        />
      </div>
    </div>
  );
}