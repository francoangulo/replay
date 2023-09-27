import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import ownerComplexesReducer from "./slices/ownerComplexesSlice";
import turnsReducer from "./slices/turnsSlice";
import complexesReducer from "./slices/complexesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    ownerComplexes: ownerComplexesReducer,
    complexes: complexesReducer,
    turns: turnsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
