import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../config/firebase.config";

const AuthButtonWithProvider = ({ Icon, label, provider }) => {
  const handleClick = async () => {
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    switch (provider) {
      case "GithubAuthProvider":
        await signInWithRedirect(auth, githubProvider)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(`Error: ${err.message}`);
          });
        break;
      default:
        await signInWithRedirect(auth, googleProvider)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(`Error: ${err.message}`);
          });
        break;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full px-4 py-2 rounded-md border-2
     border-blue-600 flex items-center justify-between cursor-pointer group
     hover:bg-blue-600 active:scale-95 duration-150 hover:shadow-md"
    >
      <Icon className="text-txtPrimary text-xl group-hover:text-white" />
      <p className="text-txtPrimary text-lg group-hover:text-white">{label}</p>
      <FaChevronRight className="text-txtPrimary text-base group-hover:text-white" />
    </div>
  );
};

export default AuthButtonWithProvider;
