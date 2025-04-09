import { JSX } from "react";
import Navbar from "./components/navbar";
import { Container } from "@mui/material";

function App(): JSX.Element {
  return (
    <>
      <Container sx={{ mt: 2 }}>
          <Navbar />
      </Container>
    </>
  )
}

export default App