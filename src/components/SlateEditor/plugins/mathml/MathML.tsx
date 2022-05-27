/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useState, useEffect, useRef } from 'react';
import { Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import { MathmlElement } from '.';

interface Props {
  model: {
    xlmns: string;
    innerHTML: string;
  };
  editor: Editor;
  element: MathmlElement;
}

const StyledSpan = styled.span`
  mjx-stretchy-v > mjx-ext > mjx-c {
    transform: scaleY(200) translateY(0.075em);
  }
`;

const clearMathjax = (editor: Editor, element: MathmlElement) => {
  const { MathJax } = window;
  const node = ReactEditor.toDOMNode(editor, element);
  if (MathJax && node) {
    MathJax.typesetClear([node]);
  }
};

const MathML = ({ model, element, editor }: Props) => {
  const [reRender, setReRender] = useState(false);
  const [mathjaxInitialized, setMathjaxInitialized] = useState(true);

  const mounted = useRef(false);

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
  }, [model.innerHTML]);

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
    <StyledSpan data-cy="math">
      {/* @ts-ignore math does not exist in JSX, but this hack works by setting innerHTML manually. */}
      <math
        xlmns={model.xlmns}
        dangerouslySetInnerHTML={{
          __html: model.innerHTML,
        }}
      />
    </StyledSpan>
  );
};

export default MathML;
