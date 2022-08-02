import React from "react";
import ReactDOM from 'react-dom/client'
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)

serviceWorker.unregister();
