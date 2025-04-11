// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '../components/Button';
// import '../styles/animations.css'; // Custom animation file (optional)

// const Login = () => {
//   const navigate = useNavigate();

//   const handleRegister = () => {
//     navigate('/register');
//   };

//   return (
//     <div className="h-screen w-full flex flex-col md:flex-row">
//       {/* Left Section */}
//       <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 p-10 text-center md:text-left transition-all duration-700 ease-in-out animate-fadeIn">
//         <div className="transition-transform duration-700 hover:scale-105">
//           <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight animate-slideDown">
//             Welcome back!
//           </h1>
//           <p className="text-lg md:text-xl text-gray-700 max-w-md animate-fadeIn delay-300">
//             Log in to your account and take control of your tasks with style and simplicity.
//           </p>
//         </div>
//       </div>

//       {/* Right Section - Full height login form */}
//       <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-tr from-white via-blue-50 to-purple-100 px-10 py-14 animate-slideLeft">
//         <div className="w-full max-w-md flex flex-col gap-6 transition-opacity duration-700 delay-300 ease-in-out animate-fadeInUp">
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 text-center md:text-left">
//             Login
//           </h2>

//           <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
//             <label htmlFor="email" className="text-md font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               id="email"
//               placeholder="you@example.com"
//               className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-600 shadow-sm transition duration-300"
//             />
//           </div>

//           <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
//             <label htmlFor="password" className="text-md font-medium text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               id="password"
//               placeholder="••••••••"
//               className="p-3 rounded-lg bg-gradient-to-r from-pink-100 to-white border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder:text-gray-600 shadow-sm transition duration-300"
//             />
//           </div>

//           <div className="flex justify-between items-center text-sm text-gray-600 transition-opacity duration-500 delay-200">
//             <span>Don't have an account?</span>
//             <span
//               className="text-blue-700 font-medium cursor-pointer hover:underline"
//               onClick={handleRegister}
//             >
//               Register
//             </span>
//           </div>

//           <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 text-white py-3 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
//             Login
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import '../styles/animations.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (res.ok && result.user) {
        const { id, role } = result.user;

        // ✅ Navigate based on role, with ID in query param
        switch (role) {
          case "client":
            navigate(`/client?id=${id}`);
            break;
          case "manager":
          case "admin":
            navigate(`/manager?id=${id}`);
            break;
          case "team_lead":
            navigate(`/teamlead?id=${id}`);
            break;
          case "team_member":
            navigate(`/teammember?id=${id}`);
            break;
          default:
            alert("Unknown role");
        }
      } else {
        alert(result.detail || "Login failed");
      }

    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 p-10 text-center md:text-left transition-all duration-700 ease-in-out animate-fadeIn">
        <div className="transition-transform duration-700 hover:scale-105">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight animate-slideDown">
            Welcome back!
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-md animate-fadeIn delay-300">
            Log in to your account and take control of your tasks with style and simplicity.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-tr from-white via-blue-50 to-purple-100 px-10 py-14 animate-slideLeft">
        <div className="w-full max-w-md flex flex-col gap-6 transition-opacity duration-700 delay-300 ease-in-out animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 text-center md:text-left">
            Login
          </h2>

          {/* Email */}
          <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
            <label htmlFor="email" className="text-md font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-600 shadow-sm transition duration-300"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
            <label htmlFor="password" className="text-md font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="p-3 rounded-lg bg-gradient-to-r from-pink-100 to-white border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder:text-gray-600 shadow-sm transition duration-300"
            />
          </div>

          {/* Register Redirect */}
          <div className="flex justify-between items-center text-sm text-gray-600 transition-opacity duration-500 delay-200">
            <span>Don't have an account?</span>
            <span
              className="text-blue-700 font-medium cursor-pointer hover:underline"
              onClick={handleRegister}
            >
              Register
            </span>
          </div>

          {/* Login Button */}
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 text-white py-3 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;

