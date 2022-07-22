/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useState, MouseEvent } from 'react';
import styled from '@emotion/styled';
import { RenderElementProps } from 'slate-react';
import Button from '@ndla/button';
import { Figure } from '@ndla/ui';
import { parseMarkdown } from '@ndla/util';
import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import SafeLink from '@ndla/safelink';
import { isNumeric } from '../../../validators';
import FigureButtons from './FigureButtons';
import EditVideo from './EditVideo';
import IconButton from '../../../IconButton';
import { fetchBrightcoveVideo } from '../../../../modules/video/brightcoveApi';
import {
  addBrightCoveTimeStampVideoid,
  getBrightCoveStartTime,
  getYoutubeEmbedUrl,
} from '../../../../util/videoUtil';
import { ExternalEmbed, BrightcoveEmbed } from '../../../../interfaces';

const StyledVideo = styled.iframe`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
`;

interface Props {
  attributes: RenderElementProps['attributes'];
  embed: BrightcoveEmbed | ExternalEmbed;
  language: string;
  onRemoveClick: (event: MouseEvent) => void;
  saveEmbedUpdates: (change: { [x: string]: string }) => void;
  active: boolean;
  isSelectedForCopy: boolean;
  children: ReactNode;
}

const isBrightcove = (
  embed: BrightcoveEmbed | ExternalEmbed | undefined,
): embed is BrightcoveEmbed => {
  return !!embed && 'videoid' in embed;
};

interface StyledFigureProps {
  showOutline: boolean;
}

const StyledFigure = styled(Figure)<StyledFigureProps>`
  padding-top: 57%;
  position: relative;

  box-shadow: ${props => props.showOutline && 'rgb(32, 88, 143) 0 0 0 2px'};
`;

const StyledDiv = styled.div`
  p {
    margin: 0;
  }
`;

const SlateVideo = ({
  attributes,
  embed,
  language,
  onRemoveClick,
  saveEmbedUpdates,
  active,
  isSelectedForCopy,
  children,
}: Props) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const showCopyOutline = isSelectedForCopy && (!editMode || !active);
  const [showLinkedVideo, setShowLinkedVideo] = useState(false);

  const [linkedVideoId, setLinkedVideoId] = useState<string | undefined>();
  useEffect(() => {
    if (!isBrightcove(embed)) {
      return;
    }
    const idWithoutTimestamp = embed.videoid?.split('&')[0];

    fetchBrightcoveVideo(idWithoutTimestamp).then(v => {
      if (isNumeric(v.link?.text)) {
        setLinkedVideoId(v.link?.text);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(embed as BrightcoveEmbed).videoid]);

  const getUrl = (getLinkedVideo: boolean) => {
    if (embed.resource === 'brightcove') {
      const { account, videoid, player = 'default' } = embed;

      const startTime = getBrightCoveStartTime(videoid);
      const id =
        getLinkedVideo && linkedVideoId
          ? addBrightCoveTimeStampVideoid(linkedVideoId, startTime)
          : videoid;
      return `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${id}`;
    } else if (embed.resource === 'external') {
      const { url } = embed;
      return url.includes('embed') ? url : getYoutubeEmbedUrl(url);
    }
    return '';
  };

  const toggleEditModus = () => {
    setEditMode(!editMode);
  };

  const switchEmbedSource = () => {
    if (!isBrightcove(embed)) {
      return;
    } else if (linkedVideoId) {
      setShowLinkedVideo(prev => !prev);
    } else {
      setShowLinkedVideo(false);
    }
  };

  return (
    <div className="c-figure" draggable="true" {...attributes}>
      <FigureButtons
        tooltip={t('form.video.remove')}
        onRemoveClick={onRemoveClick}
        embed={embed}
        onEdit={toggleEditModus}
        figureType="video"
        language={language}>
        {linkedVideoId && (
          <Tooltip
            tooltip={
              showLinkedVideo ? t('form.video.fromLinkedVideo') : t('form.video.toLinkedVideo')
            }>
            <IconButton as={SafeLink} onClick={switchEmbedSource} to="">
              {t('form.video.linkedVideoButton')}
            </IconButton>
          </Tooltip>
        )}
      </FigureButtons>
      {editMode ? (
        <EditVideo
          embed={embed}
          toggleEditModus={toggleEditModus}
          src={getUrl(false)}
          activeSrc={getUrl(showLinkedVideo)}
          saveEmbedUpdates={saveEmbedUpdates}
        />
      ) : (
        <div contentEditable={false}>
          <StyledFigure
            id={'videoid' in embed ? embed.videoid : embed.url}
            resizeIframe
            showOutline={showCopyOutline}>
            <StyledVideo
              title={`Video: ${embed?.metaData?.name || ''}`}
              frameBorder="0"
              src={getUrl(showLinkedVideo)}
              allowFullScreen
            />
          </StyledFigure>
          <Button stripped width="full" onClick={toggleEditModus}>
            <figcaption className="c-figure__caption">
              <StyledDiv className="c-figure__info">{parseMarkdown(embed.caption || '')}</StyledDiv>
            </figcaption>
          </Button>
        </div>
      )}
      {children}
    </div>
  );
};

export default SlateVideo;
