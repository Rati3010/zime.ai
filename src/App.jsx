import React from "react";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path= "*" element={<h1>Not Found</h1>} />
    </Routes>
  );
};

export default App;
