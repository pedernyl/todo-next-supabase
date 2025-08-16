'use client';

import { useState } from 'react';
import { Todo } from '../../types';

interface AddTodoProps {
  onAdd: (todo: Todo) => void;
}

// Component for adding a new Todo
export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call API route to create and publish Todo
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) return;
    const newTodo: Todo = await res.json();

    // Update local state in client component
    onAdd(newTodo);

    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}
