import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import "./index.css";

const Profile = () => {
  const [signedUsername, setSignedUsername] = useState("");
  const jwtToken1 = Cookies.get("jwtToken");

  // 1. Wrapped in useCallback with dependencies included correctly
  const getProfileDetails = useCallback(async () => {
    try {
      const profileResponse = await fetch(
        "https://taskmanager-backend-project.onrender.com/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken1}`,
          },
        }
      );

      if (profileResponse.ok) {
        const data = await profileResponse.json();
        // Fallback to a default string if username isn't available
        setSignedUsername(data.username || "User");
      }
    } catch (error) {
      console.error("Failed to fetch profile details:", error);
    }
  }, [jwtToken1]);  

  // 2. Safe execution on component mount and function stabilization
  useEffect(() => {
    getProfileDetails();
  }, [getProfileDetails]);

  return (
    <div className="profile-container-100">
      <p className="username-signed-100">
        Hey! <span className="highlighted-name">{signedUsername}</span> Welcome
      </p>
    </div>
  );
};

export default Profile;