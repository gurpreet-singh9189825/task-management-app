import react, { useState } from "react";

import CreateUser from "../components/create-user/CreateUser";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from ".././components/navbar/Navbar";

const Root = () => {
  const location = useLocation();

  return (
    <>
      <div className="app">
        {location.pathname !== "/" && location.pathname !== "/register" && (
          <Navbar />
        )}

        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Root;
