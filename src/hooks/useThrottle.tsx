// import { useRef, useState } from "react";

// function useThrottle(fn: Function) {
//   const [loading, setLoading] = useState(false);
//   const ref = useRef<Function | null>(null);

//   const throttledFn = (...args: Parameters<Function>) => {
//     if (loading) return;
//     if (ref.current == null) {
//       ref.current = fn;
//       setLoading(true);
//       await fn(...args);
//       ref.current = null;
//       setLoading(false);
//     }
//   };
//   return throttledFn;
// }
import React from "react";
type ApiCall = (...args: any[]) => Promise<any>;
interface UseApiThrottleProps<T extends ApiCall> {
  fn: T;
  callback?: (res: Awaited<ReturnType<T>>) => void;
}
/**
 * Prevent additional API call until the most recent one has completed.
 */
const useApiThrottle = <T extends ApiCall>(props: UseApiThrottleProps<T>) => {
  const { fn, callback } = props;
  const fetchingRef = React.useRef(false);
  const [fetching, setFetching] = React.useState(false);
  const wrapperFn: (...args: Parameters<T>) => Promise<void> =
    React.useCallback(
      async (...args) => {
        if (fetchingRef.current) {
          return;
        }
        fetchingRef.current = true;
        setFetching(true);
        await fn(...args).then(callback);
        fetchingRef.current = false;
        setFetching(false);
      },
      [fn, callback]
    );
  return { fetching, fn: wrapperFn };
};
export default useApiThrottle;
