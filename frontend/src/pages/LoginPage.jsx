import React, { useState } from "react";
import assets from "../assets/assets";
import { useAuthStore } from "../stores/authStore";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const { signup, isSigningUp, login, isLogingIn } = useAuthStore();
  const [currState, setCurrState] = useState("Signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isdataSubmited, setIsDataSubmited] = useState(false);

  const onsubmitHandler = async (e) => {
    e.preventDefault();

    if (currState === "Signup") {
      if (!isdataSubmited) {
        // First step - validate email/password and show bio field
        setIsDataSubmited(true);
        return;
      }

      // Second step - submit all data including bio
      const userData = {
        fullName,
        email,
        password,
        bio,
      };
      await signup(userData);
      return;
    }

    // Handle login case
    if (currState === "Login") {
      await login({ email, password });
    }
  };

  //this means it is false
  return (
    <div
      className="min-h-svh backdrop-blur-2xl bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly
    max-sm:flex-col 
    "
    >
      {/* left imaag */}
      <img src={assets.logo_big} alt="l" className="w-[min(30vw,250px)]" />
      {/* right login form and signup form */}
      <form
        onSubmit={onsubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6
      rounded-lg shadow-lg  "
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}

          {isdataSubmited && (
            <img
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
              onClick={() => setIsDataSubmited(false)}
            />
          )}
        </h2>
        {currState === "Signup" && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="name"
            placeholder="Full Name"
            required
            className="
         p-2 border border-gray-500 rounded-md focus:outline-none 
        "
          />
        )}
        {!isdataSubmited && (
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            required
            className="p-2 focus:outline-none border border-gray-500 rounded-md focus:ring-2 focus:ring-indigo-500              "
          />
        )}

        {!isdataSubmited && (
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            required
            className="p-2 focus:outline-none border border-gray-500 rounded-md  "
          />
        )}

        {currState === "Signup" && isdataSubmited && (
          //if true than only display the text area
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none
       focus:ring-indigo-500"
            placeholder="Provide a short bio.."
            required
          ></textarea>
        )}
        <button
          type="submit"
          disabled={isSigningUp || isLogingIn}
          className="py-3 flex items-center gap-2 justify-center bg-gradient-to-r from bg-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "Signup"
            ? isdataSubmited
              ? "Complete Signup"
              : "Continue"
            : "Login"}
          {(isSigningUp || isLogingIn) && <Loader2 className="animate-spin" />}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500 ">
          <input type="checkbox" required />
          <p>Agree to terms use privicy & policy.</p>
        </div>

        <div className="flex  gap-2">
          {currState === "Signup" ? (
            <>
              <p>Already have an Account</p>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setCurrState("Login")}
              >
                Login
              </span>
            </>
          ) : (
            <>
              <p>Don't have an account</p>
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setCurrState("Signup")}
              >
                Signup
              </span>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
