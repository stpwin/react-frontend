import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';



import { routerMiddleware } from "react-router-redux"

import { createBrowserHistory } from "history";

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

const myRouterMiddleware = routerMiddleware(history)

const middlewares = [myRouterMiddleware, thunkMiddleware];

if (process.env.NODE_ENV === `development`) {

  const loggerMiddleware = createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error
  });
  middlewares.push(loggerMiddleware);
}

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));
