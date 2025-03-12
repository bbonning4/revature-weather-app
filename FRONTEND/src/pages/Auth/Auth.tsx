import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Login from "../../components/Login/Login";
import Register from "../../components/Register/Register";

const Auth: React.FC = () => {
  const [register, setRegister] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (currentPath === "/login") {
      setRegister(false);
    } else {
      setRegister(true);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <div className="relative m-10 mx-auto max-w-lg rounded-lg border border-4 bg-white shadow">
        {register ? (
          <div>
            <Register />
            <div className="mt-4 flex justify-center">
              <p className="mb-2 text-center">
                Already have an account?
                <span
                  className="cursor-pointer text-secondary-500"
                  onClick={() => setRegister(!register)}
                >
                  {" "}
                  <u>Sign In</u>
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div>
            <Login />
            <div className="mt-4 flex justify-center">
              <p className="mb-2 text-center">
                Don't have an account?
                <span
                  className="cursor-pointer text-secondary-500"
                  onClick={() => setRegister(!register)}
                >
                  {" "}
                  <u>Sign Up</u>
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
