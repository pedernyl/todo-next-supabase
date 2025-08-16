import { NextRequest, NextResponse } from 'next/server';
import { client } from '../../../lib/hygraph';
import { gql } from 'graphql-request';
import { Todo } from '../../../../types';

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $description: String!) {
    createTodo(data: { title: $title, description: $description, completed: false }) {
      id
      title
      description
      completed
    }
  }
`;

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();
  const data = await client.request<{ createTodo: Todo }>(CREATE_TODO, { title, description });
  return NextResponse.json(data.createTodo);
}
