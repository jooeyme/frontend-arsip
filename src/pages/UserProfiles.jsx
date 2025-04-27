import React, {useState, useEffect} from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import { jwtDecode } from "jwt-decode";

export default function UserProfiles() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
      const token = localStorage.getItem("token");
  
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserData(decodedToken);
          console.log("apa isi token:", decodedToken);
          
        } catch (error) {
          console.error("Invalid token", error);
        }
      } else {
        console.log("no token")
      }
  
    },[]);
  return (
    <>
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard userData={userData}/>
          <UserInfoCard userData={userData}/>
          {/* <UserAddressCard /> */}
        </div>
      </div>
    </>
  );
}
