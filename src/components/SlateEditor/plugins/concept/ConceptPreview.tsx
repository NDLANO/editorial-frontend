/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useEffect } from 'react';
import { css } from '@emotion/core';
import { injectT, tType } from '@ndla/i18n';
import {
  NotionDialogContent,
  NotionDialogText,
  NotionDialogLicenses,
  NotionDialogWrapper,
  NotionHeaderWithoutExitButton,
} from '@ndla/notion';
import { Concept as ConceptType } from '../../editorTypes';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';

interface Props {
  concept: ConceptType;
  handleRemove: Function; // TODO: hvordan ser funksjonen ut
  id: number;
  isOpen: boolean;
  onClose: Function; // TODO: hvordan ser funksjonen ut
  locale: string;
}

const ConceptPreview: FC<Props & tType> = ({
  concept,
  handleRemove,
  id,
  isOpen,
  onClose,
  locale,
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
    </>
  );
};

export default injectT(ConceptPreview);
