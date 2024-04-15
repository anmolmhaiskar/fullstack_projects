import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost caption="This is my first post on thread" likes={323} replies={20} img="/post1.png"/>
      <UserPost caption="I have tried creating a leetcode clone, please follow and like this post" likes={184} replies={58} img="/post2.png"/>
    </>
  );
}

export default UserPage