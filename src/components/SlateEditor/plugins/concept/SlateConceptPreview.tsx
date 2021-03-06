/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Remarkable } from 'remarkable';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/editor';
import { Link as LinkIcon } from '@ndla/icons/common';
import { injectT, tType } from '@ndla/i18n';
import { NotionDialogContent, NotionDialogText, NotionDialogLicenses } from '@ndla/notion';
import Tooltip from '@ndla/tooltip';
import { addShowConceptDefinitionClickListeners } from '@ndla/article-scripts';
import { ConceptType } from '../../../../interfaces';
import IconButton from '../../../IconButton';
import { getSrcSets } from '../../../../util/imageEditorUtil';
import { getYoutubeEmbedUrl } from '../../../../util/videoUtil';
import config from '../../../../config';

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

const SlateConceptPreview = ({ concept, handleRemove, id, t }: Props & tType) => {
  useEffect(() => {
    addShowConceptDefinitionClickListeners();
  }, []);

  const markdown = new Remarkable({ breaks: true });
  markdown.inline.ruler.enable(['sub', 'sup']);

  const VisualElement = () => {
    const visualElement = concept.parsedVisualElement;
    switch (visualElement?.resource) {
      case 'image':
        const srcSet = getSrcSets(visualElement.resource_id, visualElement);
        return <img alt={visualElement?.alt} src={visualElement?.url} srcSet={srcSet} />;
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
            src={`https://players.brightcove.net/${config.brightCoveAccountId}/${config.brightcovePlayerId}_default/index.html?videoId=${visualElement?.videoid}`}
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
  };

  return (
    <>
      <NotionDialogContent>
        <VisualElement />
        <NotionDialogText>
          <span
            dangerouslySetInnerHTML={{
              __html: markdown.render(concept.content),
            }}
          />
        </NotionDialogText>
      </NotionDialogContent>
      <NotionDialogLicenses
        license={concept.copyright?.license?.license}
        source={concept.source}
        authors={concept.copyright?.creators.map(creator => creator.name)}
      />

      <StyledFigureButtons>
        <Tooltip tooltip={t('form.concept.removeConcept')} align="right">
          <IconButton color="red" type="button" onClick={handleRemove} tabIndex={-1}>
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
