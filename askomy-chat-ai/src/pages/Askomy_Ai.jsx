
import React, { useState } from 'react';
import { display_chat_title } from '../api/api_link';
import System from '../components/System';
import Chat_title from '../components/Chat_title';

import New_chat_title from '../components/New_chat_title';
import Ai_chat from '../components/Ai_chat';

import './Askomy_Ai.css'

export default function Askomy_Ai() {
    const [settingOpen, setSettingOpen] = useState(false);
    const [newChatOpen, setNewChatOpen] = useState(false);

    const [selectedChatId, setSelectedChatId] = useState(null);
    const [chatRefreshKey, setChatRefreshKey] = useState(0); 
    

 function open_setting() {
        setSettingOpen(!settingOpen);
        setNewChatOpen(false);
    }

    function open_new_chat() {
        setNewChatOpen(!newChatOpen);
        setSettingOpen(false);
    }

    async function chatCreated(title, result) {
        setNewChatOpen(false);
        setChatRefreshKey(value => value + 1);
        // Prefer the new chat ID returned by Django; otherwise find it by title.
        const returnedId = result?.id ?? result?.chat_title_id ?? result?.data?.id ?? result?.chat?.id;
        if (returnedId !== undefined && returnedId !== null) {
            setSelectedChatId(returnedId);
            return;
        }
        try {
            const data = await display_chat_title();
            const chats = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.chats) ? data.chats : [];
            const created = [...chats].reverse().find(chat => chat.chat_title === title);
            if (created) setSelectedChatId(created.id);
        } catch (error) {
            console.error('Could not select the new chat:', error);
        }
    }


    return (
        <>
        
        <div className="AskOmy">
            <header className="welcome">
                <h3>AskOmy <span>AI</span></h3>
                <div className="welcome-status">
                    <span className="status-dot"></span>
                    Your AI assistant
                </div>
            </header>

            <div className="Ai">
                <aside className="Askomy_system">

                    <div className="sidebar-brand">
                        <div className="brand-icon">✦</div>
                        <div>
                            <h2>AskOmy AI</h2>
                            <p>Your intelligent space</p>
                        </div>
                    </div>

                    <button
                        className="sidebar-button new-chat-button"
                        onClick={open_new_chat}
                    >
                        <span className="button-icon">＋</span>
                        <span>New chat</span>
                    </button>

                    <div className="history-heading">RECENT CHATS</div>

                    <div className="title">
                       <Chat_title onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} refreshKey={chatRefreshKey} /> 
                    </div>

                    <div className="sidebar-bottom">
                        <button
                            className="sidebar-button setting-button"
                            onClick={open_setting}
                        >
                            <span className="button-icon">⚙</span>
                            <span>Settings</span>
                        </button>
                    </div>
                </aside>

                <main className="AskOmy_chat">
                   <Ai_chat chatId={selectedChatId} />  
                </main>
            </div>

            {/* Popup overlay */}
            {(settingOpen || newChatOpen) && (
                <div
                    className="popup-overlay"
                    onClick={() => {
                        setSettingOpen(false);
                        setNewChatOpen(false);
                    }}
                >
                    <section
                        className="popup-panel"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="popup-header">
                            <h2>
                                {settingOpen ? 'Settings' : 'New chat'}
                            </h2>

                            <button
                                className="popup-close"
                                onClick={() => {
                                    setSettingOpen(false);
                                    setNewChatOpen(false);
                                }}
                                aria-label="Close popup"
                            >
                                ×
                            </button>
                        </div>

                        <div className="popup-content">
                            {settingOpen && <System />}
                            {newChatOpen && <New_chat_title onCreated={chatCreated} />}
                        </div>
                    </section>
                </div>
            )}
        </div>
        </>
    );
}


