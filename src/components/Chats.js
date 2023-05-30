import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { auth } from "../firebase";
import axios from "axios";

import { useAuth } from "../contexts/AuthContext";

const Chats = () => {
  //this component is used to render the chat engine
  const history = useHistory(); //using the useHistory hook to redirect the user to the login page if the user is not logged in
  const { user } = useAuth(); //getting the user from the AuthContext
  const [loading, setLoading] = useState(true); //setting the loading state to true
  console.log(user);

  const handleLogout = async () => {
    //this function is used to log the user out
    await auth.signOut(); //signing out the user from firebase
    history.push("/"); //redirecting the user to the login page
  };

  const getFile = async (url) => {
    //this function is used to convert the url of the user's photo into a file
    const response = await fetch(url); //fetching the url of the user's photo
    const data = await response.blob(); //converting the url into a blob
    return new File([data], "userPhoto.jpg", { type: "image/jpeg" }); //converting the blob into a file
  };

  useEffect(() => {
    //using the useEffect hook to check if the user is already logged in
    if (!user) {
      history.push("/"); //if the user is not logged in, then redirect the user to the login page
      return; //returning to prevent the rest of the code from running
    }
    axios
      .get("https://api.chatengine.io/users/me/", {
        //using axios to get the user from chatengine.io
        headers: {
          "project-id": "1ac425b2-fa49-4f0e-9434-3931e888a2f4", //this is the project id from chatengine.io
          "user-name": user.email, //this is the email of the user
          "user-secret": user.uid, //this is the uid of the user
        },
      })
      .then(() => {
        setLoading(false); //if the user is already logged in, then we don't need to create a new user
      })
      .catch(() => {
        let formdata = new FormData(); //if the user is not logged in, then we need to create a new user
        formdata.append("email", user.email); //we are using the email and uid from firebase to create a new user
        formdata.append("username", user.email); //we are using the email and uid from firebase to create a new user
        formdata.append("secret", user.uid); //we are using the email and uid from firebase to create a new user
        getFile(user.photoURL).then((avatar) => {
          //we are using the photoURL from firebase to create a new user
          formdata.append("avatar", avatar, avatar.name); //we are using the photoURL from firebase to create a new user
          axios
            .post("https://api.chatengine.io/users/", formdata, {
              //this is the api endpoint from chatengine.io
              headers: {
                "private-key": "93149ade-11f8-472f-950f-54d45bfe9824", //this is the private key from chatengine.io
              },
            })
            .then(() => setLoading(false)) //if the user is created, then we don't need to create a new user
            .catch((error) => console.log(error)); //if the user is not created, then we need to create a new user
        });
      });
  }, [user, history]); //we are using the user and history from react-router-dom

  if (!user || loading) return "Loading...";

  return (
    <div className="chats-page">
      <div className="nav-bar">
        <div className="logo-tab">IsetChat</div>
        <div className="btn">
          <div className="logout-tab" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </div>
      <ChatEngine
        height="calc(100vh - 66px)" //this is the height of the chat engine
        projectID="1ac425b2-fa49-4f0e-9434-3931e888a2f4"
        userName={user.email} //we are using the email and uid from firebase to create a new user
        userSecret={user.uid} //we are using the email and uid from firebase to create a new user
      />
    </div>
  );
};
export default Chats;
