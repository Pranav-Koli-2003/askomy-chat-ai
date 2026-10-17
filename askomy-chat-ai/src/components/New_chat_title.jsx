import { useState } from "react";
import "./Form.css";
import { add_new_chat_title } from "../api/api_link";
import { toast } from 'react-toastify';

function New_chat_title({ onCreated }) {
  const [newChat, setNewChat] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function Add_New_chat(e) {
    e.preventDefault();
    const title = newChat.trim();
    if (!title || saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await add_new_chat_title({ chat_title: title });
      if (result?.value === "True") {
        setNewChat("");
        onCreated?.(title, result);
        toast.success(result.chat_title ,' ' , result.message)
      } else {
        setError(result?.message || "Chat could not be created.");
      }
    } catch (err) {
      setError(err.message || "Chat could not be created.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="system_info">
      <form onSubmit={Add_New_chat}>
        <label htmlFor="new-chat-title">New Chat Title</label>
        <input id="new-chat-title" type="text" placeholder="e.g. Doctor info" value={newChat} onChange={e => setNewChat(e.target.value)} required maxLength={150} />
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={saving || !newChat.trim()}>{saving ? "Creating..." : "Create chat"}</button>
      </form>
    </div>
  );
}

export default New_chat_title;
