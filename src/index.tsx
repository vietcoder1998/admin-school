import React from "react";
import ReactDOM from "react-dom";
import "./app/view/scss/_keyFrame.scss";
import "./app/view/scss/_common.scss";
import ErrorBoundary from "./app/view/layout/common/ErrorBoudary";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { store } from "./redux/store/index";

import "../node_modules/font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "sweetalert2/src/sweetalert2.scss";
import "cropperjs/dist/cropper.css";
import "react-image-crop/dist/ReactCrop.css";
import { Atlg } from "./services/auto-login";
import Routes from "./routes/Routes";
import { loginUser } from "./services/login";
import Cookies from "universal-cookie";
import { TYPE } from "./const/type";

require("dotenv").config();

// async function LoginByRefreshToken() {
//   console.log('start login')
//   await Atlg();
// }
// LoginByRefreshToken(); /// chỗ này là làm
const cookie = new Cookies();
console.log(cookie);
console.log(cookie.get('actk'));
console.log(cookie.get('rftk'))
// async function AutoLogin() {
  
//   console.log(cookie);
//   await loginUser(cookie.get("rftk"), TYPE.REFESH_LOGIN);
// }

// if()
// console.log('start render')
const rootEl = document.getElementById("root");
const appRenderer = (Component: any) =>
  ReactDOM.render(
    <ErrorBoundary>
      <Provider store={store}>
        <Component />
      </Provider>
    </ErrorBoundary>,
    rootEl
  );

appRenderer(Routes);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
