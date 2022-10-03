import {
  setDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import "./Post.css";
import getCurrentPostData from "../../config/firebase";
import { FcLike, FcDislike } from "react-icons/fc";
import { BiCommentDetail } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommentSection from "./CommentSection";

function Post(props) {
  const { post, posts, likes, setLikes, getPosts, getComments, comments } =
    props;
  const [user] = useAuthState(auth);
  const [hasUserLiked, setHasUserLiked] = useState(null);
  const [openComments, setOpenComments] = useState(false);
  const [statez, setStatez] = useState();
  const [currentPostComments, setCurrentPostComments] = useState([]);

  const addLike = async () => {
    const currentDoc = await getCurrentPostData("id", post.id);

    await setDoc(doc(db, "posts", post.id), {
      ...currentDoc,
      whoLiked: currentDoc.whoLiked
        ? [...currentDoc.whoLiked, user?.uid]
        : [user?.uid],
      likes: currentDoc.likes ? currentDoc.likes + 1 : 1,
    });

    const updatedPostsArrayWithNewLikes = likes.map((doc) => {
      if (doc.id == post.id && doc.whoLiked) {
        return { ...doc, wholiked: [...doc.whoLiked, user?.uid] };
      } else if (doc.id == post.id && doc.whoLiked == undefined) {
        return { ...doc, wholiked: [user?.uid] };
      } else {
        return doc;
      }
    });
    setLikes(updatedPostsArrayWithNewLikes);
    getPosts();
    checkIfUserHasLiked();
    toast("❤ Liked", {
      autoClose: 1000,
      className: "toast",
    });
  };

  const removeLike = async () => {
    const currentDoc = await getCurrentPostData("id", post.id);
    const whoLikedTheDoc = currentDoc.whoLiked;

    const indexOfUserWhoLikedTheDoc = whoLikedTheDoc.indexOf(user?.uid);
    whoLikedTheDoc.splice(indexOfUserWhoLikedTheDoc, 1);

    await setDoc(doc(db, "posts", post.id), {
      ...currentDoc,
      whoLiked: whoLikedTheDoc,
      likes: currentDoc.likes - 1,
    });

    getPosts();
    checkIfUserHasLiked();
    toast("💔 Disliked", {
      autoClose: 1000,
      className: "toast",
    });
  };

  const checkIfUserHasLiked = async () => {
    const currentDoc = await getCurrentPostData("id", post.id);

    let res = null;

    if (currentDoc.whoLiked) {
      res = currentDoc.whoLiked.some((like) => {
        return like == user?.uid;
      });
    } else {
      res = false;
    }

    setHasUserLiked(res);
  };
  const matchCommentsOfCurrentPost = () => {
    const c = comments.filter((cc) => cc.id == post.id);

    c.length > 0
      ? setCurrentPostComments(c[0].comments)
      : setCurrentPostComments(currentPostComments);
  };

  useEffect(() => {
    getPosts();
    checkIfUserHasLiked();
    getComments();
    matchCommentsOfCurrentPost();
  }, []);

  useEffect(() => {
    checkIfUserHasLiked();
    matchCommentsOfCurrentPost();
  }, [posts]);

  useEffect(() => {
    matchCommentsOfCurrentPost();
    checkIfUserHasLiked();
    getPosts();
  }, [comments]);

  return (
    <div className="post-container">
      <div className="post">
        <img src={post.userPfpURL} className={"user-pfp"} />
        <div className="profile">
          <div className="profile-identification">
            <div className="username">{post.username}</div>
            <div className="user-id">@{post.userID}</div>
          </div>
        </div>
        <div className="title">{post.title}</div>
        <div className="description">{post.description}</div>
        {post.fileType == "image/jpeg" || "image/png" ? (
          <img src={post.fileURL} className="post-file" />
        ) : (
          <video
            src={post.fileURL}
            autoPlay
            muted
            controls
            loop
            className="post-file"
          ></video>
        )}
        <div className="post-dates">
          <p>
            {post.postDate.formatAMPM} - {post.postDate.formatDMY}
          </p>
        </div>
        <div className="interaction">
          {hasUserLiked ? (
            <FcDislike className="btns" onClick={removeLike}>
              Dislike
            </FcDislike>
          ) : (
            <FcLike className="btns" onClick={addLike}>
              Like
            </FcLike>
          )}
          {post.likes}
          {openComments ? (
            <CommentSection
              post={post}
              comments={currentPostComments}
              matchCommentsOfCurrentPost={matchCommentsOfCurrentPost}
              getComments={getComments}
              getPosts={getComments}
              setStatez={setStatez}
              statez={statez}
            />
          ) : (
            <BiCommentDetail onClick={() => setOpenComments(true)} />
          )}
          {currentPostComments.length}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Post;
