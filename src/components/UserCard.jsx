import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [showToastStatus, setShowToastStatus] = useState();
  const dispatch = useDispatch();
  if (!user) return null;
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

  const handleSendRequest = async (status, userId) => {
    const res = await axios.post(
      BASE_URL + `/request/send/${status}/${userId}`,
      {},
      { withCredentials: true },
    );
    console.log("handleSendRequest: ", res);
    setShowToast(true);
    setShowToastStatus(status);
    setToastMessage(res.data.message);
    dispatch(removeUserFromFeed(_id));

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  return (
    <>
      <div className="card bg-base-300 w-96 shadow-sm">
        <figure>
          <img src={photoUrl} alt="user photo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {firstName} {lastName}
          </h2>
          <div>
            {(age || gender) && (
              <p>
                {age}, {gender}
              </p>
            )}
          </div>
          <p>{about}</p>
          {/* <p>{skills.split(", ").map((skill) => skill)}</p> */}
          <div className="card-actions  justify-center">
            <button
              className="btn bg-red-500"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Ignore
            </button>
            <button
              className="btn bg-green-500"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
      <div>
        {showToast && (
          <div className="toast toast-top toast-end">
            <div className="alert alert-info">
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserCard;
