import React from "react";
import "./Common.css";
import { Link } from "react-router-dom";


const LoginSuccessful = () => {
  return (
    <>
      <h5 className ="lgsucc" > Login Sucessfull</h5>
      <div className ="lgsucc" >
        <h5> Welcome {localStorage.getItem("UserEmail")} !!!</h5>
        </div>
        <h5 className ="lgsucc" >
        <Link to="/Home">Click to Return Home page</Link>{" "}
      </h5>
    </>
  );
};

export default LoginSuccessful;
