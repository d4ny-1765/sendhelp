import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  Box,
  Typography,
} from "@mui/material";
import { JSX, useEffect, useState } from "react";
import { Users } from "../src/db/types.js";
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      function TodoList(): JSX.Element {
        const [todos, setTodos] = useState<Todo[]>([]);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
          async function getTodos() {
            const res = await fetch('http://localhost:3000/api/v1/todos');
            const data = await res.json();
            setTodos(data);
            setIsLoading(false);
          }
      getTodos();
        }, []);}
    </>
  )
}

export default App
