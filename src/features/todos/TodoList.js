import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todosApi";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery("todos", getTodos, {
    select: (data) => data.sort((a, b) => b.id - a.id),
  }); //가장 최근에 작성한 것이 가장 위쪽으로 올라오도록

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    addTodoMutation.mutate({ userId: 1, title: newTodo, completed: false });
    setNewTodo("");
  };

  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new todo item</label>
      <div className="new-todo">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
      </div>
      <button className="submit">SUBMIT</button>
    </form>
  );

  let content;
  if (isLoading) {
    content = <div>loading. . . </div>;
  } else if (isError) {
    content = <div>{error.message}</div>;
  } else {
    content = todos.map((todo) => {
      return (
        <article key={todo.id}>
          <div className="todo">
            <input
              type="checkbox"
              checked={todo.completed}
              id={todo.id}
              onChange={() => {
                updateTodoMutation.mutate({
                  ...todo,
                  completed: !todo.completed,
                });
              }}
            />
            <label htmlFor="{todo.id}">{todo.title}</label>
          </div>
          <button
            className="trash"
            onClick={() => deleteTodoMutation.mutate({ id: todo.id })}
          >
            DELETE
          </button>
        </article>
      );
    });
  }

  return (
    <main>
      <h1>TOdo List</h1>
      {newItemSection}
      {content}
    </main>
  );
};

export default TodoList;
