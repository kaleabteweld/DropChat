import React from "react";
import "./App.css";

import { BrowserRouter, Route } from "react-router-dom";

import { createStore } from "redux";
import { Provider } from "react-redux";
import root_reducer from "./redux/reducer";

import Root from "./components/root";
import LogIn from "./components/logIn";
import SignIn from "./components/signIn";
import Into from "./components/into";

const Store = createStore(
  root_reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function App() {
  return (
    <Provider store={Store}>
      <BrowserRouter>
        <Route exact path="/" component={Into} />
        <Route exact path="/logIn" component={LogIn} />
        <Route exact path="/signIn" component={SignIn} />
        <Route exact path="/home" component={Root} />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
