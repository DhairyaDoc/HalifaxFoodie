const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} = require("firebase/firestore");

const chatRoomCollection = "chatroom";
const messageCollection = "messages";

const firebaseConfig = {
  apiKey: "AIzaSyDVXmyvTxlsrX2UwT8pk8WRfMhRmixXpuw",
  authDomain: "serverlessproject-21.firebaseapp.com",
  projectId: "serverlessproject-21",
  storageBucket: "serverlessproject-21.appspot.com",
  messagingSenderId: "868913007078",
  appId: "1:868913007078:web:6349eb85e49bc240482e27",
  measurementId: "G-PTNG48SQM2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.helloPubSub = async (event, context) => {
  console.log("Inside subscriber 2: ", event);
  const publishedMessage = JSON.parse(
    Buffer.from(event.data, "base64").toString()
  );

  console.log(publishedMessage);

  try {
    const chatroomId = publishedMessage.chatroomId;

    onSnapshot(query(collection(db, messageCollection), where("chatRoomID", "==", "2")), (messageSnapshot) => {
      let messageList = messageSnapshot.docs.map((doc) => {
        return doc.data();
      });

      console.log("Message List: ", messageList);

      onSnapshot(query(collection(db, chatRoomCollection), where("chatRoomID", "==", "2")), (chatRoomSnapshot) => {
        let chatRoomList = chatRoomSnapshot.docs.map((doc) => {
          return doc.id;
        });

        console.log("ChatRoom List: ", chatRoomList);
      });
    })
  } catch (error) {
    console.log("Something went wrong while computing with firebase: ", error);
  }
};
