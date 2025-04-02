/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef, ComponentProps } from "react";

interface Props extends ComponentProps<"span"> {
  innerHTML: string;
}

const MathML = ({ innerHTML, onDoubleClick, children, ...rest }: Props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!window.MathJax || !ref.current) return;

    ref.current.innerHTML = innerHTML;
    window.MathJax.typesetPromise([ref.current]);
    return () => {
      window.MathJax.typesetClear();
    };
  }, [innerHTML]);

  return <span ref={ref} data-testid="math" onDoubleClick={onDoubleClick} {...rest} />;
};

export default MathML;
