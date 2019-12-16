import { combineReducers } from "redux";

import { authentication } from "./auth.reducer";
import { users } from "./users.reducer";
import { alert } from "./alert.reducer";
import { customers } from "./customers.reducer";

const rootReducer = combineReducers({
  authentication,
  users,
  alert,
  customers
});

export default rootReducer;
