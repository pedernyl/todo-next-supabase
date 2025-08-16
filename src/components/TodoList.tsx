'use client';

import { useState } from 'react';
import { Todo } from '../../types';
import AddTodo from './AddTodo';

interface TodoListProps {
  initialTodos: Todo[];
}


export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const toggleCompleted = async (todo: Todo) => {
    const res = await fetch('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todo.id, completed: !todo.completed }),
    });
    const updatedTodo: Todo = await res.json();
    setTodos(todos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)));
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setTodos(todos.filter(t => t.id !== id));
    }
  };

  return (
    <div>
      <AddTodo onAdd={todo => setTodos([todo, ...todos])} />
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: '10px' }}>
            <strong>{todo.title}</strong>: {todo.description} - {todo.completed ? '✅' : '❌'}
            <button onClick={() => toggleCompleted(todo)} style={{ marginLeft: '10px' }}>
              {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            </button>
            <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: '5px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
