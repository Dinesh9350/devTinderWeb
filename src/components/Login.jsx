import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("newuser@gmail.com");
  const [password, setPassword] = useState("NewUser@123");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          email: emailId,
          password,
        },
        { withCredentials: true },
      );
      console.log("Login user: ", res);
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      console.log("err: ", err);
      console.log("err.response: ", err?.response);
      setError(err?.response?.data?.message);
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, email: emailId, password },
        { withCredentials: true },
      );
      console.log("handleSignup", res);
      dispatch(addUser(res.data.data));
      navigate("/");
    } catch (err) {
      console.log("err: ", err);
      console.log("err.response: ", err?.response);
      setError(err?.response?.message);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="card card-dash bg-base-300 w-96 ">
        <div className="card-body">
          <h2 className="card-title text-center  pb-4">
            {isLoginForm ? "Login" : "Signup"}
          </h2>
          <div className="space-y-3">
            {!isLoginForm && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text pb-2">First Name</span>
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    className="input input-bordered"
                    placeholder="Enter First Name"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text pb-2">Last Name</span>
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    className="input input-bordered"
                    placeholder="Enter Last Name"
                  />
                </div>
              </>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text pb-2">Email Id</span>
              </label>
              <input
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                type="text"
                className="input input-bordered"
                placeholder="Enter Email Id"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text pb-2">Password</span>
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                className="input input-bordered"
                placeholder="Enter Password"
              />
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="card-actions justify-end mx-auto">
            {isLoginForm ? (
              <button className="btn btn-primary" onClick={handleLogin}>
                Login
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSignup}>
                Signup
              </button>
            )}
          </div>
        </div>
        {isLoginForm ? (
          <button
            className="text-center pb-8 cursor-pointer"
            onClick={() => {
              setIsLoginForm(false);
              setFirstName("");
              setLastName("");
              setEmailId("");
              setPassword("");
            }}
          >
            New User ? Signup Here
          </button>
        ) : (
          <button
            className="text-center pb-8 cursor-pointer"
            onClick={() => {
              setIsLoginForm(true);
              setFirstName("");
              setLastName("");
              setEmailId("");
              setPassword("");
            }}
          >
            Existing User ? Login Here
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
