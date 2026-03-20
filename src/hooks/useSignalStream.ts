import { useState } from 'react';

export function useSignalStream() {
  const [status] = useState<'live' | 'polling' | 'offline'>('polling');

  // SSE disabled to avoid localhost errors in production
  return { status };
}
