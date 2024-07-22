import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
    if (!isOpen) return null;

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(task.date));

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                >
                    <AiOutlineClose className="text-2xl" />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">Task Details</h2>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Title</label>
                    <p className="text-white bg-gray-800 p-2 rounded">{task.title}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Description</label>
                    <div className="text-white bg-gray-800 p-2 rounded max-h-32 overflow-y-auto">
                        {task.description}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Status</label>
                    <p className="text-white bg-gray-800 p-2 rounded">{task.status}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Created at</label>
                    <p className="text-white bg-gray-800 p-2 rounded">{formattedDate}</p>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
