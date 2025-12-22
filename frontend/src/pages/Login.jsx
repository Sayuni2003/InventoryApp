import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in successfully!", {
        position: "top-center",
      });
      navigate("/redirect");
    } catch (error) {
      let message = "Login failed. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password.";
          break;
        case "auth/invalid-email":
          message = "Invalid email address.";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Please wait and try again.";
          break;
        default:
          message = "Invalid email or password.";
      }

      toast.error(message, {
        position: "top-center",
      });
    }
  };

  const fillDemoAccount = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700 w-full max-w-md">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Don't have an account yet?{" "}
              <Link
                className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                to="/register"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
              Or
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-2.5 px-4 block w-full rounded-lg sm:text-sm
           border border-white/70
           bg-neutral-900 text-neutral-200
           placeholder:text-neutral-500
           focus:border-blue-600 focus:ring-blue-600
           focus:outline-none"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-2.5 px-4 block w-full rounded-lg sm:text-sm
             border border-white/70
             focus:border-blue-600 focus:ring-blue-600
             focus:outline-none
             dark:bg-neutral-900 dark:text-neutral-400"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden"
                >
                  Sign in
                </button>
              </div>
            </form>
            {/* END FORM */}
            {/* DEMO ACCOUNTS */}
            <div className="mt-6 rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-sm font-medium text-blue-400 mb-3">
                Demo Accounts (For Reviewers)
              </p>

              <div className="space-y-3 text-sm text-neutral-300">
                <div className="border-t border-neutral-700 pt-3 flex items-center justify-between">
                  {/* User 2 */}
                  <div>
                    <p className="font-medium text-neutral-200">User</p>
                    <p className="text-neutral-400 text-xs">sara2@gmail.com</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fillDemoAccount("sara2@gmail.com", "123456")}
                    className="px-3 py-1.5 text-xs font-medium rounded-md
                   bg-blue-600/20 text-blue-400
                   hover:bg-blue-600/30 transition"
                  >
                    Use
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
