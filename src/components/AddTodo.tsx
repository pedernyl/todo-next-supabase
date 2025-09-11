'use client';

import { useState, useEffect } from 'react';
import { Todo } from '../../types';

interface AddTodoProps {
  onTodoAdded?: (todo: Todo) => void;
  editTodo?: Todo | null;
  onTodoUpdated?: (todo: Todo) => void;
  parentTodo?: Todo | null;
}

export default function AddTodo({ onTodoAdded, editTodo, onTodoUpdated, parentTodo }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Load todo into form when editing
  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setDescription(editTodo.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editTodo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editTodo && editTodo.id) {
      // Update existing todo
      const res = await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editTodo.id, title, description }),
      });
      if (!res.ok) return;
      const updatedTodo: Todo = await res.json();
      onTodoUpdated?.(updatedTodo);
    } else {
      // Create new todo or sub-todo
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, parent_todo: parentTodo?.id }),
      });
      if (!res.ok) return;
      const newTodo: Todo = await res.json();
      onTodoAdded?.(newTodo);
    }
    setTitle('');
    setDescription('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-xl mx-auto mb-6"
    >
      {parentTodo && (
        <div className="text-sm text-gray-600 mb-2">
          Parent Todo: <span className="font-semibold">{parentTodo.title}</span>
        </div>
      )}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
      >
        Add Todo
      </button>
    </form>
  );
}
