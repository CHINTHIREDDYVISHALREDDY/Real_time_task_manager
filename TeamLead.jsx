import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TeamLead = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assignedTask, setAssignedTask] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [teamProgress, setTeamProgress] = useState(0);
  const [progressByMember, setProgressByMember] = useState({});

  // ✅ Validate and fetch user
  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get('id');
    if (!userId) return navigate('/');

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/auth/me?id=${userId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.id !== userId) throw new Error('Unauthorized');
        setUser({ ...data, id: userId });
      } catch {
        alert('Unauthorized access.');
        navigate('/');
      }
    };

    fetchUser();
  }, []);

  // ✅ Fetch assigned task
  const fetchAssignedTask = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/tasks/dashboard/team_lead/${user.id}`);
      const data = await res.json();
      console.log("📦 Tasks fetched by team lead:", data); // ADD THIS LINE

      const task = data.find((t) => ['accepted', 'in_progress'].includes(t.status));
      if (task) {
        setAssignedTask(task);
        const memberIds = task.team_members || [];
        setAssignedMembers(memberIds);
      }
    } catch (err) {
      console.error('❌ Failed to fetch task:', err);
    }
  };

  useEffect(() => {
    if (user) fetchAssignedTask();
  }, [user]);

  // ✅ WebSocket updates
  useEffect(() => {
    if (!user) return;
    const socket = new WebSocket('ws://127.0.0.1:8000/ws');

    socket.onopen = () => {
      socket.send(JSON.stringify({ id: user.id, role: user.role }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const doc = message.document;
      if (!doc || !doc._id) return;
    
      const updatedTaskId = doc._id?.$oid || doc._id;
    
      if (assignedTask && assignedTask.id === updatedTaskId) {
        setAssignedTask(prev => ({
          ...prev,
          title: doc.title,
          description: doc.description,
          status: doc.status,
          progress: doc.progress || 0,
          team_members: doc.team_members || [],
        }));
    
        // Optional: update member-level progress if needed
        if (doc.team_members?.length) {
          const newProgressMap = {};
          doc.team_members.forEach((id) => {
            newProgressMap[id] = doc.progress || 0;
          });
          setProgressByMember(newProgressMap);
        }
    
        setTeamProgress(doc.progress || 0); // 👈 Update the overall progress bar
      }
    };
    
    return () => socket.close();
  }, [user]);

  // ✅ Fetch team members
  useEffect(() => {
    fetch('http://127.0.0.1:8000/users/team-members')
      .then((res) => res.json())
      .then(setTeamMembers)
      .catch((err) => console.error('❌ Failed to fetch team members:', err));
  }, []);

  // ✅ Assign member
  const handleAssign = async (memberId) => {
    if (!assignedTask || assignedMembers.includes(memberId)) return;
  
    const updated = [...assignedMembers, memberId];
    setAssignedMembers(updated);
    setProgressByMember((prev) => ({ ...prev, [memberId]: 0 }));
  
    try {
      const res = await fetch('http://127.0.0.1:8000/tasks/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: assignedTask.id || assignedTask._id, // ✅ Make sure this is defined
          team_members: updated,                        // ✅ Ensure this is a non-empty array
          assigned_by: { id: user.id, role: user.role }, // ✅ Send an object
        }),
      });
  
      const result = await res.json();
      if (!res.ok) {
        console.error("❌ Assign failed:", result);
        alert(result.detail || "Assignment failed");
      } else {
        console.log("✅ Assigned successfully");
      }
    } catch (err) {
      console.error("❌ Assign error:", err);
      alert("Error assigning task");
    }
  };
  
  // ✅ Average team progress
  useEffect(() => {
    const values = Object.values(progressByMember);
    if (values.length > 0) {
      const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      setTeamProgress(avg);
    }
  }, [progressByMember]);

  if (!user) return <div className="p-10 text-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0faff] via-white to-[#e6f0ff] pb-16">
      <Navbar name={user.username} role={user.role} />

      <div className="px-8 mt-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Assigned Task</h2>

        {assignedTask ? (
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-xl font-semibold">{assignedTask.title}</h3>
            <p className="text-gray-700">{assignedTask.description}</p>

            <div className="mt-6">
              <label className="block mb-2">Assign Team Members:</label>
              <div className="flex flex-wrap gap-3">
                {teamMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleAssign(member.id)}
                    disabled={assignedMembers.includes(member.id)}
                    className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                      assignedMembers.includes(member.id)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:brightness-105'
                    }`}
                  >
                    {member.username}
                  </button>
                ))}
              </div>
            </div>

            {assignedMembers.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold mb-2 text-blue-700">Assigned Members</h4>
                <ul className="list-disc ml-5 text-gray-700">
                  {assignedMembers.map((id) => {
                    const member = teamMembers.find((m) => m.id === id);
                    return <li key={id}>{member?.username || id}</li>;
                  })}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <h4 className="text-blue-700 font-semibold mb-2">Team Progress</h4>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${teamProgress}%` }}
                />
              </div>
              <p className="text-sm mt-1">{teamProgress}%</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 italic">No accepted tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default TeamLead;

