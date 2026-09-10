import { animate, motion, Reorder, useMotionValue, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';

import { ListsFrame } from './Frame';
import {
  EXAMPLES,
  MOTION_RUNTIME,
  TODO_LIST_DEFAULTS,
  WEEK_ZERO_TODOS,
  shouldReduce,
  type ReducedMotionMode,
  type TodoItem,
} from './source';

export type TodoListProps = {
  textDuration?: number;
  strikeDuration?: number;
  completeDelay?: number;
  reducedMotion?: ReducedMotionMode;
};

function useTodo(initial: TodoItem[], completeDelay: number) {
  const [todos, setTodos] = useState(initial);

  const toggleTodo = (id: number) => {
    setTodos((prev) => {
      const updated = prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
      const target = updated.find((todo) => todo.id === id);
      if (target?.completed) {
        window.setTimeout(() => {
          setTodos((current) => {
            const completed = current.filter((todo) => todo.completed);
            const uncompleted = current.filter((todo) => !todo.completed);
            return [...uncompleted, ...completed];
          });
        }, completeDelay);
      }
      return updated;
    });
  };

  return { todos, setTodos, toggleTodo };
}

function Item({
  todo,
  onToggle,
  textDuration,
  strikeDuration,
  reduce,
}: {
  todo: TodoItem;
  onToggle: () => void;
  textDuration: number;
  strikeDuration: number;
  reduce: boolean;
}) {
  const boxShadow = useMotionValue('0 1px 2px rgb(33 33 33 / 0.12)');
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const duration = reduce ? 0 : textDuration;
  const strikeTime = reduce ? 0 : strikeDuration;

  return (
    <Reorder.Item
      value={todo}
      id={String(todo.id)}
      as="li"
      className="lists-todo__item"
      style={{ boxShadow }}
      onDragStart={() => {
        animate(boxShadow, '0 7px 24px rgb(33 33 33 / 0.2)');
      }}
      onDragEnd={() => {
        animate(boxShadow, '0 1px 2px rgb(33 33 33 / 0.12)');
      }}
    >
      <button
        ref={checkboxRef}
        type="button"
        className="lists-todo__check"
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={`${todo.completed ? 'Mark incomplete' : 'Mark complete'}: ${todo.text}`}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        onPointerDownCapture={(event) => event.stopPropagation()}
      >
        {todo.completed ? (
          <svg width="10" height="8" viewBox="0 0 12 10" aria-hidden="true">
            <path
              d="M1 5L4.5 8.5L11 1"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        ) : null}
      </button>
      <span className="lists-todo__text-wrap">
        <motion.span
          animate={{ opacity: todo.completed ? 0.45 : 1 }}
          transition={{ duration }}
          className="lists-todo__text"
        >
          {todo.text}
        </motion.span>
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: todo.completed ? 1 : 0 }}
          transition={{ duration: strikeTime, ease: 'easeOut' }}
          className="lists-todo__strike"
        />
      </span>
    </Reorder.Item>
  );
}

export function TodoList({
  textDuration = TODO_LIST_DEFAULTS.textDuration,
  strikeDuration = TODO_LIST_DEFAULTS.strikeDuration,
  completeDelay = TODO_LIST_DEFAULTS.completeDelay,
  reducedMotion = TODO_LIST_DEFAULTS.reducedMotion,
}: TodoListProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const { todos, setTodos, toggleTodo } = useTodo(
    WEEK_ZERO_TODOS.map((item) => ({ ...item })),
    completeDelay,
  );

  return (
    <ListsFrame
      title="Todo list"
      mechanism={
        <>
          <code>Reorder.Group</code> plus <code>Reorder.Item</code> on axis{' '}
          <code>y</code>. Drag writes <code>x</code>/<code>y</code>.{' '}
          <code>checkReorder</code> moves the value. <code>layout</code> FLIP
          animates neighbours. <code>animate(boxShadow)</code> on drag start
          and end. A <code>motion.span</code> opacity and a <code>scaleX</code>{' '}
          strikethrough run on toggle. A timeout then moves completed items to
          the bottom. Layout/Reorder grid already uses{' '}
          <code>Reorder.Group</code> for a different composition.
        </>
      }
      docs={MOTION_RUNTIME.docsReorder}
      example={EXAMPLES.todoList.page}
      live={EXAMPLES.todoList.live}
      chunk={EXAMPLES.todoList.chunk}
      priorNote="Layout/Reorder grid already uses Reorder.Group for a 16-cell Week 0 board. This list is a vertical checklist with strikethrough."
      fixedNote="Axis stays y because this is a vertical list. Upstream box is max-width 340 by 280. This list is 22 rem so eight Week 0 actions stay readable. Replay restores the open checklist. Drag is pointer only."
      controlKind="replay"
      onReplay={() => {
        setTodos(WEEK_ZERO_TODOS.map((item) => ({ ...item })));
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
      testId="todo-list"
      running={!reduce}
      runId={runId}
      extraData={{ 'data-order': todos.map((todo) => todo.id).join(',') }}
    >
      <div className="lists-example__stage">
        <div className="lists-todo">
          <Reorder.Group
            key={runId}
            axis="y"
            values={todos}
            onReorder={setTodos}
            as="ul"
            className="lists-todo__list"
            aria-label="Week 0 actions"
          >
            {todos.map((todo) => (
              <Item
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                textDuration={textDuration}
                strikeDuration={strikeDuration}
                reduce={reduce}
              />
            ))}
          </Reorder.Group>
        </div>
      </div>
    </ListsFrame>
  );
}
