import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import UserHeader from "../components/UserHeader";
import useGetPosts from "../hooks/useGetPosts";
import useGetUserProfile from "../hooks/useGetUserProfile";

const UserPage = () => {
  const {user, loading} = useGetUserProfile();
  const { posts, fetchingPosts } = useGetPosts("GET_POST_BY_USERNAME");


  if(!user && loading){
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    )
  }

  if(!user && !loading){
    return <h1>User not found</h1>
  }

  if(!user){
    return null;
  }

  return (
    <>
      <UserHeader user={user}/>
        {!fetchingPosts && posts.length === 0  && <h1>User has no posts</h1>}

        {fetchingPosts && (
          <Flex justifyContent={"center"}>
            <Spinner size="xl"/>
          </Flex>
        )}

        {posts && posts.map( post => (
          <Post key={post._id} post={post} postedBy={post.postedBy}/>
        ))}
      </>
  );
}

export default UserPage;