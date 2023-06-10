import { exec as cp_exec } from 'child_process';
import util from 'node:util';
import createTask from 'tasuku';
const exec = util.promisify(cp_exec);

export async function run(command, rawInstructions) {
  const instruction = parseInstructions(rawInstructions);

  return createTask(command, async ({ setStatus, task }) => {
    const interval = createInterval(setStatus);

    const todos = groupTasks(task, instruction);

    await todos;

    clearInterval(interval);
  });
}

function createInterval(setStatus) {
  const timer = startTimer();
  return setInterval(() => {
    setStatus(`${timer.elapsed()} s`);
  }, 100);
}

function startTimer() {
  const start = Date.now();
  return { elapsed: () => (Math.round(Date.now() - start) / 1000).toFixed(1) };
}

function groupTasks(task, definition) {
  return task.group(
    (r) =>
      definition.tasks.map((t) => {
        if (isString(t)) {
          return r(t, createTimedTask(t));
        }

        return r(t.tasks.join(), async (nest) => {
          return nest.task.group(
            (rrr) => t.tasks.map((tt) => rrr(tt, createTimedTask(tt))),
            { concurrency: t.parallel ? Infinity : 1 }
          );
        });
      }),
    { concurrency: definition.parallel ? Infinity : 1 }
  );
}

function createTimedTask(command) {
  return async ({ setStatus }) => {
    const interval = createInterval(setStatus);
    await exec(command);
    clearInterval(interval);
  };
}

/**
 * @param {string | string[] | object[] | object | unknown} instructions
 * @returns {{ parallel: boolean, tasks: string[] }}
 */
function parseInstructions(instructions) {
  if (isString(instructions)) {
    return {
      parallel: false,
      tasks: [instructions],
    };
  }
  if (isArray(instructions)) {
    return {
      parallel: false,
      tasks: instructions.map((d) => (isString(d) ? d : parseInstructions(d))),
    };
  }
  if (isObject(instructions)) {
    return {
      parallel: true,
      tasks: Object.values(instructions).map((i) =>
        isString(i) ? i : parseInstructions(i)
      ),
    };
  }
  throw Error(`Unable to parse these instructions: ${instructions}`);
}

function isString(x) {
  return typeof x === 'string';
}

function isArray(x) {
  return Array.isArray(x);
}

function isObject(x) {
  return typeof x === 'object' && !isArray(x);
}
