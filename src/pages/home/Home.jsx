import Navbar from "../../components/Navbar";
import CreatePost from "./CreatePost";
import {
  auth,
  getCommentsFromFirebase,
  getPostsFromFirebase,
} from "../../config/firebase";
import { useEffect, useState, createContext } from "react";
import Post from "./Post";
import { useAuthState } from "react-firebase-hooks/auth";

export const AppContext = createContext();


function Main() {
  const [posts, setPosts] = useState(null);
  const [likes, setLikes] = useState(null);
  const [comments, setComments] = useState(null);

  const [user] = useAuthState(auth)


  const getPosts = async () => {
    const data = await getPostsFromFirebase();
    const s = data.docs.map((doc, index) => ({ ...doc.data() }));
    setPosts(s);
    setLikes(s);
  };

  const getComments = async () => {
    const data = await getCommentsFromFirebase();
    setComments(data);
  };

  useEffect(() => {
    getComments()
    getPosts();
  }, []);

  return (
    <AppContext.Provider value={{comments, setComments, getComments}}>
      <div>
        <Navbar />
        {user ? <CreatePost getPosts={getPosts} getComments={getComments} /> : <h1>Inicia sesión para publicar algo</h1>}
        
        {posts
          ?.slice(0)
          .reverse()
          .map((post, index) => (
            <Post
              key={index}
              post={post}
              setLikes={setLikes}
              likes={likes}
              getPosts={getPosts}
              posts={posts}
              getComments={getComments}
              comments={comments}
            />
          ))}
      </div>
    </AppContext.Provider>
  );
}

export default Main;
