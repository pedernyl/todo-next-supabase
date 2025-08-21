import { NextRequest, NextResponse } from 'next/server';
import { client } from '../../../lib/hygraph';
import { gql } from 'graphql-request';
import { Todo } from '../../../../types';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";


// Mutation to create a Todo
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

// Mutation to publish a Todo
const PUBLISH_TODO = gql`
  mutation PublishTodo($id: ID!) {
    publishTodo(where: { id: $id }) {
      id
    }
  }
`;

// Mutation to update a Todo
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

// Mutation to delete a Todo
const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(where: { id: $id }) {
      id
    }
  }
`;

// Handle creating a Todo
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, description } = await req.json();

  // Create Todo in draft
  const createData = await client.request<{ createTodo: Todo }>(CREATE_TODO, { title, description });
  const todo = createData.createTodo;

  // Publish the new Todo
  await client.request(PUBLISH_TODO, { id: todo.id });

  return NextResponse.json(todo);
}

// Handle updating a Todo (toggle completed)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, completed } = await req.json();

  // Update Todo
  const updateData = await client.request<{ updateTodo: Todo }>(UPDATE_TODO, { id, completed });
  const todo = updateData.updateTodo;

  // Publish the updated Todo
  await client.request(PUBLISH_TODO, { id });

  return NextResponse.json(todo);
}

// Handle deleting a Todo
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const deleteData = await client.request<{ deleteTodo: { id: string } }>(DELETE_TODO, { id });
  return NextResponse.json(deleteData.deleteTodo);
}
