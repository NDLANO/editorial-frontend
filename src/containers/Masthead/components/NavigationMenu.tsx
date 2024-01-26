/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { colors, spacing, stackOrder } from "@ndla/core";
import { List } from "@ndla/icons/action";
import { Launch, Audio, Podcast } from "@ndla/icons/common";
import { Camera, CloudUploadOutline, Concept, Globe, H5P, Taxonomy, Video } from "@ndla/icons/editor";
import { ContentTypeBadge, constants } from "@ndla/ui";
import { styledListElement } from "../../../components/StyledListElement/StyledListElement";
import config from "../../../config";
import { AUDIO_ADMIN_SCOPE, DRAFT_ADMIN_SCOPE, FRONTPAGE_ADMIN_SCOPE, TAXONOMY_ADMIN_SCOPE } from "../../../constants";
import {
  toCreateConcept,
  toCreateImage,
  toCreateAudioFile,
  toCreatePodcastFile,
  toCreatePodcastSeries,
  toEditNdlaFilm,
  toCreateFrontPageArticle,
  toCreateGloss,
} from "../../../util/routeHelpers";
import { useSession } from "../../Session/SessionProvider";

const StyledMenuItem = styled.span`
  display: flex;
  gap: ${spacing.xxsmall};
  align-items: center;
`;

const ContentWrapper = styled.div`
  padding: ${spacing.large} 0;
  position: absolute;
  z-index: ${stackOrder.banner};
  left: 0;
  right: 0;
  background: ${colors.white};
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  max-width: 660px;
  margin: 0 auto;
`;

interface Props {
  close: () => void;
}

const OpenMenu = ({ close }: Props) => {
  const { t } = useTranslation();
  const { contentTypes } = constants;
  const { userPermissions } = useSession();

  return (
    <ContentWrapper>
      <StyledNav>
        <div>
          <Link css={styledListElement} to={toCreateConcept()} onClick={close}>
            <StyledMenuItem>
              <Concept /> {t("subNavigation.newConcept")}
            </StyledMenuItem>
          </Link>
          <Link css={styledListElement} to={toCreateGloss()} onClick={close}>
            <StyledMenuItem>
              <Globe /> {t("subNavigation.newGloss")}
            </StyledMenuItem>
          </Link>
          <Link css={styledListElement} to={toCreateImage()} onClick={close}>
            <StyledMenuItem>
              <Camera />
              {t("subNavigation.image")}
            </StyledMenuItem>
          </Link>
          <Link css={styledListElement} to={toCreateAudioFile()} onClick={close}>
            <StyledMenuItem>
              <Audio />
              {t("subNavigation.audio")}
            </StyledMenuItem>
          </Link>
          <Link css={styledListElement} to={toCreatePodcastFile()} onClick={close}>
            <StyledMenuItem>
              <Podcast />
              {t("subNavigation.podcast")}
            </StyledMenuItem>
          </Link>
          {userPermissions?.includes(AUDIO_ADMIN_SCOPE) && (
            <Link css={styledListElement} to={toCreatePodcastSeries()} onClick={close}>
              <StyledMenuItem>
                <List />
                {t("subNavigation.podcastSeries")}
              </StyledMenuItem>
            </Link>
          )}
          <Link css={styledListElement} to={toCreateFrontPageArticle()} onClick={close}>
            <StyledMenuItem>
              <ContentTypeBadge type={contentTypes.SUBJECT_MATERIAL} background size="xx-small" />
              {t("subNavigation.newFrontpageArticle")}
            </StyledMenuItem>
          </Link>
          <Link css={styledListElement} to={toEditNdlaFilm()} onClick={close}>
            <StyledMenuItem>
              <ContentTypeBadge type={contentTypes.SUBJECT} background size="xx-small" />
              {t("subNavigation.film")}
            </StyledMenuItem>
          </Link>
        </div>
        <div>
          <Link css={styledListElement} to="/structure" onClick={close}>
            <StyledMenuItem>
              <Taxonomy />
              {t("subNavigation.structure")}
            </StyledMenuItem>
          </Link>
          {userPermissions?.includes(TAXONOMY_ADMIN_SCOPE) && (
            <Link css={styledListElement} to="/programme" onClick={close}>
              <StyledMenuItem>
                <Taxonomy />
                {t("subNavigation.programme")}
              </StyledMenuItem>
            </Link>
          )}
          {userPermissions?.includes(TAXONOMY_ADMIN_SCOPE) && (
            <Link css={styledListElement} to="/taxonomyVersions" onClick={close}>
              <StyledMenuItem>
                <Taxonomy />
                {t("subNavigation.taxonomyVersions")}
              </StyledMenuItem>
            </Link>
          )}
          <Link css={styledListElement} to="publishRequests" onClick={close}>
            <StyledMenuItem>
              <CloudUploadOutline />
              {t("subNavigation.publishRequests")}
            </StyledMenuItem>
          </Link>

          <Link css={styledListElement} to="/h5p" onClick={close}>
            <StyledMenuItem>
              <H5P />
              {t("subNavigation.h5p")}
            </StyledMenuItem>
          </Link>
          {userPermissions?.includes(FRONTPAGE_ADMIN_SCOPE) && (
            <Link css={styledListElement} to="/frontpage" onClick={close}>
              <StyledMenuItem>
                <ContentTypeBadge type={contentTypes.SUBJECT} background size="xx-small" />
                {t("subNavigation.frontpage")}
              </StyledMenuItem>
            </Link>
          )}
          {userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
            <a
              css={styledListElement}
              href={config.brightcoveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              <StyledMenuItem>
                <Video />
                {t("subNavigation.brightcoveLink")}
                <Launch />
              </StyledMenuItem>
            </a>
          )}
          <a
            css={styledListElement}
            href={config.learningpathFrontendDomain}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            <StyledMenuItem>
              <ContentTypeBadge type={contentTypes.LEARNING_PATH} background size="xx-small" />
              {t("subNavigation.learningPathLink")}
              <Launch />
            </StyledMenuItem>
          </a>
        </div>
      </StyledNav>
    </ContentWrapper>
  );
};

export default OpenMenu;
