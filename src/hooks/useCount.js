import { useEffect, useState } from "react";

export function useCountUp(target, start) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const duration = 1200;
    const increment = target / (duration / 16);

    function update() {
      current += increment;
      if (current < target) {
        setCount(Math.floor(current));
        requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(update);
  }, [target, start]);

  return count;
}
