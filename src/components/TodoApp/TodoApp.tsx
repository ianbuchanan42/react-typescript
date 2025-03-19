import { useState, useEffect, useCallback } from 'react';
import './TodoApp.css';

/*
 * TypeScript Interface
 * Defines the shape of a todo item
 * Using interfaces helps catch type-related bugs at compile time
 * and provides better IDE support
 */
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

/*
 * TodoApp Component
 * Demonstrates:
 * - Multiple hooks working together (useState, useEffect, useCallback)
 * - Local storage persistence
 * - TypeScript type safety
 * - Accessibility considerations
 */
const TodoApp = () => {
  /*
   * useState Hook with TypeScript
   * - Generic type <Todo[]> ensures type safety for the todos array
   * - Generic type <string> for the input field
   * - useState provides a value and a setter function
   */
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  /*
   * useEffect Hook for Loading Data
   * - Runs once when component mounts (empty dependency array)
   * - Handles loading todos from localStorage
   * - Uses type assertion (as Todo[]) for type safety
   */
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  /*
   * useEffect Hook for Saving Data
   * - Runs whenever todos change (todos in dependency array)
   * - Persists todos to localStorage
   * - Demonstrates side effect handling
   */
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  /*
   * useCallback Hook for Memoization
   * - Prevents unnecessary re-renders
   * - Dependencies array ensures function is only recreated when newTodo changes
   * - Demonstrates proper event handling with TypeScript
   */
  const addTodo = useCallback(() => {
    const trimmedTodo = newTodo.trim();
    if (trimmedTodo) {
      setTodos((prevTodos) => [
        ...prevTodos,
        {
          id: Date.now(),
          text: trimmedTodo,
          completed: false,
        },
      ]);
      setNewTodo('');
    }
  }, [newTodo]);

  /*
   * useCallback Hook for Toggle Function
   * - Memoized function for better performance
   * - Uses immutable state update pattern
   * - No dependencies as it only uses the id parameter
   */
  const toggleTodo = useCallback((id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  /*
   * useCallback Hook for Delete Function
   * - Memoized function for better performance
   * - Uses filter for immutable array manipulation
   * - No dependencies needed
   */
  const deleteTodo = useCallback((id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  return (
    /*
     * Using <section> for todo app content area
     * Main content area is already handled by App.tsx
     */
    <section className='todo-app'>
      <h1 className='sf-text-title'>Todo List</h1>

      {/*
       * Input section using semantic elements
       * - Groups the todo creation functionality
       * - Contains form and its related elements
       */}
      <section aria-label='Add new todo'>
        <form
          className='todo-input-container'
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
        >
          <label htmlFor='new-todo' className='visually-hidden'>
            New todo item
          </label>
          <input
            id='new-todo'
            type='text'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder='What needs to be done?'
            className='sf-input todo-input'
            required
          />
          <button type='submit' className='sf-button sf-button--primary'>
            Add Todo
          </button>
        </form>
      </section>

      {/*
       * Todo list section using semantic elements
       * - <section> for grouping related content
       * - <ul> for list of todos
       * - Proper ARIA labels and roles
       */}
      <section aria-label='Todo items' className='todo-list-section'>
        {todos.length > 0 ? (
          <ul className='todo-list'>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <div className='todo-content'>
                  <label className='todo-checkbox-label'>
                    <input
                      type='checkbox'
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className='todo-checkbox'
                    />
                    <span className='todo-text'>{todo.text}</span>
                  </label>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className='todo-delete'
                  aria-label={`Delete ${todo.text}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className='todo-empty sf-text-subtitle' role='status'>
            No todos yet. Add one to get started!
          </p>
        )}
      </section>
    </section>
  );
};

export default TodoApp;
