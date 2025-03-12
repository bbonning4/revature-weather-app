import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import PasswordStrengthMeter from "../PasswordStrengthMeter/PasswordStrengthMeter";
import { signUp } from "../../auth/auth";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password1 !== password2) {
      return setPasswordsMatch(false);
    } else {
      try {
        await signUp(email, password1);
        nav("/home");
      } catch (e: any) {
        setErrorMsg("Error registering, email most likely taken.");
        console.error("Error registering: ", e);
      }
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleEmailChange = handleInputChange(setEmail);
  const handlePassword1Change = handleInputChange(setPassword1);
  const handlePassword2Change = handleInputChange(setPassword2);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className="flex items-start justify-between rounded-t border-b p-5">
        <h3 className="text-xl font-semibold text-gray-900">Sign Up</h3>
      </div>

      <div className="space-y-6 p-6">
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="col-span-2">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@email.com"
              required
              onChange={handleEmailChange}
              autoComplete="off"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-secondary-600 focus:ring-secondary-600 sm:text-sm"
            />
          </div>

          <div className="relative col-span-2">
            <label
              htmlFor="password1"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              id="password1"
              type={passwordVisible ? "text" : "password"}
              minLength={6}
              required
              onChange={handlePassword1Change}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-gray-900 shadow-sm focus:border-secondary-600 focus:ring-secondary-600 sm:text-sm"
            />
            <div
              className="absolute inset-y-0 bottom-3.5 right-3 flex cursor-pointer items-center"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <PasswordStrengthMeter password={password1} />
          </div>

          <div className="col-span-2 -mt-4">
            <label
              htmlFor="password2"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <input
              id="password2"
              type="password"
              required
              onChange={handlePassword2Change}
              className={`block w-full rounded-lg border p-2.5 text-gray-900 shadow-sm focus:border-secondary-600 focus:ring-secondary-600 sm:text-sm ${
                passwordsMatch
                  ? "border-gray-300 bg-gray-50"
                  : "border-red-500 bg-red-50"
              }`}
            />
            {!passwordsMatch && (
              <p className="text-red-500">Passwords must match.</p>
            )}
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-secondary-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-secondary-700 focus:ring-4 focus:ring-secondary-200 cursor-pointer"
            >
              Sign Up
            </button>
          </div>
          <p className="col-span-2 block text-sm font-medium text-center text-red-700">
            {errorMsg}
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
