/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import { Link as LinkIcon } from '@ndla/icons/common';
import { injectT, tType } from '@ndla/i18n';
import {
  NotionDialogContent,
  NotionDialogText,
  NotionDialogLicenses,
} from '@ndla/notion';
import Tooltip from '@ndla/tooltip';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';
import { Concept as ConceptType } from '../../editorTypes';
import IconButton from '../../../IconButton';

const StyledFigureButtons = styled('span')`
  position: absolute;
  top: 0;
  z-index: 1;
  right: -${spacing.spacingUnit * 1.5}px;
  margin-right: 40px;
  margin-top: ${spacing.xsmall};

  > * {
    margin-bottom: ${spacing.xsmall};
  }
`;

interface Props {
  concept: ConceptType;
  handleRemove: () => void;
  id: number;
}

const SlateConceptPreview: FC<Props & tType> = ({
  concept,
  handleRemove,
  id,
  t,
}) => {
  useEffect(() => {
    addShowConceptDefinitionClickListeners();
  }, []);

  return (
    <>
      <NotionDialogContent>
        <NotionDialogText>{concept.content}</NotionDialogText>
      </NotionDialogContent>
      <NotionDialogLicenses
        license={concept.copyright?.license?.license}
        source={concept.source}
        authors={concept.copyright?.creators.map(creator => creator.name)}
      />

      <StyledFigureButtons>
        <Tooltip tooltip={t('form.concept.removeConcept')} align="right">
          <IconButton
            color="red"
            type="button"
            onClick={handleRemove}
            tabIndex={-1}>
            <DeleteForever />
          </IconButton>
        </Tooltip>
        <Tooltip tooltip={t('form.concept.edit')} align="right">
          <IconButton
            as={Link}
            to={`/concept/${id}/edit/${concept.language}`}
            target="_blank"
            title={t('form.concept.edit')}
            tabIndex={-1}>
            <LinkIcon />
          </IconButton>
        </Tooltip>
      </StyledFigureButtons>
    </>
  );
};

export default injectT(SlateConceptPreview);
