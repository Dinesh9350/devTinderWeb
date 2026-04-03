import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const feedData = useSelector((store) => store.feed);

  const fetchFeed = async () => {
    // if (feedData && feedData.length > 0) return;

    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });

      console.log("fetchFeed: ", res.data);
      dispatch(addFeed(res.data));
    } catch (error) {
      if (error.status === 401) {
        navigate("/login");
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (!feedData || feedData.length === 0) {
    return (
      <div className="pt-10 text-center">
        <h3>No User Found!</h3>
      </div>
    );
  }

  return (
    feedData && (
      <div className="flex flex-col items-center pt-10">
        <UserCard user={feedData[0]} />
        {/* {feedData?.map((user) => {
          return <UserCard user={user} />;
        })} */}
      </div>
    )
  );
};

export default Feed;
