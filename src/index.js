import React from "react";
import ReactDOM from "react-dom";
import App from './frontend/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import store from "./frontend/store";

if (process.env.NODE_ENV !== "production") {
  const parcelSocket = new WebSocket("ws://localhost:1234/");
  parcelSocket.onmessage = () => {
    window.location.reload();
  };
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
