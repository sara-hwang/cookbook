import { LiveHelp } from "@mui/icons-material";
import { IconButton, TextField, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { sendChatMessage } from "../../../../utils/api";
import "./Chat.css";

interface Message {
  text: string;
  user: boolean;
}

interface ChatProps {
  recipe: string;
}

const Chat = ({ recipe }: ChatProps) => {
  const theme = useTheme();
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currMessage, setCurrMessage] = useState<string>("");
  const [userMessages, setUserMessages] = useState<string[]>([]);

  useEffect(() => {
    if (showChat) scrollToBottom();
  }, [showChat, messages]);

  useEffect(() => {
    const makeChatRequest = async () => {
      setLoading(true);
      const response = await sendChatMessage([recipe, ...userMessages]);
      setLoading(false);
      if (response)
        setMessages((prev) => [...prev, { text: response.data, user: false }]);
    };
    if (userMessages.length) makeChatRequest();
  }, [userMessages]);

  const scrollToBottom = () => {
    const element = document.getElementById("message-history");
    if (element) element.scrollTop = element.scrollHeight;
  };

  return (
    <div>
      {showChat && (
        <div className="chat-container">
          <div id="message-history" className="disable-scrollbars">
            {messages.map((msg, index) => {
              return (
                <div
                  key={index}
                  className={`message ${msg.user ? "user" : "ai"}`}
                >
                  <div
                    className="message-text"
                    style={{
                      background: msg.user
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                    }}
                  >
                    {`${msg.text}`}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
          </div>
          <TextField
            variant="filled"
            placeholder="Eg. How many grams is in a cup of butter?"
            fullWidth
            multiline
            hiddenLabel
            rows={2}
            size="small"
            value={currMessage}
            inputProps={{ style: { padding: 0 } }}
            onChange={(event) => {
              setCurrMessage(event.target.value);
            }}
            onKeyDown={async (event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              if (!currMessage) return;
              setUserMessages((prev) => [...prev, currMessage]);
              setMessages((prev) => [
                ...prev,
                { text: currMessage, user: true },
              ]);
              setCurrMessage("");
            }}
          />
        </div>
      )}
      <div className="chat-button">
        <IconButton disableRipple onClick={() => setShowChat((bool) => !bool)}>
          <LiveHelp />
        </IconButton>
      </div>
    </div>
  );
};
export default Chat;
