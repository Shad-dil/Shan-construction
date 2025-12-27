import { useState } from "react";

import "./App.css";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import TrustStrip from "./components/TrustStrip";

function App() {
  return (
    <>
      <Navbar companyName={"SHAAN"} />
      <Hero />
      <TrustStrip />
    </>
  );
}

export default App;
