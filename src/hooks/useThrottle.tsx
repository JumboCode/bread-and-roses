import { useRef, useState } from "react";

function useThrottle(fn: Function) {
  const [loading, setLoading] = useState(false);
  const ref = useRef<Function | null>(null);

  const throttledFn = (...args: any) => {
    if (loading) return;
    setLoading(true);
    if (ref.current == null) {
      ref.current = fn;
      fn(...args);
      ref.current = null;
      setLoading(false);
    }
  };
  return throttledFn;
}
