import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionsSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const fetchConnections = async () => {
    if (connections && connections.length > 0) {
      return;
    }
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log("fetchConnections: ", res);
      dispatch(addConnection(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections || connections.length === 0) {
    return(
      <div className="text-center pt-10">
      <h3>No connection Found!</h3>
    </div>
    )
  }
  return (
    <div className="text-center">
      <h3 className="py-4 text-2xl">Connections</h3>
      <div className="flex flex-col items-center gap-4">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;
          return (
            <div
              key={_id}
              className="flex  items-center bg-base-300 w-[50rem] p-4 rounded-2xl gap-4"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <img
                  src={photoUrl}
                  alt="connection img"
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
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
