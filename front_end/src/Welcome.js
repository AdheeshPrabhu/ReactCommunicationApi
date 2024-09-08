import React from "react";
import "./Common.css";
function Welcome() {
  return (
    <>
      <h2 className="textcenter welcome">Welcome to User Module</h2>
      <h3 className="textcenter">Existing Users</h3>
      <div className="textcenter">
        <a className="textcenter" href="./Login">
          Login
        </a>
      </div>

      <p className="textcenter"></p>
      <h2 className="textcenter">New User</h2>
      <div className="textcenter">
        <a href="./Register">Register</a>
      </div>
      <h3 className="textcenter">You have been logged out</h3>
    </>
  );
}
export default Welcome;
