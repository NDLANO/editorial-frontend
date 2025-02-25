/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { Editor } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { MathmlElement } from "./mathTypes";
import { getInfoFromNode } from "./utils";

interface Props {
  element: MathmlElement;
}

const clearMathjax = (editor: Editor, element: MathmlElement) => {
  const { MathJax } = window;
  const node = ReactEditor.toDOMNode(editor, element);
  if (MathJax && node) {
    MathJax.typesetClear([node]);
  }
};

const MathML = ({ element }: Props) => {
  const [reRender, setReRender] = useState(false);
  const [mathjaxInitialized, setMathjaxInitialized] = useState(true);
  const editor = useSlate();

  const mounted = useRef(false);

  const nodeInfo = useMemo(() => {
    return getInfoFromNode(element);
  }, [element]);

  useEffect(() => {
    if (!mounted.current) {
      // Mathml can sometimes be re-mounted. Usually caused itself or nearby elements being moved.
      // If editor already has fully formatted all Mathjax, we must make sure the re-mounted node is formatted again.
      if (editor.mathjaxInitialized) {
        clearMathjax(editor, element);
        setMathjaxInitialized(false);
      }
      mounted.current = true;
    } else {
      clearMathjax(editor, element);
      // Note: a small delay before a 're-render" is required in order to
      // get the MathJax script to render correctly after editing the MathML
      setReRender(true);
      setTimeout(() => {
        setReRender(false);
        setMathjaxInitialized(false);
      }, 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeInfo.model.innerHTML]);

  useEffect(() => {
    if (mathjaxInitialized) {
      return;
    }
    const { MathJax } = window;
    const node = ReactEditor.toDOMNode(editor, element);
    if (MathJax && node) {
      MathJax.typeset([node]);
      setMathjaxInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mathjaxInitialized]);

  if (reRender) {
    return null;
  }

  return (
    <span data-testid="math">
      {/* @ts-expect-error math does not exist in JSX, but this hack works by setting innerHTML manually. */}
      <math
        // eslint-disable-next-line react/no-unknown-property
        xlmns={nodeInfo.model.xlmns}
        dangerouslySetInnerHTML={{
          __html: nodeInfo.model.innerHTML,
        }}
      />
    </span>
  );
};

export default MathML;
