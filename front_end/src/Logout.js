import React from "react";

const Logout = () => {
  if (localStorage.getItem("UserEmail") !== "" ) {
    localStorage.removeItem("UserEmail");
  }

  if (localStorage.getItem("UserName") !== "" ) {
    localStorage.removeItem("UserName");
  }
  return (
    <div>
      <p className="logout"> Have  been logout !</p>
    </div>
  );
};

export default Logout;
