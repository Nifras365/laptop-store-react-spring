import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import './css/Profile.css';

const Profile = () => {

    const[userDetails, setUserDetails] = useState(null);

    useEffect(()=>{
        const userID = localStorage.getItem('userID');

        async function getUserDetails() {
            try {
                const response = await axios.get(`http://localhost:8080/users/userdetails/${userID}`);

                const userData = response.data.data[0];
                setUserDetails(userData);

            } catch (error) {
                console.error("Error fetching details", error);
            }
        }
        getUserDetails();
    },[])

    return (
        <div className="profile-container">
          {userDetails ? (
            <div className="profile-card">
              <h1>Hi, {userDetails.name}</h1>
                <div className="profile-field">
                    <label>Name:</label>
                    <input value={userDetails.name} readOnly />
                </div>
                <div className="profile-field">
                    <label>Email:</label>
                    <input value={userDetails.email} readOnly />
                </div>
                <div className="profile-field">
                    <label>Country:</label>
                    <input value={userDetails.country} readOnly />
                </div>
                <div className="profile-field">
                    <label>Address:</label>
                    <input value={userDetails.address} readOnly />
                </div>
                <div className="profile-field">
                    <label>Phone:</label>
                    <input value={userDetails.phone} readOnly />
                </div>
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>
      );
}

export default Profile;