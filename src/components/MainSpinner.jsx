import React from 'react';
import { PuffLoader } from 'react-spinners';
import  '../index.css';

const MainSpinner = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <PuffLoader color="blue" size={80}/>
    </div>
  )
}

export default MainSpinner;
