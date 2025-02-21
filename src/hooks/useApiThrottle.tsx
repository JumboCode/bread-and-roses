import { useCallback, useRef, useState } from "react";
type ApiCall<TArgs extends unknown[], TReturn> = (
  ...args: TArgs
) => Promise<TReturn>;
interface UseApiThrottleProps<TArgs extends unknown[], TReturn> {
  fn: ApiCall<TArgs, TReturn>;
  callback?: (res: Awaited<TReturn>) => void;
}
/**
 * Custom hook to throttle API calls, ensuring that multiple calls
 * are not made concurrently. Only one call is allowed to run at a time.
 *
 * @template T - Type of the API call function.
 *
 * @param {UseApiThrottleProps<T>} props - Properties object for configuring the hook.
 * @param {T} props.fn - The API function to call, which returns a Promise.
 * @param {(res: Awaited<ReturnType<T>>) => void} [props.callback] - Optional callback to handle the result of the API call.
 *
 * @returns {Object} - The hook returns an object containing:
 *  - `fetching`: A boolean that indicates whether the API call is currently being made.
 *  - `fn`: A throttled version of the provided API function.
 *
 */
const useApiThrottle = <TArgs extends unknown[], TReturn>(
  props: UseApiThrottleProps<TArgs, TReturn>
) => {
  const { fn, callback } = props;
  const fetchingRef = useRef(false);
  const [fetching, setFetching] = useState(false);
  const wrapperfn = useCallback(
    async (...args: TArgs) => {
      if (fetchingRef.current) {
        return Promise.reject(new Error("Already fetching"));
      }
      fetchingRef.current = true;
      setFetching(true);
      try {
        const result = await fn(...args);
        if (callback) {
          callback(result);
        }
      } finally {
        setFetching(false);
        fetchingRef.current = false;
      }
    },
    [fn, callback]
  );
  return { fetching, fn: wrapperfn };
};
export default useApiThrottle;
