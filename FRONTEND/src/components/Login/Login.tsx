import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signInWithGoogle } from "../../auth/auth";
import { FaGoogle } from "react-icons/fa";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // Firebase Sign In
      const userCredential = await signIn(email, password);
      console.log(userCredential.user);

      nav("/home");
    } catch (e: any) {
      setErrorMsg("Failed to sign in. Please check your email and password.");
      console.error("Error signing in:", e.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Sign in with Google
      const result = await signInWithGoogle();
      const user = result.user;
      console.log(user);
      
      nav("/home");
    } catch (e: any) {
      setErrorMsg("Failed to sign in with Google.");
      console.error("Error signing in with Google:", e.message);
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleEmailChange = handleInputChange(setEmail);
  const handlePasswordChange = handleInputChange(setPassword);
  return (
    <>
      <div className="flex items-start justify-between rounded-t border-b p-5">
        <h3 className="text-xl font-semibold text-gray-900">Sign In</h3>
      </div>

      <div className="space-y-6 p-6">
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <div className="col-span-1">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email..."
              required
              onChange={handleEmailChange}
              autoComplete="off"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-secondary-600 focus:ring-secondary-600 sm:text-sm"
            />
          </div>

          <div className="col-span-1">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              onChange={handlePasswordChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-secondary-600 focus:ring-secondary-600 sm:text-sm"
            />
          </div>

          <div className="col-span-1">
            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-secondary-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-secondary-700 focus:ring-4 focus:ring-secondary-200 cursor-pointer"
            >
              Sign In
            </button>
            <p className="col-span-1 mt-2 block text-sm font-medium text-center text-red-700">
              {errorMsg}
            </p>
          </div>
        </form>

        {/* Google Sign-In Button */}
        <div className="col-span-1">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-5 w-full flex items-center justify-center rounded-lg bg-secondary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-secondary-900 focus:ring-4 focus:ring-secondary-200 cursor-pointer"
          >
            <FaGoogle className="mr-2" /> Sign In with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
