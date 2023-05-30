import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true); //setting the loading state to true
  const [user, setUser] = useState(null); //setting the user state to null
  const history = useHistory(); //using the useHistory hook to redirect the user to the login page if the user is not logged in

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user); //setting the user state to the user
      setLoading(false); //setting the loading state to false
      if (user) history.push("/chats"); //if the user is logged in, then redirect the user to the chats page
    });
  }, [user, history]); //running this hook whenever the user or history changes

  const value = { user }; //creating a value object with the user

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
