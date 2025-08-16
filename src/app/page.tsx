import { client } from '../lib/hygraph';
import { gql } from 'graphql-request';
import { Todo } from '../../types';

const GET_TODOS = gql`
  query {
    todos {
      id
      title
      description
      completed
    }
  }
`;

export default async function Home() {
  const data = await client.request<{ todos: Todo[] }>(GET_TODOS);
  const todos = data.todos;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Todo-lista</h1>
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
