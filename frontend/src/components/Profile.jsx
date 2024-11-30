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
            {userDetails ? (
                <div>
                  <h1>Hi, {userDetails.name}</h1>
                    <div>
                        <label>Name:</label>
                        <input value={userDetails.name}></input>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input value={userDetails.email}></input>
                    </div>
                    <div>
                        <label>Country:</label>
                        <input value={userDetails.country}></input>
                    </div>
                    <div>
                        <label>Address:</label>
                        <input value={userDetails.address}></input>
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input value={userDetails.phone}></input>
                    </div>
                </div>
            ) : (
                <p>Loading user details...</p>
            )}
        </div>
    );
}

export default Profile;