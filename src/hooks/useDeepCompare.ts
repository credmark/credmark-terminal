import { dequal as deepEqual } from 'dequal';
import * as React from 'react';

type UseEffectParams = Parameters<typeof React.useEffect>;
type EffectCallback = UseEffectParams[0];
type EffectDependencyList = UseEffectParams[1];
// yes, I know it's void, but I like what this communicates about
// the intent of these functions: It's just like useEffect
type UseEffectReturn = ReturnType<typeof React.useEffect>;

type CallbackDependencyList = Parameters<typeof React.useCallback>[1];
type MemoDependencyList = Parameters<typeof React.useMemo>[1];

function checkDeps(deps: EffectDependencyList) {
  if (!deps || !deps.length) {
    throw new Error(
      'useDeepCompareEffect should not be used with no dependencies. Use React.useEffect instead.',
    );
  }
  if (deps.every(isPrimitive)) {
    throw new Error(
      'useDeepCompareEffect should not be used with dependencies that are all primitive values. Use React.useEffect instead.',
    );
  }
}

function isPrimitive(val: unknown) {
  return val == null || /^[sbn]/.test(typeof val);
}

/**
 * @param value the value to be memoized (usually a dependency list)
 * @returns a memoized version of the value as long as it remains deeply equal
 */
export function useDeepCompareMemoize<T>(value: T) {
  const ref = React.useRef<T>(value);
  const signalRef = React.useRef<number>(0);

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => ref.current, [signalRef.current]);
}

export function useDeepCompareEffect(
  callback: EffectCallback,
  dependencies: EffectDependencyList,
): UseEffectReturn {
  if (process.env.NODE_ENV !== 'production') {
    checkDeps(dependencies);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useEffect(callback, useDeepCompareMemoize(dependencies));
}

export function useDeepCompareEffectNoCheck(
  callback: EffectCallback,
  dependencies: EffectDependencyList,
): UseEffectReturn {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useEffect(callback, useDeepCompareMemoize(dependencies));
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function useDeepCompareCallback<T extends Function>(
  callback: T,
  dependencies: CallbackDependencyList,
): T {
  if (process.env.NODE_ENV !== 'production') {
    checkDeps(dependencies);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(callback, useDeepCompareMemoize(dependencies));
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function useDeepCompareCallbackNoCheck<T extends Function>(
  callback: T,
  dependencies: CallbackDependencyList,
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(callback, useDeepCompareMemoize(dependencies));
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function useDeepCompareMemo<T>(
  factory: () => T,
  dependencies: MemoDependencyList,
): T {
  if (process.env.NODE_ENV !== 'production') {
    checkDeps(dependencies);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(factory, useDeepCompareMemoize(dependencies));
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function useDeepCompareMemoNoCheck<T>(
  factory: () => T,
  dependencies: MemoDependencyList,
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(factory, useDeepCompareMemoize(dependencies));
}
