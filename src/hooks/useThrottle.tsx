import React from "react";
type ApiCall = (...args: unknown[]) => Promise<unknown>;
interface UseApiThrottleProps<T extends ApiCall> {
  fn: T;
  callback?: (res: unknown) => void;
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
