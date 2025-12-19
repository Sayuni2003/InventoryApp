import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Create Firebase user
      const res = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 2️⃣ Get Firebase ID token
      const token = await res.user.getIdToken();

      // 3️⃣ 🔥 SEND USER DATA TO BACKEND (THIS IS STEP 1)
      await axiosInstance.post(
        "/api/auth/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User Registered Successfully!", {
        position: "top-center",
      });

      // 4️⃣ Redirect
      navigate("/login"); // or "/redirect"
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700 w-full max-w-md">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Register
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
              >
                Login
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    placeholder="Enter First Name"
                    onChange={handleChange}
                    className="py-2.5 px-4 block w-full rounded-lg sm:text-sm
           border border-white
           focus:border-blue-600 focus:ring-blue-600
           focus:outline-none
           dark:bg-neutral-900 dark:text-neutral-400
           bg-neutral-900 text-neutral-200"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    placeholder="Enter Last Name"
                    onChange={handleChange}
                    className="py-2.5 px-4 block w-full rounded-lg sm:text-sm
           border border-white
           focus:border-blue-600 focus:ring-blue-600
           focus:outline-none
           dark:bg-neutral-900 dark:text-neutral-400
           bg-neutral-900 text-neutral-200"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter email"
                    onChange={handleChange}
                    className="py-2.5 px-4 block w-full rounded-lg sm:text-sm
           border border-white
           focus:border-blue-600 focus:ring-blue-600
           focus:outline-none
           dark:bg-neutral-900 dark:text-neutral-400
           bg-neutral-900 text-neutral-200"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Enter Password"
                    onChange={handleChange}
                    className="py-2.5 px-4 block w-full rounded-lg sm:text-sm
           border border-white
           focus:border-blue-600 focus:ring-blue-600
           focus:outline-none
           dark:bg-neutral-900 dark:text-neutral-400
           bg-neutral-900 text-neutral-200"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2
                             text-sm font-medium rounded-lg
                             bg-blue-600 text-white hover:bg-blue-700
                             focus:outline-hidden"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
