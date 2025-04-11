// This is the rewritten Client.jsx to ditch localStorage and use the `/auth/me?id=...` approach.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card } from '../components/Card';
import '../styles/animations.css';

const gradients = {
  Completed: 'from-green-100 via-green-50 to-white',
  Accepted: 'from-blue-100 via-blue-50 to-white',
  Declined: 'from-red-100 via-red-50 to-white',
};

const Client = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [declinedRequests, setDeclinedRequests] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Validate user and load session
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

  // ✅ Fetch tasks for client
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      const res = await fetch(`http://127.0.0.1:8000/tasks/dashboard/${user.role}/${user.id}`);
      const data = await res.json();

      const accepted = [];
      const declined = [];
      const completed = [];

      data.forEach((task) => {
        const mapped = {
          id: task._id,
          title: task.title,
          description: task.description,
          progress: task.progress || 0,
        };

        if (['accepted', 'in_progress'].includes(task.status)) accepted.push(mapped);
        else if (task.status === 'declined') declined.push(mapped);
        else if (task.status === 'completed') completed.push(mapped);
      });

      setAcceptedRequests(accepted);
      setDeclinedRequests(declined);
      setCompletedTasks(completed);
    };

    fetchTasks();
  }, [user]);

  // ✅ WebSocket updates
  useEffect(() => {
    if (!user) return;
    const socket = new WebSocket('ws://127.0.0.1:8000/ws');

    socket.onopen = () => {
      console.log('✅ WebSocket connection established');
      socket.send(JSON.stringify({ id: user.id, role: user.role }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('📩 WebSocket message received:', message);

      const doc = message.document;
      const task = {
        id: doc._id?.$oid || doc._id,
        title: doc.title,
        description: doc.description,
        progress: doc.progress || 0,
        status: doc.status,
      };

      // Helper to replace or add task in a list
      const updateList = (listSetter) => {
        listSetter((prev) => {
          const index = prev.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = task;
            return updated;
          } else {
            return [task, ...prev];
          }
        });
      };

      // Remove from all categories first (in case status changed)
      setAcceptedRequests((prev) => prev.filter((t) => t.id !== task.id));
      setDeclinedRequests((prev) => prev.filter((t) => t.id !== task.id));
      setCompletedTasks((prev) => prev.filter((t) => t.id !== task.id));

      // Add to correct list based on updated status
      if (['accepted', 'in_progress'].includes(task.status)) {
        updateList(setAcceptedRequests);
      } else if (task.status === 'declined') {
        updateList(setDeclinedRequests);
      } else if (task.status === 'completed') {
        updateList(setCompletedTasks);
      }
    };
  }, [user]);

  // ✅ Send new request
  const handleSend = async () => {
    if (!title.trim() || !description.trim() || !user) return;

    const newRequest = {
      title: title.trim(),
      description: description.trim(),
      created_by: user.id,
    };

    const res = await fetch('http://127.0.0.1:8000/tasks/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest),
    });

    if (res.ok) {
      alert('✅ Request created.');
      setTitle('');
      setDescription('');
      setShowPopup(false);
    } else {
      alert('❌ Failed to send request.');
    }
  };

  const renderRow = (title, data) => {
    const gradientKey = title.split(' ')[0];
    const gradientBg = gradients[gradientKey] || 'from-gray-100 to-white';

    return (
      <div
        className={`px-6 py-8 rounded-2xl shadow-inner bg-gradient-to-r ${gradientBg} mb-10 mx-4 md:mx-10 transition-all duration-500 animate-fadeInUp`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-5">{title}</h2>
        {data.length === 0 ? (
          <p className="text-gray-500 italic">No {title.toLowerCase()}.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((req) => (
              <Card key={req.id} progress={req.progress} status={gradientKey}>
                {{
                  title: req.title,
                  description: req.description,
                }}
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!user) return <div className="p-10 text-center text-gray-600">Loading client dashboard...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-rose-100 pb-20 overflow-x-hidden">
      <Navbar name={user.username} role={user.role} />

      {/* Add Request Button */}
      <div className="mt-6 px-6 animate-slideDown">
        <button
          onClick={() => setShowPopup(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition duration-300"
        >
          + Add Request
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-40 flex items-center justify-center">
          <div className="animate-fadeIn bg-gradient-to-br from-white/60 via-white/40 to-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-6 w-[90%] max-w-md z-50 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              New Task Request
            </h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full p-3 mb-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white/70 placeholder:text-gray-500 transition duration-300"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              className="w-full p-3 border border-indigo-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white/70 placeholder:text-gray-500 transition duration-300"
              rows={4}
            />

            <div className="mt-5 flex justify-end gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-1.5 rounded-xl text-sm font-medium border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-5 py-1.5 rounded-xl font-semibold hover:brightness-110 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Sections */}
      <div className="mt-12 space-y-12">
        {renderRow('Completed Tasks', completedTasks)}
        {renderRow('Accepted Requests', acceptedRequests)}
        {renderRow('Declined Requests', declinedRequests)}
      </div>
    </div>
  );
};

export default Client;

