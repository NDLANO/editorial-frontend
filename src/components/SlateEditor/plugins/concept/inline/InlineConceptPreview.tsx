/*
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Remarkable } from 'remarkable';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import { Link as LinkIcon } from '@ndla/icons/common';
import { ImageLink } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { IConcept } from '@ndla/types-backend/concept-api';
import { NotionDialogContent, NotionDialogText, NotionDialogLicenses } from '@ndla/notion';
import Tooltip from '@ndla/tooltip';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';
import IconButton from '../../../../IconButton';
import { getSrcSets } from '../../../../../util/imageEditorUtil';
import { getYoutubeEmbedUrl } from '../../../../../util/videoUtil';
import { parseEmbedTag } from '../../../../../util/embedTagHelpers';
import config from '../../../../../config';
import { Embed } from '../../../../../interfaces';

const StyledFigureButtons = styled('span')<{ isBlockView?: boolean }>`
  position: absolute;
  top: 0;
  z-index: 1;
  right: 0;
  ${(p) => (p.isBlockView ? 'transform: translateX(100%);' : '')}
  margin-top: ${spacing.xsmall};
  > * {
    margin-bottom: ${spacing.xsmall};
  }
`;

interface Props {
  concept: IConcept;
  isBlockView?: boolean;
  handleRemove: () => void;
  id: number | string;
}
interface ImageWrapperProps {
  children: ReactNode;
  url?: string;
}

const ImageWrapper = ({ children, url }: ImageWrapperProps) =>
  url ? <ImageLink src={url}>{children}</ImageLink> : <>{children}</>;

const InlineConceptPreview = ({ concept, handleRemove, id, isBlockView }: Props) => {
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
        const wrapperUrl = `${config.ndlaApiUrl}/image-api/raw/id/${visualElement.resourceId}`;
        const srcSet = getSrcSets(visualElement.resourceId, visualElement);
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

      <StyledFigureButtons isBlockView={isBlockView}>
        <Tooltip tooltip={t('form.concept.removeConcept')}>
          <div>
            <IconButton color="red" type="button" onClick={handleRemove} tabIndex={-1}>
              <DeleteForever />
            </IconButton>
          </div>
        </Tooltip>
        <Tooltip tooltip={t('form.concept.edit')}>
          <div>
            <IconButton
              as={Link}
              to={`/concept/${id}/edit/${concept.content?.language}`}
              target="_blank"
              tabIndex={-1}
            >
              <LinkIcon />
            </IconButton>
          </div>
        </Tooltip>
      </StyledFigureButtons>
    </>
  );
};

export default InlineConceptPreview;
