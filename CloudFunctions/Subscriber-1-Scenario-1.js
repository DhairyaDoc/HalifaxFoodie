/** References
 * 1. https://cloud.google.com/community/tutorials/cloud-functions-firestore
 */

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { collection, addDoc } = require("firebase/firestore");

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
  console.log("Inside the subscriber: ", event);
  const publishedMessage = JSON.parse(
    Buffer.from(event.data, "base64").toString()
  );

  console.log("Published Message: ", publishedMessage);
  try {
    publishedMessage.timestamp = new Date();
    let chatroomDocument = publishedMessage;
    chatroomDocument.messages = [];

    const chatDocumentRef = await addDoc(
      collection(db, chatRoomCollection),
      chatroomDocument
    );

    let messageDocument = publishedMessage;
    messageDocument.text = "Hello";

    const messageDocumentRef = await addDoc(
      collection(db, messageCollection),
      messageDocument
    );
  } catch (error) {
    console.log("Error in adding documents in the firestore: ", error);
  }
};
