// sample data; add more chats/messages as needed
const chats = [
  {
    id: "c1",
    name: "John Doe",
    avatar: null,
    lastSeen: "online",
    lastMessage: "See you at 7!",
    messages: [
      { id: 1, text: "Hey — are you free tonight?", sender: "them", time: "18:02" },
      { id: 2, text: "Yes! let's meet at 7.", sender: "me", time: "18:03" },
      { id: 3, text: "Perfect — see you 😊", sender: "them", time: "18:04" }
    ]
  },
  {
    id: "c2",
    name: "Design Group",
    avatar: null,
    lastSeen: "yesterday",
    lastMessage: "Files uploaded",
    messages: [
      { id: 1, text: "Uploaded the Figma file.", sender: "them", time: "09:00" },
      { id: 2, text: "Thanks — checking now.", sender: "me", time: "09:10" }
    ]
  },
  {
    id: "c3",
    name: "Jane Smith",
    avatar: null,
    lastSeen: "2:22 PM",
    lastMessage: "Cool!",
    messages: [
      { id: 1, text: "That works for me 👍", sender: "them", time: "14:20" }
    ]
  }
];

export default chats;
