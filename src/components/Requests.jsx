import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeUserRequest } from "../utils/requestsSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [showToast, setShowToast] = useState(false);
  const [showToastStatus, setShowToastStatus] = useState();

  const fetchRequests = async () => {
    const res = await axios.get(BASE_URL + "/user/requests/reveieved", {
      withCredentials: true,
    });
    console.log("fetchRequests: ", res);
    dispatch(addRequests(res?.data?.data));
  };

  const handleReviewRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${userId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserRequest(userId));
      setShowToast(true);
      setShowToastStatus(status);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center pt-10">
        <h3>No Request Found!</h3>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <h3 className="py-4 text-2xl">Requests</h3>
        <div className="flex flex-col items-center gap-4">
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              request.fromUserId;
            return (
              <div key={request._id} className="flex justify-between ">
                <div className="flex justify-between  items-center bg-base-300 w-[50rem] p-4 rounded-2xl ">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <img
                        src={photoUrl}
                        alt="request img"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <h3>
                        {firstName} {lastName}
                      </h3>
                      {age && gender && (
                        <p>
                          {age}, {gender}
                        </p>
                      )}
                      <p>{about}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-red-500 text-white py-1 px-4 rounded-2xl"
                      onClick={() => handleReviewRequest("rejected", _id)}
                    >
                      Reject
                    </button>
                    <button
                      className="bg-green-500 text-white py-1 px-4 rounded-2xl"
                      onClick={() => handleReviewRequest("accepted", _id)}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        {showToast && (
          <div className="toast toast-top toast-end">
            <div className="alert alert-info">
              <span>Request {showToastStatus}!</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Requests;
