import React from "react";
import { Link } from "react-router-dom";
import "./Common.css";

function RegisterSuccess() {
  return (
    <>
      <h1 className="text-center">Registration Successful</h1>
      <h2 className="text-center">Thanks for your registration.</h2>
      <h3 className="text-center">
        <Link to="/Home">Click to Return Home page</Link>{" "}
      </h3>
    </>
  );
}

export default RegisterSuccess;
