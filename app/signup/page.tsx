"use client";

import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "/login";
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 dark:from-gray-900 dark:to-black">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 space-y-6">

        <h1 className="text-xl font-semibold text-center dark:text-white">
          📝 Create Account
        </h1>

        <input
          placeholder="Name"
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Sign Up
        </button>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}