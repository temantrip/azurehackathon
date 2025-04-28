import { useState } from "react";

export default function ChatSidebar() {
  const [chats] = useState([
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hey, are you there?",

      status: "online",
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "Let's meet tomorrow.",

      status: "offline",
    },
    {
      id: 3,
      name: "Alice Johnson",
      lastMessage: "Got it, thanks!",
      status: "online",
    },
  ]);

  return (
    <div className="grid grid-cols-[300px,1fr] max-h-[100vh] gap-4">
      <div className="p-4 shadow-lg bg-[#242424]">
        <div className="w-[300px] overflow-y-auto h-screen">
          <h2 className="text-xl font-bold mb-6">Chats</h2>
          <div className="space-y-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-500/50 cursor-pointer transition"
              >
                <div className="relative"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{chat.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="h-[600px] p-6">
          <h2 className="text-2xl font-bold text-white">Chat Window</h2>
          <div>
            <div className="mt-4 text-gray-300 bg-gray-700">
              <p>Chat content goes here...</p>
            </div>
            <div className="mt-4 text-gray-300 bg-indigo-700">
              <p>Chat content 2 goes here...</p>
            </div>
          </div>
        </div>
        <div className="h-[100px] p-6">
          <div className="border border-gray-900 shadow-lg rounded-lg p-4 w-full space-y-4 bg-[#242424]">
            <textarea
              placeholder="Write a description..."
              rows={3}
              className="w-full text-sm text-gray-500 bg-transparent placeholder-gray-400 outline-none resize-none"
            ></textarea>
            <div className="flex justify-between items-center border-t border-gray-900 pt-3">
              <button className="flex items-center text-gray-500 text-sm hover:underline">
                <span>📎</span>
                <span className="ml-1">Attach a file</span>
              </button>

              <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-lg">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
