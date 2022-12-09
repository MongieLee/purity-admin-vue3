import Nprogress from "nprogress";
import {clearAuthToken, inspectTokenValidity} from "../utils/token.js";
import {message} from "ant-design-vue";

Nprogress.inc(0.1);
Nprogress.configure({minimum: 0.6});

const startNprogress = (to, from) => {
  if (!Nprogress.isStarted()) {
    Nprogress.start();
  }
}

const endNprogress = () => {
  setTimeout(() => {
    Nprogress.done();
  }, 200)
}

const loginGuard = (to, from, next) => {
  if (to.path !== "/login" && !inspectTokenValidity()) {
    message.warning("登录凭证已过期，请重新登录");
    clearAuthToken();
    next({
      path: "/login",
      query: {
        redirect: encodeURIComponent(to.fullPath)
      }
    });
  } else {
    next();
  }
}


export default {
  beforeEach: [startNprogress, loginGuard],
  afterEach: [endNprogress]
}
