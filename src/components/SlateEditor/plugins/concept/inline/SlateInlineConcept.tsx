/*
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useMemo } from 'react';
import { Remarkable } from 'remarkable';
import { ImageLink } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { IConcept } from '@ndla/types-backend/concept-api';
import { NotionDialogContent, NotionDialogText, NotionDialogLicenses } from '@ndla/notion';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';
import { getSrcSets } from '../../../../../util/imageEditorUtil';
import { getYoutubeEmbedUrl } from '../../../../../util/videoUtil';
import { parseEmbedTag } from '../../../../../util/embedTagHelpers';
import config from '../../../../../config';
import { Embed } from '../../../../../interfaces';

interface Props {
  concept: IConcept;
  handleRemove: () => void;
}
interface ImageWrapperProps {
  children: ReactNode;
  url?: string;
}

const ImageWrapper = ({ children, url }: ImageWrapperProps) =>
  url ? <ImageLink src={url}>{children}</ImageLink> : <>{children}</>;

const SlateInlineConcept = ({ concept, handleRemove }: Props) => {
  const { t } = useTranslation();
  useEffect(() => {
    addShowConceptDefinitionClickListeners();
  }, []);

  const markdown = new Remarkable({ breaks: true });
  markdown.inline.ruler.enable(['sub', 'sup']);

  const visualElement = useMemo(() => {
    const visualElement: Embed | undefined = parseEmbedTag(concept.visualElement?.visualElement);
    if (!visualElement) return null;
    switch (visualElement?.resource) {
      case 'image': {
        const wrapperUrl = `${config.ndlaApiUrl}/image-api/raw/id/${visualElement.resource_id}`;
        const srcSet = getSrcSets(visualElement.resource_id, visualElement);
        return (
          <ImageWrapper url={wrapperUrl}>
            <img alt={visualElement?.alt} src={visualElement?.url} srcSet={srcSet} />
          </ImageWrapper>
        );
      }
      case 'external':
        return (
          <iframe
            title={visualElement?.title}
            src={
              visualElement?.url?.includes('youtube')
                ? getYoutubeEmbedUrl(visualElement?.url)
                : visualElement?.url
            }
            frameBorder="0"
            scrolling="no"
            height={400}
          />
        );
      case 'brightcove':
        return (
          <iframe
            title={visualElement?.title}
            src={`https://players.brightcove.net/${config.brightcoveAccountId}/${config.brightcoveEdPlayerId}_default/index.html?videoId=${visualElement?.videoid}`}
            frameBorder="0"
            scrolling="no"
            height={400}
          />
        );
      case 'video':
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
  }, [concept.visualElement]);

  return (
    <>
      <NotionDialogContent>
        {visualElement}
        <NotionDialogText>
          <span
            dangerouslySetInnerHTML={{
              __html: markdown.render(concept.content?.content),
            }}
          />
        </NotionDialogText>
      </NotionDialogContent>
      <NotionDialogLicenses
        license={concept.copyright?.license?.license}
        source={
          <span
            dangerouslySetInnerHTML={{
              __html: markdown.render(concept.source),
            }}
          />
        }
        authors={concept.copyright?.creators.map((creator) => creator.name)}
      />
    </>
  );
};

export default SlateInlineConcept;
