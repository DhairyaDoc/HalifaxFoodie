/** Create a function to transfer messages from message to chatRoom collection */
import db from "./firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const MessageCollection = "messages";
const chatRoomCollection = "chatroom";
const chatRoomID = "chatRoomID";

export const closeLiveChat = () => {
  let userMessageList;
  let chatMessageList;
  let roomID = localStorage.getItem(chatRoomID);

  onSnapshot(
    query(collection(db, MessageCollection), where("chatRoomID", "==", roomID)),
    (messagesSnapshot) => {
      userMessageList = messagesSnapshot.docs.map((chatMessage) => {
        return chatMessage.data();
      });

      onSnapshot(
        query(
          collection(db, chatRoomCollection),
          where("chatRoomID", "==", roomID)
        ),
        (chatRoomSnapshot) => {
          chatMessageList = chatRoomSnapshot.docs.map((chatRoomMessage) => {
            return chatRoomMessage.id;
          });

          let documentID = chatMessageList[0];
          const chatRef = doc(db, chatRoomCollection, documentID);
          updateDoc(chatRef, { messages: userMessageList });
        }
      );
    }
  );
};
