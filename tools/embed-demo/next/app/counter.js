'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button type="button" className="host-counter" onClick={() => setCount((c) => c + 1)}>
      React state: {count}
    </button>
  );
}
