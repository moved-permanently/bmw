/*
 * Per-render WDH binding collection (no DOM; kept tiny because scripts.js loads it on every page).
 */
/**
 * WDH bindings of the current page render. Experience Workspace quick edit replaces the body and
 * calls loadPage again: start() begins a fresh collection, and a check started for an earlier
 * render can tell that it was superseded (isCurrent).
 */
// eslint-disable-next-line import/prefer-default-export
export function createWdhSession() {
  let generation = 0;
  let bindings = [];
  return {
    start() {
      generation += 1;
      bindings = [];
      return generation;
    },
    add(binding) {
      bindings.push(binding);
    },
    get bindings() {
      return bindings;
    },
    get generation() {
      return generation;
    },
    isCurrent(value) {
      return value === generation;
    },
  };
}
