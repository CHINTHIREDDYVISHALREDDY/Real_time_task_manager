// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/animations.css';

// const Register = () => {
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     navigate('/');
//   };

//   return (
//     <div className="h-screen w-full flex flex-col md:flex-row">
//       {/* Left Section */}
//       <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 p-10 text-center md:text-left transition-all duration-700 ease-in-out animate-fadeIn">
//         <div className="transition-transform duration-700 hover:scale-105">
//           <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight animate-slideDown">
//             Join the Team!
//           </h1>
//           <p className="text-lg md:text-xl text-gray-700 max-w-md animate-fadeIn delay-300">
//             Register now to collaborate, manage, and contribute effectively in your role.
//           </p>
//         </div>
//       </div>

//       {/* Right Section - Full height register form */}
//       <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-tr from-white via-blue-50 to-purple-100 px-10 py-14 animate-slideLeft">
//         <form className="w-full max-w-md flex flex-col gap-6 transition-opacity duration-700 delay-300 ease-in-out animate-fadeInUp">
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 text-center md:text-left">
//             Register
//           </h2>

//           {/* Username */}
//           <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
//             <label htmlFor="username" className="text-md font-medium text-gray-700 mb-1">Username</label>
//             <input
//               type="text"
//               id="username"
//               placeholder="JohnDoe"
//               className="p-3 rounded-xl bg-gradient-to-r from-blue-200 via-purple-100 to-pink-100 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner placeholder:text-gray-600 transition duration-300"
//             />
//           </div>

//           {/* Email */}
//           <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
//             <label htmlFor="email" className="text-md font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               id="email"
//               placeholder="you@example.com"
//               className="p-3 rounded-xl bg-gradient-to-r from-blue-200 via-purple-100 to-pink-100 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner placeholder:text-gray-600 transition duration-300"
//             />
//           </div>

//           {/* Password */}
//           <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
//             <label htmlFor="password" className="text-md font-medium text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               id="password"
//               placeholder="********"
//               className="p-3 rounded-xl bg-gradient-to-r from-blue-200 via-purple-100 to-pink-100 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner placeholder:text-gray-600 transition duration-300"
//             />
//           </div>

//           {/* Role */}
//           <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
//             <label htmlFor="role" className="text-md font-medium text-gray-700 mb-1">Role</label>
//             <select
//               id="role"
//               className="p-3 rounded-xl bg-gradient-to-r from-blue-200 via-purple-100 to-pink-100 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner text-gray-700 transition duration-300"
//             >
//               <option value="client">Client</option>
//               <option value="manager">Manager</option>
//               <option value="team-lead">Team Lead</option>
//               <option value="team-member">Team Member</option>
//             </select>
//           </div>

//           {/* Already have account */}
//           <div className="flex justify-between text-sm mt-1 text-gray-600">
//             <p>Already have an account?</p>
//             <p
//               className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800 transition"
//               onClick={handleLogin}
//             >
//               Login
//             </p>
//           </div>

//           {/* Register Button */}
//           <button
//             type="submit"
//             className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-md hover:brightness-110 transition-transform hover:scale-105"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/animations.css';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
  });

  const handleLogin = () => {
    navigate('/');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Registered successfully! Please login.');
        navigate('/');
      } else {
        alert(`❌ Registration failed: ${data.detail || data.error}`);
      }
    } catch (err) {
      console.error('❌ Error during registration:', err);
      alert('❌ Something went wrong. Try again.');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 p-10 text-center md:text-left transition-all duration-700 ease-in-out animate-fadeIn">
        <div className="transition-transform duration-700 hover:scale-105">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight animate-slideDown">
            Join the Team!
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-md animate-fadeIn delay-300">
            Register now to collaborate, manage, and contribute effectively in your role.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-tr from-white via-blue-50 to-purple-100 px-10 py-14 animate-slideLeft">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col gap-6 transition-opacity duration-700 delay-300 ease-in-out animate-fadeInUp"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 text-center md:text-left">
            Register
          </h2>

          {/* Username */}
          <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
            <label htmlFor="username" className="text-md font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={form.username}
              onChange={handleChange}
              placeholder="JohnDoe"
              className="p-3 rounded-xl bg-gradient-to-r from-blue-200 via-purple-100 to-pink-100 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner placeholder:text-gray-600 transition duration-300"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
            <label htmlFor="email" className="text-md font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="p-3 rounded-xl bg-gradient-to-r from-blue-200 via-purple-100 to-pink-100 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner placeholder:text-gray-600 transition duration-300"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
            <label htmlFor="password" className="text-md font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="p-3 rounded-xl bg-gradient-to-r from-blue-200 via-purple-100 to-pink-100 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner placeholder:text-gray-600 transition duration-300"
              required
            />
          </div>

          {/* Role */}
          <div className="flex flex-col transition-transform duration-300 hover:scale-[1.02]">
            <label htmlFor="role" className="text-md font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              value={form.role}
              onChange={handleChange}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-200 via-purple-100 to-pink-100 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner text-gray-700 transition duration-300"
              required
            >
              <option value="client">Client</option>
              <option value="manager">Manager</option>
              <option value="team_lead">Team Lead</option>
              <option value="team_member">Team Member</option>
            </select>
          </div>

          {/* Login Redirect */}
          <div className="flex justify-between text-sm mt-1 text-gray-600">
            <p>Already have an account?</p>
            <p
              className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800 transition"
              onClick={handleLogin}
            >
              Login
            </p>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-md hover:brightness-110 transition-transform hover:scale-105"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
