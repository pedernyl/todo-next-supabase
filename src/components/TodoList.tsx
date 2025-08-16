'use client';

import { useState } from 'react';
import { Todo } from '../../types';
import AddTodo from './AddTodo';

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  return (
    <div>
      <AddTodo onAdd={todo => setTodos([todo, ...todos])} />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <strong>{todo.title}</strong>: {todo.description} - {todo.completed ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  );
}
