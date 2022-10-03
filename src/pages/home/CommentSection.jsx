import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { auth } from "../../config/firebase";
import {
  addCommentToFirebase,
} from "../../config/firebase";
import Comment from "./Comment";

function CommentSection(props) {
  const { post, comments, matchCommentsOfCurrentPost, getComments, getPosts, setStatez, statez } = props;
  const [user] = useAuthState(auth);

  useEffect(() => {
    matchCommentsOfCurrentPost();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const addComment = async (data) => {
    await addCommentToFirebase(data, post.id);
    await matchCommentsOfCurrentPost()
    await getComments()
    
  };

  const onSubmit = async (data) => {
    console.log(data);
    const commentData = {
      description: data.description,
      userId: user?.uid,
      username: user?.displayName,
      userPfpUrl: user?.photoURL,
    };
    console.log(commentData);

    await addComment(commentData);
  };

  return (
    <div className="coment-section-container">
      <div className="coment-section">
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            required
            maxLength={200}
            placeholder={"Add a comment..."}
            {...register("description")}
          />
          <input type="submit" />
        </form>
        {comments?.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
