import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import logo from './assets/whitelogo.png';

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showSidebar, setShowSidebar] = useState(!isMobile);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setShowSidebar(!mobile); // hide sidebar on mobile, show on desktop
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getAllThreads = async () => {
        try {
            // const response = await fetch("http://localhost:8080/api/thread");
            const response = await fetch("https://sigmax-e19f.onrender.com/api/thread");
            const res = await response.json();
            console.log("API /api/thread response:", res);

            if (Array.isArray(res)) {
                const filteredData = res.map(thread => ({
                    threadId: thread.threadId,
                    title: thread.title,
                }));
                setAllThreads(filteredData);
            } else {
                console.error("Unexpected response:", res);
                setAllThreads([]);
            }
        } catch (err) {
            console.error("Failed to fetch threads:", err);
            setAllThreads([]);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        if (isMobile) setShowSidebar(false);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            // const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const response = await fetch(`https://sigmax-e19f.onrender.com/api/thread/${newThreadId}`);
            const res = await response.json();
            setPrevChats(res.messages || []);
            setNewChat(false);
            setReply(null);
            setPrompt("");
            if (isMobile) setShowSidebar(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            // const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
            const response = await fetch(`https://sigmax-e19f.onrender.com/api/thread/${threadId}`, { method: "DELETE" });
            await response.json();
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) createNewChat();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {/* Hamburger Toggle */}
            {isMobile && (
                <button className="hamburger-toggle" onClick={() => setShowSidebar(!showSidebar)}>
                    {showSidebar ? <IoMdClose size={24} /> : <GiHamburgerMenu size={24} />}
                </button>
            )}

            {/* Sidebar */}
            {showSidebar && (
                <section className="sidebar">
                    <button className="new-chat-btn" onClick={createNewChat}>
                        <img src={logo} alt="gpt logo" />
                        <span><i className="fa-solid fa-pen-to-square"></i></span>
                    </button>
                    <div className="chat"></div>
                    <h3 className="chat-heading ">Chats</h3>

                    <ul className="history">
                        {allThreads?.map((thread, idx) => (
                            <li key={idx}
                                onClick={() => changeThread(thread.threadId)}
                                className={thread.threadId === currThreadId ? "highlighted" : ""}
                            >
                                {thread.title}
                                <i className="fa-solid fa-trash"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteThread(thread.threadId);
                                    }}
                                ></i>
                            </li>
                        ))}
                    </ul>

                    <div className="sign">
                        <p>By Tanu Panwar &hearts;</p>
                    </div>
                </section>
            )}
        </>
    );
}

export default Sidebar;
