"use client";

import React, { useState, useEffect } from "react";
import TodoList from "../components/TodoList";
import CategoryDropdownWrapper from "../components/CategoryDropdownWrapper";
import { useUserId } from "../context/UserIdContext";
import { Todo } from "../../types";
import type { Category } from "../lib/categoryService";

export default function TodoPageClient({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { userId } = useUserId();

  useEffect(() => {
    if (!userId) return;
    let url = "/api/todos";
    if (selectedCategory && selectedCategory.id) {
      url += `?category_id=${selectedCategory.id}`;
    }
    fetch(url)
      .then(res => res.ok ? res.json() : [])
      .then(setTodos)
      .catch(() => {});
  }, [selectedCategory, userId]);

  return (
    <>
      <div className="absolute right-10 top-2 z-10">
        <CategoryDropdownWrapper onCategoryChange={setSelectedCategory} />
      </div>
      <TodoList initialTodos={todos} />
    </>
  );
}
