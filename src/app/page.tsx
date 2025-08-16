import { client } from '../lib/hygraph';
import { gql } from 'graphql-request';
import TodoList from '../components/TodoList';
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
      <h1>Todo App</h1>
      <TodoList initialTodos={todos} />
    </div>
  );
}
