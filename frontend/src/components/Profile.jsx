import axios from "axios";
import React from "react";
import { useEffect } from "react";

const Profile = () => {

    useEffect(()=>{
        const userID = localStorage.getItem('userID');

        async function getUserDetails() {
            try {
                const response = await axios.get(`http://localhost:8080/users/userdetails/${userID}`);

                console.log("Here is the data: ",response.data.data[0]);
            } catch (error) {
                console.error("Error fetching details", error);
            }
        }
        getUserDetails();
    },[])

    return(
        <div>
            Hi User
        </div>
    );
}

export default Profile;