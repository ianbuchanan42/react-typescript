import {
  useReducer,
  createContext,
  useContext,
  useCallback,
  useState,
} from 'react';
import './VotingApp.css';

// TypeScript Interfaces
// Defining clear type structures helps catch errors at compile time and improves code documentation
interface Option {
  id: number;
  text: string;
  votes: number;
}

interface VotingState {
  options: Option[];
  totalVotes: number;
}

// TypeScript Discriminated Union Type
// This pattern ensures type safety when handling different action types in the reducer
type VotingAction =
  | { type: 'ADD_OPTION'; payload: string }
  | { type: 'VOTE'; payload: number }
  | { type: 'RESET' };

/*
 * React Context API with TypeScript
 * - createContext creates a shared state container
 * - The generic type <{ state: VotingState; dispatch: React.Dispatch<VotingAction> } | null>
 *   ensures type safety when consuming the context
 * - null is the default value when no provider is found
 */
const VotingContext = createContext<{
  state: VotingState;
  dispatch: React.Dispatch<VotingAction>;
} | null>(null);

/*
 * useReducer Hook Implementation
 * - Similar to Redux pattern but built into React
 * - Perfect for complex state logic that involves multiple sub-values
 * - TypeScript ensures action handling is exhaustive and type-safe
 */
const votingReducer = (
  state: VotingState,
  action: VotingAction
): VotingState => {
  switch (action.type) {
    case 'ADD_OPTION':
      return {
        ...state,
        options: [
          ...state.options,
          {
            id: Date.now(), // Using timestamp as a simple unique ID
            text: action.payload,
            votes: 0,
          },
        ],
      };

    case 'VOTE':
      return {
        ...state,
        // Using immutable update patterns
        options: state.options.map((option) =>
          option.id === action.payload
            ? { ...option, votes: option.votes + 1 }
            : option
        ),
        totalVotes: state.totalVotes + 1,
      };

    case 'RESET':
      return {
        // Preserving option texts but resetting votes
        options: state.options.map((option) => ({ ...option, votes: 0 })),
        totalVotes: 0,
      };

    default:
      return state;
  }
};

/*
 * VoteOption Component
 * - Demonstrates component props typing with TypeScript
 * - Shows proper Context consumption pattern
 * - Implements memoization and performance optimizations
 */
const VoteOption = ({ option }: { option: Option }) => {
  const context = useContext(VotingContext);
  if (!context) throw new Error('VoteOption must be used within VotingContext');

  const { dispatch } = context;

  return (
    <article className='vote-option'>
      <header className='vote-option-header'>
        <h3 className='vote-option-text'>{option.text}</h3>
        <output className='vote-count' htmlFor={`vote-button-${option.id}`}>
          {option.votes} votes
        </output>
      </header>

      {/*
       * Progress meter using native <progress> element
       * - Native accessibility support
       * - Built-in progress visualization
       * - Automatic updates
       */}
      <progress
        className='vote-progress-bar'
        value={option.votes}
        max={context.state.totalVotes || 1}
      />

      <button
        id={`vote-button-${option.id}`}
        onClick={() => dispatch({ type: 'VOTE', payload: option.id })}
        className='sf-button sf-button--primary vote-button'
      >
        Vote for {option.text}
      </button>
    </article>
  );
};

/*
 * Main VotingApp Component
 * - Demonstrates state management with useReducer
 * - Shows Context Provider pattern
 * - Implements form handling with controlled components
 */
const VotingApp = () => {
  // useReducer Hook
  // Preferred over useState when state logic is complex
  const [state, dispatch] = useReducer(votingReducer, {
    options: [
      { id: 1, text: 'Option A', votes: 0 },
      { id: 2, text: 'Option B', votes: 0 },
    ],
    totalVotes: 0,
  });

  // useState Hook for form input
  // Simple state management for single value
  const [newOption, setNewOption] = useState('');

  // useCallback Hook
  // Memoizes function to prevent unnecessary re-renders
  const handleAddOption = useCallback(() => {
    if (newOption.trim()) {
      dispatch({ type: 'ADD_OPTION', payload: newOption.trim() });
      setNewOption('');
    }
  }, [newOption]); // Dependency array ensures function is only recreated when newOption changes

  return (
    // Context Provider makes state available to all child components
    <VotingContext.Provider value={{ state, dispatch }}>
      <main className='voting-app'>
        <h1 className='sf-text-title'>Voting App</h1>

        {/* Add option form */}
        <form
          className='add-option-container'
          onSubmit={(e) => {
            e.preventDefault();
            handleAddOption();
          }}
        >
          <label htmlFor='new-option' className='visually-hidden'>
            New voting option
          </label>
          <input
            id='new-option'
            type='text'
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder='Enter new option'
            className='sf-input'
            required
          />
          <button type='submit' className='sf-button sf-button--primary'>
            Add Option
          </button>
        </form>

        {/* Voting options section */}
        <section className='voting-options' aria-label='Voting options'>
          {state.options.map((option) => (
            <VoteOption key={option.id} option={option} />
          ))}
        </section>

        {/* Controls section */}
        <section className='voting-controls'>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className='sf-button reset-button'
          >
            Reset All Votes
          </button>

          <output
            className='total-votes sf-text-subtitle'
            htmlFor={state.options
              .map((opt) => `vote-button-${opt.id}`)
              .join(' ')}
          >
            Total Votes: {state.totalVotes}
          </output>
        </section>
      </main>
    </VotingContext.Provider>
  );
};

export default VotingApp;
