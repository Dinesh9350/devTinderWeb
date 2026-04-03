import React from "react";
import { useSelector } from "react-redux";
import ProfileEditCard from "./ProfileEditCard";
import UserCard from "./UserCard";

const Profile = () => {
  const userData = useSelector((store) => store.user);
  console.log(userData);

  return userData && <ProfileEditCard userData={userData} />;
};

export default Profile;
