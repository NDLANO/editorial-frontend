/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect, useRef } from 'react';
import { RenderElementProps } from 'slate-react';

interface Props {
  attributes: RenderElementProps['attributes'];
  model: {
    xlmns: string;
    innerHTML: string;
  }
}

const MathML = ({ model, attributes }: Props) => {
  const [reRender, setReRender] = useState(false);

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      // Note: a small delay before a 're-render" is required in order to
      // get the MathJax script to render correctly after editing the MathML
      console.log(model.innerHTML)
      setReRender(true);
      setTimeout(() => {
        setReRender(false);
      }, 10);
    }
  }, [model.innerHTML]);

  if (reRender) {
    return null;
  }

  return (
    <span data-cy="math" contentEditable={false} {...attributes}>
      {/* @ts-ignore math does not exist in JSX, but this hack works by setting innerHTML manually. */}
      <math
        xlmns={model.xlmns}
        dangerouslySetInnerHTML={{
          __html: model.innerHTML,
        }}
      />
    </span>
  )
}

export default MathML;