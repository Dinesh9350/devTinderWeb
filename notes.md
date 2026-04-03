https://namaste-nodejs.vercel.app/chapters/01-introduction-to-nodejs

# Episode-15 - DevTinder UI - Part 1 ✅

- create a vite + react app
- install tailwind css
- install Daisy ui
- install react router dom
- create BrowserRouter > Routes > Route =< Body/> RouteChildren
- create Outlet in your Body component
- create navbar and footer components

```js
//app.js
function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}
```

```js
//body.js
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
const Body = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
```

Body
Navbar
Route=/ => Feed
Route=/login => Login
Route=/connections => Connections
Route=/profile => Profile

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

# Episode-16 - DevTinder UI - Part 2 ✅

create a login page

- Install axios
- CORS - install cors in backend => add middleware to with configurations: origin, credentials: true
- whenever making Api call so pass { withCredentials: true }
  install react-redux + redux toolkit
  configureStore => Provider => createSlice => add reducer to store
  add redux devtools in chrome
  Login and see if your data is coming properly in the store
  Navbar should update as soon as user logs in
  refactor our code to add constants file + create a components folder

++++++++++++++++++++

Cors Error

- Install axios
- CORS - install cors in backend => add middleware to with configurations: origin, credentials: true
- whenever making Api call so pass { withCredentials: true }

- create Login page
- make email and password states
- handleLogin on Login button and do a post api send data
- cors error will come because localhost:3000 cannot call to localhost:7000 in the brower because both has different origin,
  to resolve this in the backend we have to use express cors middleware
  ```js
  //app.js
  npm i cors
  const cors = require("cors");
  app.use(cors());
  ```
- sending user in response

++++++++++++++++++++

Cookies

- Cookies are getting set in Postman but doesnt get set in Chrome and Axios because if you're getting cookie from different origin, Chromes and Axios doesn't allow it to be set in the chrome
  Fix: whitelist that domain in cors
  ```js
  //app.js (Backend)
  app.use(
    cors({
      origin: "http://localhost:5173/", //frontend hosted url
      credentials: true,
    }),
  );
  ```
  ```js
  //login.js (Frontend)
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/login",
        {
          email: emailId,
          password,
        },
        { withCredentials: true },
      );
    } catch (error) {
      console.log("error: ", error);
    }
  };
  ```
  only after this cookie will set in the browser -> console (Applications)

++++++++++++++++++++

Redux

after getting user data from login api
we are storing user data to Redux Toolkit

- Install Redux-Toolkit - https://redux-toolkit.js.org/tutorials/quick-start
- create a Store

```js
//store.js
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
  },
});
export default store;
```

- provider to wrap store to the app

```js
//app.js
<Provider store={appStore}>app</Provider>
```

- create a slice

```js
//userSlice.js
import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: (state, action) => {
      return null;
    },
  },
});
export const { addUser, reducer } = userSlice.actions;
export default userSlice.reducer;
```

- add slice in the Store in the reducers

Extension : Redux DevTools to track

```js
//login.jsx
const dispatch = useDispatch();
dispatch(addUser(res.data));
```

```js
//navbar.jsx
const userData = useSelector((store) => store.user);
```

show user profile photo and name in the navbar, show only when there is a user
once user it logged in navigate it to "/" - feed page

```js
//login.jsx
const navigate = useNavigate();
//after login api call and user dispatched to store
navigate("/");
dispatch(addUser(res.data));
```

```js
<Route path="/" element={<Body />}>
  //feed page
  <Route path="/" element={<Feed />} />
</Route>
```

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

# Episode-17 - DevTinder UI - Part 3 ✅

- you should not be able to access other routes without login
- if token is not present, redirect user to login page
- logout
- profile
- login validation

========================

Token (Cookies)
Problem:
After log in and going to feed page if i refresh, user just get logout
i've Token, so i should stay logged in (still i am logging out)
if not logout

i've Token, so i should stay logged in, to achieve this
Basically after loggin in i am calling another api to get the Profile of the user which i'm setting it in the Redux

```js
//body.js
const dispatch = useDispatch();
const fetchUser = async () => {
  try {
    const res = await axios.get(BASE_URL + "/profile/view", {
      withCredentials: true,
    });
    //adding user to the store which is used all over the app
    dispatch(addUser(res.data));
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  fetchUser();
}, []);
```

so now user info will be showed in whole app

```js
//(backend)
// middleware/auth.js
if (!token) {
  res.status(401).send("Please Login...");
}
```

```js
//body.js
const userData = useSelector((store) => store.user);
const fetchUser = async () => {
  //if there is user in redux, do not make api call => savig api calls on switching to different pages
  if (userData) return;
  try {
    const res = await axios.get(BASE_URL + "/profile/view", {
      withCredentials: true,
    });
    dispatch(addUser(res.data));
  } catch (error) {
    //if there is not token go back to login
    //401 means Unauthorized
    if (error.status === 401) {
      navigate("/login");
    }
    console.log(error);
  }
};
useEffect(() => {
  if (!user) {
    fetchUser();
  }
}, []);
```

========================

Logout

```js
//navbar..jsx
const handleLogOut = async () => {
  try {
    const res = await axios.post(
      BASE_URL + "/logout",
      {},
      { withCredentials: true },
    );
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
```

it clear out token but my app still doest gets logout without refresh because data stays in the Redux, so clear it before logout

```js
//navbar.jsx
const handleLogOut = async () => {
  try {
    axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    dispatch(removeUser());
    naviagte("/login");
  } catch (error) {
    console.log(error);
  }
};
```

========================

login validation
show err caught -> error.response

========================

feed
fetch feed and store in redux
build user card on the feed

Edit Profile
editprofile card

Error: Cannot read properties of undefined (reading 'length') why this is coming hwo to fix
else if (skills && Array.isArray(skills) && skills.length > 5) {
throw new Error("skills, only 5 skills are allowed");
}

show toast on profile update

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

# Episode-18 - DevTinder UI - Part 4 ✅

Feature: Accept/reject connections
- see all my connections

```js
//App.jsx
<Route path="/connections" element={<Connections />} />
```

```js
//Connections.jsx
show all connections in that and store in redux connectionsSlice
```
Accept , Reject requests
- see all my Requests -> accept, reject button functional

```js
//Requests.jsx
show all Requests in that and store in redux requestsSlice
```

========================

Accepted or Rejected user should be removed from Request Page
remove data of that specific user from redux


++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

# Episode-19 - DevTinder UI - Part 5 ✅

- send interested or rejected from feed
- sigup new user
- E2E testing


create signup in login page itself 
(backend) signup do the same as login, add token and send back the user add in slice



++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

```js

```
