/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, ComponentProps, useLayoutEffect, useImperativeHandle } from "react";

export interface MathMLHandle {
  readonly isTypesetting: boolean;
}

interface Props extends Omit<ComponentProps<"span">, "ref"> {
  innerHTML: string;
  ref?: React.Ref<MathMLHandle>;
}

const MathML = ({ innerHTML, children, ref, ...rest }: Props) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const typesetting = useRef(false);

  // Expose live typesetting state via ref so MathEditor can suppress onRequestDismiss events
  // caused by MathJax's async DOM work while this instance is mid-typesetPromise.
  useImperativeHandle(
    ref,
    () => ({
      get isTypesetting() {
        return typesetting.current;
      },
    }),
    [],
  );

  useLayoutEffect(() => {
    const curr = spanRef.current;
    if (!window.MathJax || !curr) return;
    curr.innerHTML = innerHTML;
    typesetting.current = true;
    window.MathJax.typesetPromise([curr]).then(() => {
      typesetting.current = false;
    });
    return () => {
      typesetting.current = false;
      window.MathJax.typesetClear([curr]);
    };
  }, [innerHTML]);

  return <span ref={spanRef} data-testid="math" {...rest} />;
};

export default MathML;
