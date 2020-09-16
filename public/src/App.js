import React from "react";
import "./App.css";

import { BrowserRouter, Route } from "react-router-dom";

import Home from "./components/home";
import LogIn from "./components/logIn";
import SignIn from "./components/signIn";
import Into from "./components/into";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Into} />
      <Route exact path="/logIn" component={LogIn} />
      <Route exact path="/signIn" component={SignIn} />
      <Route exact path="/home" component={Home} />
    </BrowserRouter>
  );
}

export default App;
