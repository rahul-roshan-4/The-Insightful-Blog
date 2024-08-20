import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(process.env.React_App_Host_Api + "/post")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => <Post key={post.id} {...post} />)}
    </>
  );
}
