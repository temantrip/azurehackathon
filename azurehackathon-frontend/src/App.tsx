import axios from "axios";
import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";

export default function ChatSidebar() {
  const [html, setHtml] = useState("");

  const [activeChat, setActiveChat] = useState<
    {
      message: string;
      identity: "user" | "assistant";
    }[]
  >([]);

  const [threadId, setThreadId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [itsSummary, setItsSummary] = useState<string | null>(null);

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

  const sendMessageToAgent = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/chat-agent/chat",
        {
          question: message,
          ...(threadId ? { threadId: threadId } : {}),
        }
      );
      setHtml(response?.data?.messages[0]);
      console.log(response);
      setThreadId(response?.data?.threadId);
      setActiveChat((prev) => [
        ...prev,
        { message: response?.data?.messages?.[0], identity: "assistant" },
      ]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  interface GeneratePDFResponse {
    data: {
      response: {
        text: {
          value: string;
        };
      }[];
    };
  }

  const handleGeneratePDF = (response: GeneratePDFResponse) => {
    const responseData = response?.data?.response?.[0]?.text.value;

    html2pdf()
      .from(responseData)
      .set({
        margin: 0.5,
        filename: "myProposal.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save();

    const newTab = window.open("", "_blank");

    if (newTab) {
      newTab.document.open();
      newTab.document.write(responseData);
      newTab.document.close();
    }
  };

  const handleDownloadFile = async (path: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:3000/${path}`, {
        question: html,
      });

      handleGeneratePDF(response);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeChat) {
      activeChat?.forEach((el) => {
        if (el?.message?.toLowerCase()?.includes("[summary]")) {
          setItsSummary(el?.message);
        }
      });
    }
  }, [activeChat]);

  return (
    <div className="grid grid-cols-[300px,1fr] min-h-screen gap-4">
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
      <div className="w-full flex flex-col h-screen">
        <div className="h-[70%] p-6 overflow-y-scroll">
          <h2 className="text-2xl font-bold text-white">Chat Window</h2>
          {activeChat?.map((el, index) => (
            <div key={index}>
              {el?.identity === "user" ? (
                <div className="flex justify-between items-center mb-4">
                  <div></div>
                  <div className="mt-4 max-w-[700px] text-gray-300 bg-gray-700 p-3 rounded-md">
                    <p>{el?.message}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center mb-4">
                  <div className="mt-4 max-w-[700px] text-gray-300 bg-indigo-700 p-3 rounded-md">
                    <div
                      dangerouslySetInnerHTML={{ __html: el?.message }}
                    ></div>
                  </div>
                  <div></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-6">
          <div className="border border-gray-900 shadow-lg rounded-lg p-4 w-full space-y-4 bg-[#242424]">
            <textarea
              placeholder="Write a description..."
              rows={3}
              className="w-full text-sm text-white bg-transparent placeholder-gray-400 outline-none resize-none"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            ></textarea>
            <div className="flex justify-between items-center border-t border-gray-900 pt-3">
              <div className="flex gap-2 items-center">
                {itsSummary && (
                  <button
                    onClick={() =>
                      handleDownloadFile("proposal/create-proposal")
                    }
                    className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-lg"
                  >
                    <span>📎</span>
                    <span className="ml-1">Generate Proposal</span>
                  </button>
                )}
                {itsSummary && (
                  <button
                    onClick={() =>
                      handleDownloadFile("quotation/create-quotation")
                    }
                    className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-lg"
                  >
                    <span>📎</span>
                    <span className="ml-1">Generate Quotation</span>
                  </button>
                )}
                {itsSummary && (
                  <button
                    onClick={() =>
                      handleDownloadFile("quotation/create-quotation")
                    }
                    className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-lg"
                  >
                    <span>📎</span>
                    <span className="ml-1">Generate Invoice</span>
                  </button>
                )}
              </div>
              <div></div>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-lg"
                onClick={() => {
                  sendMessageToAgent(message);
                  setActiveChat((prev) => [
                    ...prev,
                    { message: message, identity: "user" },
                  ]);
                  setMessage("");
                }}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
