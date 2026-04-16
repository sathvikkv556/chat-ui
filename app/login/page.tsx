"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    if (session) {
      window.location.href = "/chat";
    }
  }, [session]);

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "/chat";
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 dark:from-gray-900 dark:to-black">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 space-y-6">

        {/* TITLE */}
        <div className="text-center">
          <h1 className="text-xl font-semibold dark:text-white">
            🔐 Welcome Back
          </h1>
          <p className="text-sm text-gray-500">
            Login to continue
          </p>
        </div>

        {/* EMAIL LOGIN */}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </div>

        {/* DIVIDER */}
        <div className="text-center text-xs text-gray-400">
          OR
        </div>

        {/* GOOGLE */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/chat" })}
          className="w-full border py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          🔵 Continue with Google
        </button>

        {/* GITHUB */}
        <button
          onClick={() => signIn("github", { callbackUrl: "/chat" })}
          className="w-full border py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          🐙 Continue with GitHub
        </button>

        {/* SIGNUP */}
        <p className="text-center text-xs text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}