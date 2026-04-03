import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequests: (state, action) => null,
    removeUserRequest: (state, action) => {
      const newArr = state.filter((r) => r.fromUserId._id !== action.payload);
      return newArr;
    },
  },
});

export const { addRequests, removeRequests, removeUserRequest } =
  requestsSlice.actions;
export default requestsSlice.reducer;
