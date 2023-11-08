/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactEditor, RenderElementProps, useSelected } from 'slate-react';
import { Editor, Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { spacing, colors } from '@ndla/core';
import { H5pMetaData } from '@ndla/types-embed';
import styled from '@emotion/styled';
import { H5pEmbed } from '@ndla/ui';
import { DeleteForever } from '@ndla/icons/editor';
import { Spinner } from '@ndla/icons';
import { H5pElement } from './types';
import { useH5pMeta } from '../../../../modules/embed/queries';
import { StyledDeleteEmbedButton, StyledFigureButtons } from '../embed/FigureButtons';
import EditH5PModal from './EditH5PModal';
import EditMetadataModal from './EditMetadataModal';

interface Props extends RenderElementProps {
  element: H5pElement;
  editor: Editor;
  language: string;
}

const H5pWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  > div {
    width: 100%;
  }
  &[data-selected='true'] {
    figure {
      outline: 2px solid ${colors.brand.primary};
    }
  }
`;

const FigureButtons = styled(StyledFigureButtons)`
  right: ${spacing.small};
  top: ${spacing.medium};
  z-index: 1;
`;

const SlateH5p = ({ element, editor, attributes, language, children }: Props) => {
  const { t } = useTranslation();
  const isSelected = useSelected();

  const h5pMetaQuery = useH5pMeta(element.data?.path!, element.data?.url!, {
    enabled: !!element.data?.path,
  });
  const embed: H5pMetaData | undefined = useMemo(
    () =>
      element.data
        ? {
            status: !!h5pMetaQuery.error || !h5pMetaQuery.data ? 'error' : 'success',
            data: h5pMetaQuery.data!,
            embedData: element.data,
            resource: 'h5p',
          }
        : undefined,
    [h5pMetaQuery.data, h5pMetaQuery.error, element.data],
  );

  const handleRemove = () => {
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

  return (
    <H5pWrapper {...attributes} data-selected={isSelected}>
      <div contentEditable={false}>
        <FigureButtons>
          <EditMetadataModal embed={embed} editor={editor} element={element} />
          <EditH5PModal embed={embed} language={language} editor={editor} element={element} />
          <StyledDeleteEmbedButton
            title={t('form.h5p.remove')}
            aria-label={t('form.h5p.remove')}
            colorTheme="danger"
            onClick={handleRemove}
            data-testid="remove-h5p-element"
          >
            <DeleteForever />
          </StyledDeleteEmbedButton>
        </FigureButtons>
        {h5pMetaQuery.isLoading || !embed ? <Spinner /> : <H5pEmbed embed={embed} />}
      </div>
      {children}
    </H5pWrapper>
  );
};

export default SlateH5p;
