/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useEffect, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Remarkable } from 'remarkable';
import {
  NotionDialogContent,
  NotionHeaderWithoutExitButton,
  NotionDialogLicenses,
  NotionDialogText,
  NotionDialogImage,
} from '@ndla/notion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { VisualElement } from '../../interfaces';
import { Concept as ConceptType } from '../SlateEditor/editorTypes';
import { parseEmbedTag } from '../../util/embedTagHelpers';
import { fetchImage } from '../../modules/image/imageApi';
import config from '../../config';
import { imageToVisualElement } from '../../util/visualElementHelper';
import { getYoutubeEmbedUrl } from '../../util/videoUtil';

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
  const [visualElement, setVisualElement] = useState<VisualElement | undefined>(
    undefined,
  );
  const markdown = new Remarkable({ breaks: true });

  useEffect(() => {
    getVisualElement();
  }, []);

  const renderMarkdown = (text: string) => {
    const rendered = markdown.render(text);
    return (
      <>
        <span dangerouslySetInnerHTML={{ __html: rendered }} />
      </>
    );
  };

  const getVisualElement = async () => {
    const embedTag = parseEmbedTag(concept.visualElement);
    switch (embedTag?.resource) {
      case 'image':
        const image = await fetchImage(embedTag.resource_id);
        setVisualElement(imageToVisualElement(image));
        break;
      case 'video':
      case 'brightcove':
        setVisualElement({
          ...embedTag,
          url: `https://players.brightcove.net/${config.brightCoveAccountId}/${config.brightcovePlayerId}_default/index.html?videoId=${embedTag?.videoid}`,
        });
        break;
      case 'external':
        setVisualElement({
          ...embedTag,
          url: embedTag?.url?.includes('youtube')
            ? getYoutubeEmbedUrl(embedTag?.url)
            : embedTag?.url,
        });
        break;
      case 'h5p':
        setVisualElement({
          ...embedTag,
          url: embedTag?.url
            ? embedTag.url
            : `${config.h5pApiUrl}${embedTag?.path}`,
        });
        break;
      default:
        setVisualElement(undefined);
        break;
    }
  };

  const VisualElement = () => {
    switch (visualElement?.resource) {
      case 'image':
        return (
          <NotionDialogImage
            alt={visualElement?.alt}
            src={visualElement?.url}
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
            width={600}
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
