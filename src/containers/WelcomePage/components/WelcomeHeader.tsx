/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { breakpoints, colors, fonts, mq, spacing, stackOrder } from "@ndla/core";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { Text } from "@ndla/typography";
import { getArticle } from "../../../modules/article/articleApi";
import { fetchAudio } from "../../../modules/audio/audioApi";
import { fetchConcept } from "../../../modules/concept/conceptApi";
import { fetchImage } from "../../../modules/image/imageApi";
import { fetchLearningpath } from "../../../modules/learningpath/learningpathApi";
import { fetchRecentFavorited } from "../../../modules/myndla/myndlaApi";
import { unreachable } from "../../../util/guards";
import {
  toEditArticle,
  toEditAudio,
  toEditConcept,
  toEditImage,
  toEditLearningResource,
} from "../../../util/routeHelpers";
import { useSession } from "../../Session/SessionProvider";

const StyledHeader = styled.div`
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  background-color: ${colors.brand.lighter};
  justify-content: space-evenly;
  padding: ${spacing.xsmall};
  border-radius: 10px;

  ${mq.range({ until: breakpoints.mobileWide, from: "0px" })} {
    flex-direction: column;
    justify-content: center;
    gap: ${spacing.xsmall};
  }

  position: relative;
`;

const ButtonWrapper = styled.div`
  z-index: ${stackOrder.offsetSingle};
`;

const StyledTitle = styled.h1`
  ${fonts.sizes(24, 1.2)};
  color: ${colors.brand.primary};
  margin: 0;
  font-family: ${fonts.sans};
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  font-weight: ${fonts.weight.normal};
  ${fonts.sizes(16, 1.1)};
`;

const shapeStyles = css`
  position: absolute;
  background-color: ${colors.brand.light};
`;

const LeftShape = styled.div`
  ${shapeStyles}
  left: 0;
  top: 0;
  width: 130px;
  height: 50px;
  border-radius: 10px 0 100px 0;
`;

const RightShape = styled.div`
  ${shapeStyles}
  right: 0;
  bottom: 0;
  width: 110px;
  height: 50px;
  border-radius: 100px 0 10px 0;
`;

const ContentWrapper = styled.div`
  z-index: ${stackOrder.offsetSingle};
  text-align: center;
`;

interface FavoriteResource {
  title: string;
  path: string;
}

const getFavoriteResource = async (locale: string): Promise<FavoriteResource | undefined> => {
  const recentFavoritedResult = await fetchRecentFavorited({ exclude: ["folder", "video"] });
  if (!recentFavoritedResult) return;

  const recentFavorited = recentFavoritedResult[0];
  const id = Number(recentFavorited.resourceId);

  switch (recentFavorited.resourceType) {
    case "article":
    case "multidisciplinary": {
      const article = await getArticle(id, locale);
      return { title: article.title.title, path: toEditArticle(article.id, article.articleType) };
    }
    case "image": {
      const image = await fetchImage(id, locale);
      return { title: image.title.title, path: toEditImage(image.id, locale) };
    }
    case "concept": {
      const concept = await fetchConcept(id, locale);
      return { title: concept.title.title, path: toEditConcept(concept.id, locale) };
    }
    case "audio": {
      const audio = await fetchAudio(id, locale);
      return { title: audio.title.title, path: toEditAudio(audio.id, locale) };
    }
    case "learningpath": {
      const learningpath = await fetchLearningpath(id, locale);
      return { title: learningpath.title.title, path: toEditLearningResource(learningpath.id, locale) };
    }
    default:
      return unreachable(recentFavorited.resourceType);
  }
};

export const WelcomeHeader = () => {
  const [favoriteResource, setFavoriteResource] = useState<FavoriteResource | undefined>();
  const { userName } = useSession();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    (async () => {
      if (!userName) return;
      const favoriteResource = await getFavoriteResource(i18n.language);
      setFavoriteResource(favoriteResource);
    })();
  }, [i18n.language, userName]);

  return (
    <StyledHeader>
      <LeftShape />
      <ContentWrapper>
        <StyledTitle>
          {`${t("welcomePage.welcomeBack")} ${userName ? `${userName}!` : t("welcomePage.welcomeText")}`}
        </StyledTitle>
        {favoriteResource && (
          <Text margin="none" textStyle="label-small">
            {t("welcomePage.lastFavorited")}
            <SafeLink to={favoriteResource.path} title={favoriteResource.title}>
              {favoriteResource.title}
            </SafeLink>
          </Text>
        )}
      </ContentWrapper>
      <ButtonWrapper>
        <StyledSafeLinkButton to="/structure">{t("subNavigation.structure")}</StyledSafeLinkButton>
      </ButtonWrapper>
      <RightShape />
    </StyledHeader>
  );
};

export default WelcomeHeader;
