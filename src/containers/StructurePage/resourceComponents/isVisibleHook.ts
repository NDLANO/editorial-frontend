/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef, useState, type RefObject } from "react";

export const scrollElementId = "resource-wrapper-id";

// A hook used to check if an element is visible in the viewport, does not trigger while scrolling
export const useElementIsVisible = (ref: RefObject<HTMLElement | null>, enable: boolean) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const isScrolling = useIsElementScrolling(scrollElementId, enable);

  useEffect(() => {
    if (!enable || isScrolling || !ref.current) return;

    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, isScrolling, enable]);

  return isIntersecting;
};

const useIsElementScrolling = (id: string, enable: boolean) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enable) return;
    const el = document.getElementById(id);
    if (!el) return;

    const onScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [isScrolling, enable, id]);

  return isScrolling;
};
