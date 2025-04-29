// This file provides fixes for type compatibility issues between different libraries
interface AbortSignalConstructor {
  new (): AbortSignal;
  prototype: AbortSignal;
  abort(reason?: any): AbortSignal;
  timeout(milliseconds: number): AbortSignal;
}

// Fix the AbortSignal type conflict
declare var AbortSignal: AbortSignalConstructor;

// Fix the jsdom Window indexing issues
interface Window {
  readonly ['Infinity']: number;
  readonly ['NaN']: number;
}
