import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";

const Profile = () => {

    const[userDetails, setUserDetails] = useState(null);

    useEffect(()=>{
        const userID = localStorage.getItem('userID');

        async function getUserDetails() {
            try {
                const response = await axios.get(`http://localhost:8080/users/userdetails/${userID}`);

                console.log("Here is the data: ",response.data.data[0]);

                const userData = response.data.data[0];
                setUserDetails(userData);

            } catch (error) {
                console.error("Error fetching details", error);
            }
        }
        getUserDetails();
    },[])

    return(
        <div>
            <h1>Hi, User</h1>
            {userDetails ? (
                <div>
                    <p><strong>Name:</strong> {userDetails.name}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Country:</strong> {userDetails.country}</p>
                    <p><strong>Address:</strong> {userDetails.address}</p>
                    <p><strong>Phone:</strong> {userDetails.phone}</p>
                </div>
            ) : (
                <p>Loading user details...</p>
            )}
        </div>
    );
}

export default Profile;