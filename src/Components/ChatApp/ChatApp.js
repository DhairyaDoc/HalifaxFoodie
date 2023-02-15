/**
 * Title: Creating a chat room using firebase 
 * Author: Shravya Reddy Gennepally
 * Date: 2022/11/23
 * Availability: https://www.geeksforgeeks.org/user-to-user-private-chat-app-using-reactjs-and-firebase-without-socket-programming/
 */
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Button, Divider, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router";
import axios from "axios";

import db from "../../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { closeLiveChat } from "../../service";

function UsersComponent(props) {
  const handleToggle = (val) => {
    props.setRecieverData(val);
  };

  return (
    <List
      dense
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      {props.chats &&
        props.chats.map((value, index) => {
          return (
            <ListItem key={value.uid} disablePadding>
              <ListItemButton
                onClick={() => {
                  handleToggle(value);
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={`CHAT`} src={`CHAT`} />
                </ListItemAvatar>
                <ListItemText primary={`LIVE AGENT`} />
              </ListItemButton>
            </ListItem>
          );
        })}
    </List>
  );
}

export default function Home() {
  const [chatID, setChatID] = useState(undefined);

  const [recieverData, setRecieverData] = useState(undefined);
  const [chatMessage, setChatMessage] = useState("");
  const [chats, setChats] = useState([]);

  const [allMessages, setAllMessages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getChatsRepeatedly();
  }, []);

  const getMessages = () => {
    const unsub = onSnapshot(
      query(
        collection(db, "messages"),
        where("chatRoomID", "==", localStorage.getItem("chatRoomID"))
      ),
      (snapshot) => {
        let userChatList = snapshot.docs.map((doc) => {
          return doc.data();
        });
        setAllMessages(sortArray(userChatList));
      }
    );
    return unsub;
  };

  const sortArray = (arr) => {
    return arr.sort((x, y) => {
      return x.timestamp - y.timestamp;
    });
  };

  const getUserChat = () => {
    onSnapshot(
      query(
        collection(db, "chatroom"),
        where("chatRoomID", "==", localStorage.getItem("chatRoomID"))
      ),
      (snapshot) => {
        let userChatList = snapshot.docs.map((doc) => {
          return doc.data();
        });
        setChats(userChatList);
      }
    );
  };

  const findMessages = () => {
    localStorage.setItem("chatRoomID", chatID);
    getUserChat();
  };

  useEffect(() => {
    let messageList;
    if (recieverData) {
      const unsub = onSnapshot(
        query(
          collection(db, "messages"),
          where("chatRoomID", "==", localStorage.getItem("chatRoomID"))
        ),
        (snapshot) => {
          messageList = snapshot.docs.map((doc) => {
            return doc.data();
          });

          if (!localStorage.getItem("chatRoomID")) {
            localStorage.setItem("chatRoomID", messageList[0].chatRoomID);
          }

          if (!localStorage.getItem("restaurantID")) {
            localStorage.setItem("sentTo", messageList[0].sentTo);
          }

          if (!localStorage.getItem("orderID")) {
            localStorage.setItem("orderID", messageList[0].orderID);
          }

          setAllMessages(sortArray(messageList));
        }
      );

      return unsub;
    }
  }, [recieverData]);

  const sendMessage = async () => {
    try {
      if (recieverData) {
        await addDoc(collection(db, "messages"), {
          chatRoomID: localStorage.getItem("chatRoomID"),
          sentTo: localStorage.getItem("sentTo"),
          sendBy: localStorage.getItem("currentUser"),
          orderID: localStorage.getItem("orderID"),
          text: chatMessage,
          timestamp: new Date(),
        });
      }
      getMessages();
    } catch (error) {
      console.log(error);
    }
    setChatMessage("");
  };

  const getChatsRepeatedly = () => {
    if (localStorage.getItem("chatRoomID") && recieverData) {
      setTimeout(() => {
        getMessages();
        getChatsRepeatedly();
      }, 5000);
    }
  };

  const closeChat = () => {
    axios
      .post(
        `https://us-central1-tough-hull-366114.cloudfunctions.net/function-3`,
        {
          chatRoomID: localStorage.getItem("chatRoomID"),
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      )
      .then((res) => {})
      .catch((err) => {});
    closeLiveChat();
    localStorage.setItem("chatRoomID", null);
    navigate("/");
  };

  return (
    <>
      Enter Chatroom ID:{" "}
      <input
        type="text"
        onChange={(event) => {
          setChatID(event.target.value);
        }}
      />{" "}
      <button
        onClick={() => {
          findMessages();
        }}
      >
        Enter
      </button>
      <button
        onClick={() => {
          closeChat();
        }}
      >
        Close Chat
      </button>
      <div style={root}>
        <Paper style={left}>
          <div
            style={{
              display: "flex",
              padding: 5,
              justifyContent: "space-between",
            }}
          >
            <h4 style={{ margin: 0 }}>
              {localStorage.getItem("currentUser")
                ? localStorage.getItem("user")
                : "User"}{" "}
            </h4>
            <Button
              color="secondary"
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
          <Divider />
          ChatRoom
          <div style={{ overflowY: "scroll" }}>
            <UsersComponent
              chats={chats.length > 0 ? chats : []}
              setRecieverData={setRecieverData}
              navigate={navigate}
              currentUserId={
                localStorage.getItem("user") ? localStorage.getItem("user") : ""
              }
            />
          </div>
        </Paper>

        <Paper style={right}>
          <Divider />
          <div style={messagesDiv}>
            {/* messages area */}

            {allMessages &&
              allMessages.map((messages) => {
                return (
                  <div
                    key={Math.random()}
                    style={{
                      margin: 2,
                      display: "flex",
                      flexDirection:
                        localStorage.getItem("currentUser") === messages.sendBy
                          ? "row-reverse"
                          : "row",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#BB8FCE",
                        padding: 6,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        maxWidth: 400,
                        fontSize: 15,
                        textAlign:
                          localStorage.getItem("currentUser") ===
                          messages.sentBy
                            ? "right"
                            : "left",
                      }}
                    >
                      {messages.text}
                    </span>
                  </div>
                );
              })}
          </div>

          <div style={{ width: "100%", display: "flex", flex: 0.08 }}>
            <input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              style={input}
              type="text"
              placeholder="Type message..."
            />
            <IconButton onClick={sendMessage}>
              <SendIcon style={{ margin: 10 }} />
            </IconButton>
          </div>
        </Paper>
      </div>
    </>
  );
}

const root = {
  display: "flex",
  flexDirection: "row",
  flex: 1,
  width: "100%",
};

const left = {
  display: "flex",
  flex: 0.2,
  height: "95vh",
  margin: 10,
  flexDirection: "column",
};

const right = {
  display: "flex",
  flex: 0.8,
  height: "95vh",
  margin: 10,
  flexDirection: "column",
};

const input = {
  flex: 1,
  outline: "none",
  borderRadius: 5,
  border: "none",
};

const messagesDiv = {
  backgroundColor: "#FBEEE6",
  padding: 5,
  display: "flex",
  flexDirection: "column",
  flex: 1,
  maxHeight: 460,
  overflowY: "scroll",
};
