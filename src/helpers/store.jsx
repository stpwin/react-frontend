import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "../reducers";

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === `development`) {
  const loggerMiddleware = createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error
  });

  middlewares.push(loggerMiddleware);
}

export const store = createStore(rootReducer, applyMiddleware(...middlewares));
