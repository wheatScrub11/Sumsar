import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgWNsmoxcQE8dLTZN9tdwLr5hDrs8yZCU",
  authDomain: "sumsar-9456.firebaseapp.com",
  projectId: "sumsar-9456",
  storageBucket: "sumsar-9456.appspot.com",
  messagingSenderId: "677193697894",
  appId: "1:677193697894:web:fd13fc8f7911f67dda3ba7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
const storage = getStorage(app);
const storageRef = ref(storage);

const postsRef = collection(db, "posts");

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}
function formatDayMonthYear(date_) {
  let yearStringify = date_.getFullYear().toString();

  const year = `${yearStringify.charAt(2)}${yearStringify.charAt(3)}`;
  const monthFormath = (month) => {
    return month < 10 ? `0${month}` : `${month}`;
  };
  const month = monthFormath(date_.getMonth() + 1);
  const day = date_.getDate();

  const format = `${day}/${month}/${year}`;

  return format;
}
export const addPostToFirebase = async (data) => {
  // ill fix this trash code later
  const date = new Date();

  const dateToFirebase = {
    formatDMY: formatDayMonthYear(date),
    formatAMPM: formatAMPM(date),
  };

  const imageRef = ref(storage, `images/${date.getTime()}`);
  let username = "";
  let userID = "";
  let userPfpURL = "";

  onAuthStateChanged(auth, (user) => {
    user != null ? (username = user.displayName) : null;
    user != null ? (userID = user.uid) : null;
    user != null ? (userPfpURL = user.photoURL) : null;
  });

  await uploadBytes(imageRef, data.file[0]);
  const fileURL = await getDownloadURL(imageRef).catch((error) =>
    console.log(error)
  );

  try {
    await setDoc(doc(db, "posts", `${date.getTime()}`), {
      title: data.title,
      description: data.description,
      fileURL: fileURL,
      fileType: data.file[0].type,
      username: username,
      userID: userID,
      userPfpURL: userPfpURL,
      postDate: dateToFirebase,
      id: `${date.getTime()}`,
      likes: 0,
    });
    console.log("data uploaded");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getPostsFromFirebase = async () => {
  const querySnapshot = await getDocs(postsRef);
  return querySnapshot;
};

const getCurrentPostData = async (value, toCompareValue) => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where(value, "==", toCompareValue));
  const currentPostData = await getDocs(q);
  return currentPostData.docs[0].data();
};

export const getCurrentCommentFromFirebase = async (value, valueToCompare) => {
  const commentsCollectionRef = collection(db, "comments");
  const q = query(commentsCollectionRef, where("id", "==", valueToCompare));
  const referedCommentSection = await getDocs(q);
  console.log(referedCommentSection.docs[0]);
  return referedCommentSection.docs[0];
};

export const addCommentToFirebase = async (comment, postId) => {
  const date = new Date();
  const currentComment = await getCurrentCommentFromFirebase("id", postId);

  if (currentComment != undefined) {
    console.log(currentComment.data().comments);
  }
  await setDoc(doc(db, "comments", postId), {
    id: postId,
    comments:
      currentComment != undefined
        ? [
            ...currentComment.data().comments,
            {
              whoCommentedId: comment.userId,
              whoCommentedUsername: comment.username,
              whoCommentedPfpUrl: comment.userPfpUrl,
              commentDescription: comment.description,
              commentDate: {
                formatAMPM: formatAMPM(date),
                formatDMY: formatDayMonthYear(date),
              },
            },
          ]
        : [
            {
              whoCommentedId: comment.userId,
              whoCommentedUsername: comment.username,
              whoCommentedPfpUrl: comment.userPfpUrl,
              commentDescription: comment.description,
              commentDate: {
                formatAMPM: formatAMPM(date),
                formatDMY: formatDayMonthYear(date),
              },
            },
          ],
  });
};

export const getCommentsFromFirebase = async () => {
  const commentsRef = collection(db, "comments");
  const comments = await getDocs(commentsRef);
  const commentsData = comments.docs.map((doc) => ({ ...doc.data() }));
  console.log(commentsData)
  return commentsData
};
export default getCurrentPostData;
