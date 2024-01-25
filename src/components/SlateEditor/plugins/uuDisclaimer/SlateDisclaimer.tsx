/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Element, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import styled from '@emotion/styled';
import { UuDisclaimerMetaData } from '@ndla/types-embed';
import { UuDisclaimerEmbed } from '@ndla/ui';
import { DisclaimerElement, TYPE_DISCLAIMER } from './types';
import { useDisclaimerMeta } from '../../../../modules/embed/queries';

interface Props {
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
  editor: Editor;
  element: DisclaimerElement;
}

const DisclaimerBlock = styled.div`
  border: 1px solid black;
  height: 70px:
  width: 50px;
`;

const SlateDisclaimer = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();

  const disclaimerMetaQuery = useDisclaimerMeta(element.data?.path!, element.data?.url!, {
    enabled: !!element.data?.path,
  });

  const embed: UuDisclaimerMetaData | undefined = useMemo(
    () =>
      element.data
        ? {
            status: !!disclaimerMetaQuery.error || !disclaimerMetaQuery.data ? 'error' : 'success',
            data: disclaimerMetaQuery.data!,
            embedData: element.data,
            resource: 'h5p',
          }
        : undefined,
    [disclaimerMetaQuery.data, disclaimerMetaQuery.error, element.data],
  );

  const onRemove = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_DISCLAIMER,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  return (
    <UuDisclaimerEmbed data-testid="slate-disclaimer" embed={element.data}>
      {children}
    </UuDisclaimerEmbed>
  );

  // return (
  //   <UuDisclaimerEmbed  {...attributes} data-testid="slate-disclaimer">
  //     {children}
  //   </UuDisclaimerEmbed>
  // );
};

export default SlateDisclaimer;
