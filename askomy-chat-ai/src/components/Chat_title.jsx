import { useCallback, useEffect, useState } from "react";
import { chat_title_delete, display_chat_title } from "../api/api_link";
import "./Chat_title.css";

function Chat_title({ onSelectChat, selectedChatId, refreshKey = 0, onDeleted }) {
  const [chatData, setChatData] = useState([]);
  const [error, setError] = useState("");

  const getTitle = useCallback(async () => {
    try {
      const data = await display_chat_title();
      setChatData(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.chats) ? data.chats : []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load chat titles.");
    }
  }, []);

  useEffect(() => { getTitle(); }, [getTitle, refreshKey]);

  async function deleteChat(id) {
    try {
      const result = await chat_title_delete({ chat_title_id: id });
      if (result?.value === "True") {
        setChatData(previous => previous.filter(chat => chat.id !== id));
        if (String(selectedChatId) === String(id)) onSelectChat(null);
        onDeleted?.(id);
      } else {
        setError(result?.message || "Chat could not be deleted.");
      }
    } catch (err) {
      setError(err.message || "Chat could not be deleted.");
    }
  }

  return (
    <div className="chat-list">
      {error && <p role="alert" className="chat-error">{error}</p>}
      {chatData.map(chat => (
        <div className={`chat-item ${String(selectedChatId) === String(chat.id) ? "selected" : ""}`} key={chat.id}>
          <button type="button" className="chat-title" onClick={() => onSelectChat( String(selectedChatId) === String(chat.id) ? null : chat.id )}>  {chat.chat_title}</button>
          <button type="button" className="delete-btn" onClick={() => deleteChat(chat.id)} title="Delete chat" aria-label={`Delete ${chat.chat_title}`}>✘</button>
        </div>
      ))}
    </div>
  );
}

export default Chat_title;
