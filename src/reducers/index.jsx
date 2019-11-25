import { combineReducers } from "redux";

import { authentication } from "./auth.reducer";
import { users } from "./users.reducer";
import { alert } from "./alert.reducer";
import { customers } from "./customers.reducer";
import { database } from "./database.reducer";

const rootReducer = combineReducers({
  authentication,
  users,
  alert,
  customers,
  database
});

export default rootReducer;
