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
      const chatWindow = document.querySelector("#__chat-window");
      if (chatWindow) {
        chatWindow.scrollTo(0, chatWindow.scrollHeight);
      }
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
    <div className="grid grid-cols-[189px,1fr] min-h-screen gap-4">
      <div className="p-4 shadow-lg bg-[#242424]">
        <div className="overflow-y-auto h-screen">
          <div className="flex justify-start items-center gap-4 my-4">
            <img src="logo.jpg" alt="Logo" className="w-9 h-9 rounded-full" />
            <h2 className="text-xl font-bold">Chats</h2>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col h-screen">
        <div className="h-[70%] p-6 overflow-y-scroll" id="__chat-window">
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
                  <div className="mt-4 max-w-[700px] text-white bg-darkgreen p-3 rounded-md">
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
                    className="flex items-center bg-darkgreen hover:opacity-70 text-white text-sm font-semibold px-5 py-2 rounded-lg"
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
                    className="flex items-center bg-darkgreen hover:opacity-70 text-white text-sm font-semibold px-5 py-2 rounded-lg"
                  >
                    <span>📎</span>
                    <span className="ml-1">Generate Quotation</span>
                  </button>
                )}
                {itsSummary && (
                  <button
                    onClick={() => handleDownloadFile("invoice/create-invoice")}
                    className="flex items-center bg-darkgreen hover:opacity-70 text-white text-sm font-semibold px-5 py-2 rounded-lg"
                  >
                    <span>📎</span>
                    <span className="ml-1">Generate Invoice</span>
                  </button>
                )}
              </div>
              <div></div>
              <button
                className="bg-darkgreen hover:opacity-70 text-white text-sm font-semibold px-5 py-2 rounded-lg"
                onClick={() => {
                  sendMessageToAgent(message);
                  setActiveChat((prev) => [
                    ...prev,
                    { message: message, identity: "user" },
                  ]);
                  const chatWindow = document.querySelector("#__chat-window");
                  if (chatWindow) {
                    chatWindow.scrollTo(0, chatWindow.scrollHeight);
                  }
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
