import React, { useEffect} from 'react';
import { Logo } from '../assets';
import {Footer} from '../containers';
import {AuthButtonWithProvider, MainSpinner} from '../components';
import useUser from '../hooks/useUser';

import {FaGoogle, FaGithub} from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';



const Authentication = () => {

  
  const navigate = useNavigate();
  const {data, isLoading} = useUser();

  useEffect(()=>{
    if(!isLoading && data){
      navigate("/", {return: true});
      console.log("Logged in");
    }
  }, [data, isLoading]);

  if(isLoading){
    return <MainSpinner/>
  }

  return (
    < div className="auth-section">
      {/* top section */ }
      < img className="w-12 h-auto object-contain" src={Logo} alt=""/>

      {/* main section */}
      <div className="w-full flex flex-1 flex-col items-center justify-center gap-6 bg-gray-200 rounded-md" >
        <h1 className="text-2xl lg:text-3xl text-blue-600 ">Welcome to CV-Experts</h1>  
        <p className="text-base text-gray-600">Automatic way to create resumes</p>
        <h2 className="text-lg text-gray-600 font-medium">Authenticate</h2>

        <div className="w-full lg:w-96 rounded-md  p-2 flex flex-col items-center 
        justify-start gap-6">

          <AuthButtonWithProvider 
            Icon={FaGoogle} 
            label="Sign in with Google" 
            provider="GoogleAuthProvider"
          />

          <AuthButtonWithProvider 
            Icon={FaGithub} 
            label="Sign in with Github" 
            provider="GithubAuthProvider"
          />

        </div>
      </div>

      {/* footer section */}
      <Footer/>

    </div>
  );
}

export default Authentication;
