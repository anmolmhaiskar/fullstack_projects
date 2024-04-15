import { Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";

function App() {

  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/posts/:pid" element={<PostPage />} />
      </Routes>
    </Container>
  )
}

export default App
