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

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $completed: Boolean!) {
    updateTodo(where: { id: $id }, data: { completed: $completed }) {
      id
      title
      description
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(where: { id: $id }) {
      id
    }
  }
`;

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();
  const data = await client.request<{ createTodo: Todo }>(CREATE_TODO, { title, description });
  return NextResponse.json(data.createTodo);
}

export async function PATCH(req: NextRequest) {
  const { id, completed } = await req.json();
  const data = await client.request<{ updateTodo: Todo }>(UPDATE_TODO, { id, completed });
  return NextResponse.json(data.updateTodo);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const data = await client.request<{ deleteTodo: { id: string } }>(DELETE_TODO, { id });
  return NextResponse.json(data.deleteTodo);
}
