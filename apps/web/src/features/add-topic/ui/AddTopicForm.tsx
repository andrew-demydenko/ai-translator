import React, { useState } from "react";

interface AddTopicFormProps {
  onAdd: (name: string) => void;
}

export const AddTopicForm: React.FC<AddTopicFormProps> = ({ onAdd }) => {
  const [newTopicName, setNewTopicName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopicName.trim()) {
      onAdd(newTopicName);
      setNewTopicName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={newTopicName}
        onChange={(e) => setNewTopicName(e.target.value)}
        placeholder="Add new topic..."
        className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        +
      </button>
    </form>
  );
};
