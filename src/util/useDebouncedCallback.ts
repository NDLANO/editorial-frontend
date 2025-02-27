/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { debounce } from "lodash-es";
import { useCallback, useEffect, useRef } from "react";
import { SAVE_DEBOUNCE_MS } from "../constants";

// Hook to debounce a function while ensuring cleanup on unmount
export const useDebouncedCallback = (callback: (...args: any) => any, delay = SAVE_DEBOUNCE_MS) => {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback; // Ensure latest callback is used
  }, [callback]);

  const debouncedFn = useRef(debounce((...args) => callbackRef.current(...args), delay)).current;

  useEffect(() => {
    return () => debouncedFn.cancel(); // Flush pending updates on unmount
  }, [debouncedFn]);

  return useCallback((...args: any) => debouncedFn(...args), [debouncedFn]);
};
