import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai'; // Icons for buttons
import Modal from '../components/modal'; // Import the Modal component
import Snackbar from '../components/Snackbar'; // Import the Modal component

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ message: '', type: '' }); // New state for snackbar

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await fetch(`http://localhost:5000/tasks/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleAddTask = async (task) => {
        try {
            const response = await fetch('http://localhost:5000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newTask = await response.json();
            setTasks([...tasks, newTask]);
            setIsModalOpen(false);
            setSnackbar({ message: 'Task successfully added!', type: 'success' });
        } catch (error) {
            console.error('Error adding task:', error);
            setSnackbar({ message: 'Error adding task.', type: 'error' });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ message: '', type: '' });
    };

    const handleLogout = () => {
        // Logout logic here
        localStorage.removeItem('userId');
        window.location.href = '/';
    };

    if (loading) {
        return <div className="h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="h-full min-h-screen bg-gray-900 text-white relative">
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="https://i.ibb.co/y46BX52/askify.png" alt="Logo" className="h-8 w-8 mr-2" />
                    </div>
                    <div>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-4">
                    <input
                        className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                        type="text"
                        placeholder="Search tasks"
                    />
                    <select
                        className="shadow appearance-none border border-gray-700 rounded py-2 px-3 text-gray-300 bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        style={{ width: '200px' }} // Fixed width for the dropdown
                    >
                        <option value="status">Sort by status</option>
                        <option value="date">Sort by date</option>
                        <option value="title">Sort by title</option>
                    </select>
                </div>

                {/* Task Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TaskSection title="To Do" tasks={tasks.filter(task => task.status === 'To Do')} />
                    <TaskSection title="In Progress" tasks={tasks.filter(task => task.status === 'In Progress')} />
                    <TaskSection title="Done" tasks={tasks.filter(task => task.status === 'Done')} />
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                onClick={() => setIsModalOpen(true)}
            >
                <AiOutlinePlus className="text-2xl" />
            </button>

            {/* Modal for Adding Tasks */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTask}
            />

            {/* Snackbar Notification */}
            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
                onClose={handleSnackbarClose}
            />
        </div>
    );
};

const TaskSection = ({ title, tasks }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks</p>
            ) : (
                tasks.map(task => (
                    <div key={task._id} className="bg-gray-900 p-4 rounded-lg mb-4 shadow-md">
                        <h3 className="text-lg font-bold">{task.title}</h3>
                        <p className="text-gray-400">{task.description}</p>
                        <div className="flex space-x-2 mt-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded">
                                <AiOutlineEdit />
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded">
                                <AiOutlineDelete />
                            </button>
                            <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded">
                                <AiOutlineEye />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Home;
