/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import { injectT, tType } from '@ndla/i18n';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Remarkable } from 'remarkable';
import {
  NotionDialogContent,
  NotionHeaderWithoutExitButton,
  NotionDialogImage,
  NotionDialogLicenses,
  NotionDialogText,
} from '@ndla/notion';
import { TranslateType } from '../../interfaces';
import { Concept as ConceptType } from '../SlateEditor/editorTypes';

const StyledBody = styled.div`
  margin: 0 ${spacing.normal} ${spacing.small};
  .c-tabs {
    margin-left: 0;
    margin-right: 0;
  }
  .react-tabs__tab-panel--selected {
    animation-name: fadeInLeft;
    animation-duration: 500ms;
  }
`;

interface Props {
  t: TranslateType;
  concept: ConceptType;
  image:
    | {
        url: string;
        alt: string;
      }
    | undefined;
}

const Concept: FC<Props & tType> = ({ t, concept, image }) => {
  const markdown = new Remarkable({ breaks: true });

  const renderMarkdown = (text: string) => {
    const rendered = markdown.render(text);
    return (
      <>
        <span dangerouslySetInnerHTML={{ __html: rendered }} />
      </>
    );
  };

  return (
    <>
      <NotionHeaderWithoutExitButton
        title={concept.title}
        subtitle={concept.metaDescription}
      />
      <StyledBody>
        <NotionDialogContent>
          {image ? <NotionDialogImage src={image.url} alt={image.alt} /> : null}
          <NotionDialogText>{renderMarkdown(concept.content)}</NotionDialogText>
        </NotionDialogContent>
        <NotionDialogLicenses
          license={concept.copyright?.license?.license}
          source={concept.source}
          authors={concept.copyright?.creators.map(creator => creator.name)}
        />
      </StyledBody>
    </>
  );
};

export default injectT(Concept);
