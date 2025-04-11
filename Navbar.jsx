// import React from 'react';

// const Navbar = ({ name, role }) => {
//   const getInitials = (name) => {
//     const names = name.split(' ');
//     const initials = names.map((n) => n[0].toUpperCase());
//     return initials.slice(0, 2).join('');
//   };

//   const UserAvatar = ({ name }) => (
//     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg">
//       {getInitials(name)}
//     </div>
//   );

//   return (
//     <div className="bg-gradient-to-r from-white via-blue-50 to-purple-100 shadow-lg py-4 px-6 sticky top-0 z-50 border-b border-blue-200 backdrop-blur-md">
//       <div className="flex justify-between items-center">
//         <div className="flex gap-3 items-center">
//           <img src="/vite.svg" alt="logo" className="w-7 h-7 drop-shadow" />
//           <p className="text-2xl font-semibold text-gray-800 tracking-tight">Project Panel</p>
//         </div>
//         <div className="flex gap-3 items-center">
//           <UserAvatar name={name} />
//           <div className="leading-tight">
//             <p className="text-lg font-semibold text-gray-800">{name}</p>
//             <p className="text-sm text-gray-600">{role}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;


import React from 'react';

const Navbar = ({ name = 'Guest', role = 'Unknown' }) => {
  const getInitials = (name) => {
    const names = name.trim().split(' ');
    const initials = names.map((n) => n[0]?.toUpperCase() || '');
    return initials.slice(0, 2).join('');
  };

  const UserAvatar = ({ name }) => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg">
      {getInitials(name)}
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-white via-blue-50 to-purple-100 shadow-lg py-4 px-6 sticky top-0 z-50 border-b border-blue-200 backdrop-blur-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex gap-3 items-center">
          <img src="/vite.svg" alt="logo" className="w-7 h-7 drop-shadow" />
          <p className="text-2xl font-semibold text-gray-800 tracking-tight">Project Panel</p>
        </div>

        {/* User Info */}
        <div className="flex gap-3 items-center">
          <UserAvatar name={name} />
          <div className="leading-tight">
            <p className="text-lg font-semibold text-gray-800">{name}</p>
            <p className="text-sm text-gray-600 capitalize">{role.replace("_", " ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
