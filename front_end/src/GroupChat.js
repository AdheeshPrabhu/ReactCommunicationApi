import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./Chat.css";
import { useNavigate } from "react-router-dom";

const MessageInput = ({ handleSendMessage, userName, message, setMessage }) => (
  <Form onSubmit={handleSendMessage} className="col-xxl-6">
    <div>
      {userName} :
      <input
        className="message-input"
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        className="btn btn-outline-secondary ml-2"
        type="submit"
        value="Send"
      />
    </div>
  </Form>
);

const GroupChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const currentUser = localStorage.getItem("UserName");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser === "" || currentUser === null) {
      window.alert("No login, please login.");
      navigate("/Login");
      return;
    } else setUserName(currentUser);

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4200/chats");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const Data = await response.json();
        setMessages(Data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchData();
  }, []);

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        text: message,
        user: userName,
        timestamp: getCurrentTimestamp(),
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      try {
        const response = await fetch("http://localhost:4200/addChat", {
          method: "POST",
          body: JSON.stringify(newMessage),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setMessage("");
      } catch (error) {
        console.error("Error adding chat:", error);
      }
    }
  };

  const MessageList = () => (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          [{msg.timestamp}] <strong>{msg.user}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );

  return (
    <div className="chat-container">
      <h1 className="chatLine">Group Chat </h1>

      <MessageList />
      <MessageInput {...{ handleSendMessage, userName, message, setMessage }} />
    </div>
  );
};

export default GroupChat;
