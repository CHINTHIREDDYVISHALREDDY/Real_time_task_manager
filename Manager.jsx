import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Manager = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  // ✅ Validate user session
  const fetchUserInfo = async (userId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/auth/me?id=${userId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.id !== userId) throw new Error();
      setUser({ ...data, id: userId });
    } catch {
      alert("Unauthorized access. Redirecting...");
      navigate('/');
    }
  };

  // ✅ On mount: load session
  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get('id');
    if (userId) fetchUserInfo(userId);
    else navigate('/');
  }, []);

  // ✅ Fetch tasks
  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      const res = await fetch(`http://127.0.0.1:8000/tasks/dashboard/${user.role}/${user.id}`);
      const data = await res.json();
      setTasks(data.map(t => ({
        id: t._id,
        title: t.title,
        status: t.status,
        progress: t.progress || 0,
      })));
    };
    fetchTasks();
  }, [user]);

  // ✅ WebSocket for real-time updates
  useEffect(() => {
    if (!user) return;
    const socket = new WebSocket("ws://127.0.0.1:8000/ws");

    socket.onopen = () => {
      socket.send(JSON.stringify({ id: user.id, role: user.role }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const doc = message.document;
    
      const updatedTask = {
        id: doc._id?.$oid || doc._id,
        title: doc.title,
        status: doc.status,
        progress: doc.progress || 0,
      };
    
      setTasks((prev) => {
        const index = prev.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          const copy = [...prev];
          copy[index] = updatedTask;
          return copy;
        }
        return [updatedTask, ...prev];
      });
    };
    
    return () => socket.close();
  }, [user]);

  // ✅ Approve request (now sets in_progress directly)
  const updateStatus = async (id, newStatus) => {
    const finalStatus = newStatus === "accepted" ? "in_progress" : newStatus;
    try {
      await fetch('http://127.0.0.1:8000/tasks/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: id, status: finalStatus }),
      });

      setTasks(prev =>
        prev.map(t => t.id === id ? { ...t, status: finalStatus } : t)
      );
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  const categorize = (key) =>
    tasks.filter(t => (t.status || '').toLowerCase() === key);

  const renderSection = (label, items, color) => (
    <div className={`p-6 rounded-xl shadow bg-${color}-100 mx-6 mb-6`}>
      <h2 className="text-xl font-semibold mb-4">{label}</h2>
      {items.length === 0 ? (
        <p className="text-gray-600 italic">No {label.toLowerCase()}.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(task => (
            <div key={task.id} className="p-4 border rounded-lg shadow bg-white">
              <h3 className="text-lg font-semibold">{task.title}</h3>

              {task.status === 'requested' ? (
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => updateStatus(task.id, 'accepted')}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(task.id, 'declined')}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-600 italic capitalize">
                  {task.status}
                </p>
              )}

              {/* Progress shown if task is running or done */}
              {['in_progress', 'completed'].includes(task.status) && (
                <div className="mt-4">
                  <div className="bg-gray-300 h-2 w-full rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-2"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-700">
                    {task.progress}% completed
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!user) return <div className="p-10 text-center">Loading manager dashboard...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100">
      <Navbar name={user.username} role={user.role} />
      {renderSection('Pending Tasks', categorize('requested'), 'yellow')}
      {renderSection('In Progress Tasks', categorize('in_progress'), 'indigo')}
      {renderSection('Declined Tasks', categorize('declined'), 'red')}
      {renderSection('Completed Tasks', categorize('completed'), 'green')}
    </div>
  );
};

export default Manager;
