import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For showing loading state

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    setIsLoading(true); // Show loading spinner

    try {
      console.log("Sending message to backend:", input); // Log the message being sent

      const response = await axios.post("http://localhost:5000/chat", {
        message: input,
      });

      console.log("Response from backend:", response.data); // Log response from backend

      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      const errorMessage = { text: "Error fetching response", sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setIsLoading(false); // Hide loading spinner
    setInput(""); // Clear input field
  };

  return (
    <div className="chat-container">
      <div className="chat-header">General Knowledge Chatbot</div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot">Loading...</div> // Show loading state
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
