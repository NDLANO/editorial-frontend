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
  NotionDialogLicenses,
  NotionDialogText,
} from '@ndla/notion';
import { Concept as ConceptType } from '../SlateEditor/editorTypes';
import { getSrcSets } from '../../util/imageEditorUtil';

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
  concept: ConceptType;
}

const Concept: FC<Props & tType> = ({ concept }) => {
  const markdown = new Remarkable({ breaks: true });

  const renderMarkdown = (text: string) => {
    const rendered = markdown.render(text);
    return (
      <>
        <span dangerouslySetInnerHTML={{ __html: rendered }} />
      </>
    );
  };

  const VisualElement = () => {
    const visualElement = concept.visualElement;
    switch (visualElement?.resource) {
      case 'image':
        const srcSet = getSrcSets(visualElement.resource_id, visualElement);
        return (
          <img
            alt={visualElement?.alt}
            src={visualElement?.url}
            srcSet={srcSet}
          />
        );
      case 'video':
      case 'brightcove':
      case 'external':
      case 'h5p':
        return (
          <iframe
            title={visualElement?.title}
            src={visualElement?.url}
            frameBorder="0"
            scrolling="no"
            height={400}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <NotionHeaderWithoutExitButton
        title={concept.title}
        subtitle={concept.metaDescription}
      />
      <StyledBody>
        <NotionDialogContent>
          <VisualElement />
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
