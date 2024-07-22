import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import Modal from '../components/modal';
import TaskDetailsModal from '../components/taskDetailsModal';
import Snackbar from '../components/Snackbar';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
    TASK: 'task',
};

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ message: '', type: '' });
    const [editingTask, setEditingTask] = useState(null);
    const [viewingTask, setViewingTask] = useState(null); // State for viewing task

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

    const handleUpdateTask = async (task) => {
        try {
            const response = await fetch(`http://localhost:5000/tasks/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedTask = await response.json();
            setTasks(tasks.map(t => (t._id === updatedTask._id ? updatedTask : t)));
            setIsModalOpen(false);
            setEditingTask(null);
            setSnackbar({ message: 'Task successfully updated!', type: 'success' });
        } catch (error) {
            console.error('Error updating task:', error);
            setSnackbar({ message: 'Error updating task.', type: 'error' });
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await fetch(`http://localhost:5000/tasks/${taskId}`, {
                method: 'DELETE',
            });
            setTasks(tasks.filter(task => task._id !== taskId));
            setSnackbar({ message: 'Task successfully deleted!', type: 'success' });
        } catch (error) {
            console.error('Error deleting task:', error);
            setSnackbar({ message: 'Error deleting task.', type: 'error' });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ message: '', type: '' });
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        window.location.href = '/';
    };

    const moveTask = async (taskId, newStatus) => {
        const updatedTasks = tasks.map(task =>
            task._id === taskId ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);

        const updatedTask = updatedTasks.find(task => task._id === taskId);

        try {
            await fetch(`http://localhost:5000/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });
            setSnackbar({ message: 'Task status updated!', type: 'success' });
        } catch (error) {
            console.error('Error updating task status:', error);
            setSnackbar({ message: 'Error updating task status.', type: 'error' });
        }
    };

    if (loading) {
        return <div className="h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="h-full min-h-screen bg-gray-900 text-white relative">
                <nav className="bg-gray-800 p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center">
                            <img src="https://i.ibb.co/y46BX52/askify.png" alt="Logo" className="h-8 w-8 mr-2" />
                        </div>
                        <div>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                                onClick={handleLogout}
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
                            style={{ width: '200px' }}
                        >
                            <option value="status">Sort by status</option>
                            <option value="date">Sort by date</option>
                            <option value="title">Sort by title</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <TaskSection title="To Do" tasks={tasks.filter(task => task.status === 'To Do')} moveTask={moveTask} onEditTask={setEditingTask} onDeleteTask={handleDeleteTask} onViewTask={setViewingTask} />
                        <TaskSection title="In Progress" tasks={tasks.filter(task => task.status === 'In Progress')} moveTask={moveTask} onEditTask={setEditingTask} onDeleteTask={handleDeleteTask} onViewTask={setViewingTask} />
                        <TaskSection title="Done" tasks={tasks.filter(task => task.status === 'Done')} moveTask={moveTask} onEditTask={setEditingTask} onDeleteTask={handleDeleteTask} onViewTask={setViewingTask} />
                    </div>
                </div>

                <button
                    className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                    onClick={() => setIsModalOpen(true)}
                >
                    <AiOutlinePlus className="text-2xl" />
                </button>

                <Modal
                    isOpen={isModalOpen || editingTask !== null}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingTask(null);
                    }}
                    onSubmit={editingTask ? handleUpdateTask : handleAddTask}
                    task={editingTask}
                />

                <TaskDetailsModal
                    isOpen={viewingTask !== null}
                    onClose={() => setViewingTask(null)}
                    task={viewingTask}
                />

                <Snackbar
                    message={snackbar.message}
                    type={snackbar.type}
                    onClose={handleSnackbarClose}
                />
            </div>
        </DndProvider>
    );
};

const TaskSection = ({ title, tasks, moveTask, onEditTask, onDeleteTask, onViewTask }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.TASK,
        drop: (item) => moveTask(item.id, title),
    });

    return (
        <div ref={drop} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks</p>
            ) : (
                tasks.map(task => (
                    <TaskCard key={task._id} task={task} onEditTask={onEditTask} onDeleteTask={onDeleteTask} onViewTask={onViewTask} />
                ))
            )}
        </div>
    );
};

const TaskCard = ({ task, onEditTask, onDeleteTask, onViewTask }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TASK,
        item: { id: task._id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const handleDeleteClick = () => {
        onDeleteTask(task._id);
    };

    return (
        <div
            ref={drag}
            className={`bg-gray-900 p-4 rounded-lg mb-4 shadow-md ${isDragging ? 'opacity-50' : 'opacity-100'}`}
            style={{ maxHeight: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
            <h3 className="text-lg font-bold">{task.title}</h3>
            <p className="text-gray-400 overflow-y-hidden" style={{ maxHeight: '100px' }}>{task.description}</p>
            <div className="flex space-x-2 mt-2">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded"
                    onClick={() => onEditTask(task)}
                >
                    <AiOutlineEdit />
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded" onClick={handleDeleteClick}>
                    <AiOutlineDelete />
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded" onClick={() => onViewTask(task)}>
                    <AiOutlineEye />
                </button>
            </div>
        </div>
    );
};

export default Home;
