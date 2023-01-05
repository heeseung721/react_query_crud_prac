import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todosApi";

//useMutation 은 React Query 를 이용해 서버에 데이터 변경 작업(C,U,D)을 요청할 때 사용.
//데이터 조회(R)시에는 -> useQuery

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
  //invalidateQueries는 useQuery에서 사용되는 queryKey의 유효성을 제거해주는 목적으로 사용됩니다.
  //queryKey의 유효성을 제거해주는 이유는 서버로부터 다시 데이터를 조회해오기 위함

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

  //mutate는 useMutation을 이용해 작성한 내용들이 실행될 수 있도록 도와주는 trigger 역할을 합니다.
  //-> useMutation을 정의 해둔 뒤 이벤트가 발생되었을 때 mutate를 사용

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
      <h1>TODOLIST react_qurey</h1>
      {newItemSection}
      {content}
    </main>
  );
};

export default TodoList;
