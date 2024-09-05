/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, spacing, stackOrder } from "@ndla/core";
import { List } from "@ndla/icons/action";
import { Launch, Audio, Podcast } from "@ndla/icons/common";
import { Camera, Concept, Globe, H5P, Taxonomy, Video } from "@ndla/icons/editor";
import { SafeLinkButton } from "@ndla/safelink";
import { ContentTypeBadge, constants } from "@ndla/ui";
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
  position: relative;
  padding: ${spacing.large} 0;
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

const StyledSafeLinkButton = styled(SafeLinkButton)`
  display: block;
  justify-content: flex-start;
`;

const OpenMenu = ({ close }: Props) => {
  const { t } = useTranslation();
  const { contentTypes } = constants;
  const { userPermissions } = useSession();

  return (
    <ContentWrapper>
      <StyledNav>
        <div>
          <StyledSafeLinkButton variant="tertiary" to={toCreateConcept()} onClick={close}>
            <StyledMenuItem>
              <Concept /> {t("subNavigation.newConcept")}
            </StyledMenuItem>
          </StyledSafeLinkButton>
          <StyledSafeLinkButton variant="tertiary" to={toCreateGloss()} onClick={close}>
            <StyledMenuItem>
              <Globe /> {t("subNavigation.newGloss")}
            </StyledMenuItem>
          </StyledSafeLinkButton>
          <StyledSafeLinkButton variant="tertiary" to={toCreateImage()} onClick={close}>
            <StyledMenuItem>
              <Camera />
              {t("subNavigation.image")}
            </StyledMenuItem>
          </StyledSafeLinkButton>
          <StyledSafeLinkButton variant="tertiary" to={toCreateAudioFile()} onClick={close}>
            <StyledMenuItem>
              <Audio />
              {t("subNavigation.audio")}
            </StyledMenuItem>
          </StyledSafeLinkButton>
          <StyledSafeLinkButton variant="tertiary" to={toCreatePodcastFile()} onClick={close}>
            <StyledMenuItem>
              <Podcast />
              {t("subNavigation.podcast")}
            </StyledMenuItem>
          </StyledSafeLinkButton>
          {userPermissions?.includes(AUDIO_ADMIN_SCOPE) && (
            <StyledSafeLinkButton variant="tertiary" to={toCreatePodcastSeries()} onClick={close}>
              <StyledMenuItem>
                <List />
                {t("subNavigation.podcastSeries")}
              </StyledMenuItem>
            </StyledSafeLinkButton>
          )}
          <StyledSafeLinkButton variant="tertiary" to={toCreateFrontPageArticle()} onClick={close}>
            <StyledMenuItem>
              <ContentTypeBadge type={contentTypes.SUBJECT_MATERIAL} background size="xx-small" />
              {t("subNavigation.newFrontpageArticle")}
            </StyledMenuItem>
          </StyledSafeLinkButton>
          <StyledSafeLinkButton variant="tertiary" to={toEditNdlaFilm()} onClick={close}>
            <StyledMenuItem>
              <ContentTypeBadge type={contentTypes.SUBJECT} background size="xx-small" />
              {t("subNavigation.film")}
            </StyledMenuItem>
          </StyledSafeLinkButton>
        </div>
        <div>
          <StyledSafeLinkButton variant="tertiary" to="/structure" onClick={close}>
            <StyledMenuItem>
              <Taxonomy />
              {t("subNavigation.structure")}
            </StyledMenuItem>
          </StyledSafeLinkButton>
          {userPermissions?.includes(TAXONOMY_ADMIN_SCOPE) && (
            <StyledSafeLinkButton variant="tertiary" to="/programme" onClick={close}>
              <StyledMenuItem>
                <Taxonomy />
                {t("subNavigation.programme")}
              </StyledMenuItem>
            </StyledSafeLinkButton>
          )}
          {userPermissions?.includes(TAXONOMY_ADMIN_SCOPE) && (
            <StyledSafeLinkButton variant="tertiary" to="/taxonomyVersions" onClick={close}>
              <StyledMenuItem>
                <Taxonomy />
                {t("subNavigation.taxonomyVersions")}
              </StyledMenuItem>
            </StyledSafeLinkButton>
          )}
          <StyledSafeLinkButton variant="tertiary" to="/h5p" onClick={close}>
            <StyledMenuItem>
              <H5P />
              {t("subNavigation.h5p")}
            </StyledMenuItem>
          </StyledSafeLinkButton>
          {userPermissions?.includes(FRONTPAGE_ADMIN_SCOPE) && (
            <StyledSafeLinkButton variant="tertiary" to="/frontpage" onClick={close}>
              <StyledMenuItem>
                <ContentTypeBadge type={contentTypes.SUBJECT} background size="xx-small" />
                {t("subNavigation.frontpage")}
              </StyledMenuItem>
            </StyledSafeLinkButton>
          )}
          {userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
            <StyledSafeLinkButton
              variant="tertiary"
              to={config.brightcoveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
            >
              <StyledMenuItem>
                <Video />
                {t("subNavigation.brightcoveLink")}
                <Launch />
              </StyledMenuItem>
            </StyledSafeLinkButton>
          )}
          <StyledSafeLinkButton
            variant="tertiary"
            to={config.learningpathFrontendDomain}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            <StyledMenuItem>
              <ContentTypeBadge type={contentTypes.LEARNING_PATH} background size="xx-small" />
              {t("subNavigation.learningPathLink")}
              <Launch />
            </StyledMenuItem>
          </StyledSafeLinkButton>
        </div>
      </StyledNav>
    </ContentWrapper>
  );
};

export default OpenMenu;
