import axios from "axios";

const todosApi = axios.create({
  baseURL: "http://localhost:3001",
});

//mutation Function으로 promise 처리가 이루어지는 함수입니다.
//(axios를 이용해 서버에 API를 요청하는 부분)

export const getTodos = async () => {
  const response = await todosApi.get("/todos");
  return response.data;
};

export const addTodo = async (todo) => {
  return await todosApi.post("/todos", todo);
};

export const updateTodo = async (todo) => {
  return await todosApi.patch(`/todos/${todo.id}`, todo);
};

export const deleteTodo = async ({ id }) => {
  return await todosApi.delete(`/todos/${id}`, id);
};

export default todosApi;
