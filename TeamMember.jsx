import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const cardGradients = [
  'from-purple-200 via-purple-100 to-white',
  'from-pink-200 via-pink-100 to-white',
  'from-indigo-200 via-indigo-100 to-white',
  'from-fuchsia-200 via-fuchsia-100 to-white',
];

const TeamMember = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  // Validate and fetch user
  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get('id');
    if (!userId) return navigate('/');

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/auth/me?id=${userId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.id !== userId) throw new Error("Unauthorized");
        setUser({ ...data, id: userId });
      } catch {
        alert("Unauthorized access.");
        navigate('/');
      }
    };

    fetchUser();
  }, []);

  const fetchTasks = async (userId) => {
    const res = await fetch(`http://127.0.0.1:8000/tasks/dashboard/team_member/${userId}`);
    const data = await res.json();
    const assigned = data.filter(task => task.status !== 'completed');
    const completed = data.filter(task => task.status === 'completed');

    setAssignedTasks(assigned.map(t => ({ ...t, progress: t.progress || 0 })));
    setCompletedTasks(completed.map(t => ({ ...t, progress: 100 })));
  };

  useEffect(() => {
    if (user) fetchTasks(user.id);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const socket = new WebSocket("ws://127.0.0.1:8000/ws");

    socket.onopen = () => {
      socket.send(JSON.stringify({ id: user.id, role: user.role }));
    };

    socket.onmessage = () => fetchTasks(user.id);
    return () => socket.close();
  }, [user]);

  const handleProgressChange = async (id, newProgress) => {
    setAssignedTasks(prev =>
      prev.map(task =>
        task._id === id ? { ...task, progress: newProgress } : task
      )
    );

    await fetch('http://127.0.0.1:8000/tasks/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: id, progress: newProgress })
    });
  };

  const renderSection = (title, data, isCompleted, sectionGradient) => (
    <div className={`px-6 py-8 rounded-2xl shadow-inner bg-gradient-to-r ${sectionGradient} mb-10`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-5">{title}</h2>
      {data.length === 0 ? (
        <p className="text-gray-600 italic">No {title.toLowerCase()}.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {data.map((task, index) => (
            <div
              key={task._id}
              className={`p-6 rounded-2xl shadow-md border border-gray-300 bg-gradient-to-br ${cardGradients[index % cardGradients.length]} transition-all hover:scale-[1.02]`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
              <p className="text-sm text-gray-700 italic mb-3">{task.description}</p>

              {!isCompleted ? (
                <>
                  <div className="w-full bg-gray-300/60 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{task.progress}% Completed</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={(e) => handleProgressChange(task._id, parseInt(e.target.value))}
                    className="w-full mt-3 accent-purple-600 cursor-pointer"
                  />
                </>
              ) : (
                <p className="mt-2 text-sm text-green-800 font-medium italic">Completed</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!user) return <div className="p-10 text-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-100 text-gray-900 pb-20">
      <Navbar name={user.username} role={user.role} />
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-12">
        {renderSection('Assigned Tasks', assignedTasks, false, 'from-purple-100 via-white to-fuchsia-100')}
        {renderSection('Completed Tasks', completedTasks, true, 'from-green-100 via-white to-green-50')}
      </div>
    </div>
  );
};

export default TeamMember;


// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';

// const cardGradients = [
//   'from-purple-200 via-purple-100 to-white',
//   'from-pink-200 via-pink-100 to-white',
//   'from-indigo-200 via-indigo-100 to-white',
//   'from-fuchsia-200 via-fuchsia-100 to-white',
// ];

// const TeamMember = () => {
//   const [assignedTasks, setAssignedTasks] = useState([]);
//   const [completedTasks, setCompletedTasks] = useState([]);
//   const userId = localStorage.getItem("user_id");

//   // 🔄 Fetch real assigned tasks
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const res = await fetch(`http://127.0.0.1:8000/tasks/dashboard/team_member/${userId}`);
//         const data = await res.json();

//         const assigned = data.filter(task => task.status !== 'completed');
//         const completed = data.filter(task => task.status === 'completed');

//         const mappedAssigned = assigned.map(task => ({
//           id: task._id,
//           title: task.title,
//           progress: task.progress || 0
//         }));

//         const mappedCompleted = completed.map(task => ({
//           id: task._id,
//           title: task.title,
//           progress: 100
//         }));

//         setAssignedTasks(mappedAssigned);
//         setCompletedTasks(mappedCompleted);
//       } catch (err) {
//         console.error("❌ Failed to fetch tasks:", err);
//       }
//     };

//     fetchTasks();
//   }, []);

//   // ✅ Update both local and DB progress
//   const handleProgressChange = async (id, newProgress) => {
//     setAssignedTasks(prev =>
//       prev.map(task =>
//         task.id === id ? { ...task, progress: newProgress } : task
//       )
//     );

//     try {
//       await fetch('http://127.0.0.1:8000/tasks/progress', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ task_id: id, progress: newProgress })
//       });
//     } catch (err) {
//       console.error("❌ Failed to update progress:", err);
//     }
//   };

//   const renderSection = (title, data, isCompleted, sectionGradient) => (
//     <div className={`px-6 py-8 rounded-2xl shadow-inner bg-gradient-to-r ${sectionGradient} mb-10`}>
//       <h2 className="text-2xl font-bold text-gray-800 mb-5">{title}</h2>
//       {data.length === 0 ? (
//         <p className="text-gray-600 italic">No {title.toLowerCase()}.</p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
//           {data.map((task, index) => (
//             <div
//               key={task.id}
//               className={`p-6 rounded-2xl shadow-md border border-gray-300 bg-gradient-to-br ${cardGradients[index % cardGradients.length]} transition-all hover:scale-[1.02]`}
//             >
//               <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
//               {!isCompleted && (
//                 <>
//                   <div className="mt-4">
//                     <div className="w-full bg-gray-300/60 rounded-full h-3 overflow-hidden">
//                       <div
//                         className="bg-purple-600 h-3 rounded-full transition-all duration-300"
//                         style={{ width: `${task.progress}%` }}
//                       />
//                     </div>
//                     <p className="text-sm text-gray-700 mt-1">{task.progress}% Completed</p>
//                     <input
//                       type="range"
//                       min="0"
//                       max="100"
//                       value={task.progress}
//                       onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
//                       className="w-full mt-3 accent-purple-600 cursor-pointer"
//                     />
//                   </div>
//                 </>
//               )}
//               {isCompleted && (
//                 <p className="mt-2 text-sm text-green-800 font-medium italic">Completed</p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-100 text-gray-900 pb-20">
//       <Navbar name={localStorage.getItem("username")} role={localStorage.getItem("role")} />

//       <div className="px-6 py-10 max-w-6xl mx-auto space-y-12">
//         {renderSection(
//           'Assigned Tasks',
//           assignedTasks,
//           false,
//           'from-purple-100 via-white to-fuchsia-100'
//         )}
//         {renderSection(
//           'Completed Tasks',
//           completedTasks,
//           true,
//           'from-green-100 via-white to-green-50'
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeamMember;
