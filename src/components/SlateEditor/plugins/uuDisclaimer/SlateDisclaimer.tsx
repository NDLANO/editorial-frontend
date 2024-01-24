/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { DisclaimerElement } from './types';

interface Props {
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
  editor: Editor;
  element: DisclaimerElement;
}

const SlateDisclaimer = ({ attributes, children }: Props) => {
  const { t } = useTranslation();

  return (
    <div {...attributes} data-testid="slate-disclaimer">
      {children}
    </div>
  );
};

export default SlateDisclaimer;
