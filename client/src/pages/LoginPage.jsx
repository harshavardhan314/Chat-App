import React, { useState } from "react";
import assets from "../assets/assets";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    // Step-1 of signup → move to bio
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    console.log({ fullName, email, password, bio });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-6 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <div>
        <img src={assets.logo_big} alt="App logo" className="w-[min(30vw,250px)]" />
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              src={assets.arrow_icon}
              alt="arrow"
              onClick={() => setIsDataSubmitted(false)}
              className="w-5 cursor-pointer focus:outline-none"
            />
          )}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="Full Name"
            required
            className="p-2 border border-gray-500 rounded-md   focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            required
            placeholder="Provide a short bio..."
            className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 rounded-md hover:opacity-90"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" required={currState === "Sign up"} />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="text-sm text-gray-600">
          {currState === "Sign up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className="text-violet-500 cursor-pointer font-medium"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an account{" "}
              <span
                onClick={() => setCurrState("Sign up")}
                className="text-violet-500 cursor-pointer font-medium"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
