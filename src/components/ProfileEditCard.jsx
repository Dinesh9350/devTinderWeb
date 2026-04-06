import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

const ProfileEditCard = ({ userData }) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(userData?.firstName);
  const [lastName, setLastName] = useState(userData?.lastName);
  const [photoUrl, setPhotoUrl] = useState(userData?.photoUrl);
  const [age, setAge] = useState(userData?.age);
  const [gender, setGender] = useState(userData?.gender);
  const [about, setAbout] = useState(userData?.about);
  const [error, setError] = useState();
  const [showToast, setShowToast] = useState(false);

  const handleProfileEdit = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        { withCredentials: true },
      );
      console.log("handleProfileEdit: ", res);
      dispatch(addUser(res.data.data));
      setError("");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.log(error.response);
      if (error.status === 400) {
        setError(error.response.data);
      }
    }
  };

  return (
    <>
      <div className="flex justify-center py-10 gap-10">
        <UserCard
          user={{ firstName, lastName, photoUrl, age, gender, about }}
        />

        <div className="card card-dash bg-base-300 w-96 ">
          <div className="card-body">
            <h2 className="card-title mx-auto">Edit Profile</h2>
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  className="input"
                  placeholder="Enter First Name"
                />
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  className="input"
                  placeholder="Enter Last Name"
                />
                <legend className="fieldset-legend">Photo Url</legend>
                <input
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  type="text"
                  className="input"
                  placeholder="Enter Photo Id"
                />
                <legend className="fieldset-legend">Age</legend>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  type="text"
                  className="input"
                  placeholder="Enter Age"
                />
                <legend className="fieldset-legend">Gender</legend>
                <input
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  type="text"
                  className="input"
                  placeholder="Enter Gender"
                />
                <legend className="fieldset-legend">About</legend>
                <input
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  type="text"
                  className="input"
                  placeholder="Enter About"
                />
              </fieldset>
            </div>
            {error && <p className="text-red-500">{error}</p>}

            <div className="card-actions justify-end mx-auto">
              <button className="btn btn-primary" onClick={handleProfileEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-info">
            <span>Profile Updated Successfully!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileEditCard;
