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
import { colors, spacing } from '@ndla/core';
import { UuDisclaimerMetaData } from '@ndla/types-embed';
import { UuDisclaimerEmbed } from '@ndla/ui';
import { DisclaimerElement, TYPE_DISCLAIMER } from './types';
import { useDisclaimerMeta } from '../../../../modules/embed/queries';
import DeleteButton from '../../../DeleteButton';

interface Props {
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
  editor: Editor;
  element: DisclaimerElement;
}

const DisclaimerBlockContent = styled.div`
  border: 1px solid ${colors.brand.primary};
  margin-top: ${spacing.small};
  padding: ${spacing.small};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: -${spacing.large};
`;

const SlateDisclaimer = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();

  const disclaimerMetaQuery = useDisclaimerMeta();

  // const disclaimerMetaQuery = useDisclaimerMeta(element.data?.path!, element.data?.url!, {
  //   enabled: !!element.data?.path,
  // });

  const embed: UuDisclaimerMetaData | undefined = useMemo(
    () =>
      element.data
        ? {
            status: !!disclaimerMetaQuery.error || !disclaimerMetaQuery.data ? 'error' : 'success',
            data: disclaimerMetaQuery.data!,
            embedData: { ...element.data, disclaimer: element.data?.disclaimer },
            resource: element.data?.resource,
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
    <div {...attributes}>
      <ButtonContainer>
        <DeleteButton aria-label={t('delete')} data-testid="remove-disclaimer" onClick={onRemove} />
      </ButtonContainer>
      <UuDisclaimerEmbed
        data-testid="slate-disclaimer"
        embed={
          embed ?? {
            status: 'success',
            resource: 'uu-disclaimer',
            embedData: { ...element.data, disclaimer: 'This is a disclaimer' },
            data: {},
          }
        }
      >
        <DisclaimerBlockContent>{children}</DisclaimerBlockContent>
      </UuDisclaimerEmbed>
    </div>
  );
};

export default SlateDisclaimer;
