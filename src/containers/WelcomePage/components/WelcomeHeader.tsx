/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Heading, Text } from "@ndla/primitives";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { getArticle } from "../../../modules/article/articleApi";
import { fetchAudio } from "../../../modules/audio/audioApi";
import { fetchConcept } from "../../../modules/concept/conceptApi";
import { fetchImage } from "../../../modules/image/imageApi";
import { fetchLearningpath } from "../../../modules/learningpath/learningpathApi";
import { fetchRecentFavorited } from "../../../modules/myndla/myndlaApi";
import { unreachable } from "../../../util/guards";
import { toEditArticle, toEditAudio, toEditConcept, toEditImage, routes } from "../../../util/routeHelpers";
import { useSession } from "../../Session/SessionProvider";

const StyledHeader = styled("div", {
  base: {
    border: "1px solid",
    borderColor: "stroke.default",
    borderRadius: "xsmall",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: "xsmall",
    gap: "xsmall",

    tabletDown: {
      flexDirection: "column",
    },
  },
});

const ContentWrapper = styled("div", {
  base: {
    textAlign: "center",
  },
});

interface FavoriteResource {
  title: string;
  path: string;
}

const getFavoriteResource = async (locale: string): Promise<FavoriteResource | undefined> => {
  const recentFavoritedResult = await fetchRecentFavorited({ exclude: ["video"] });
  if (!recentFavoritedResult) return;

  const recentFavorited = recentFavoritedResult[0];
  const id = Number(recentFavorited.resourceId);

  switch (recentFavorited.resourceType) {
    case "article":
    case "topic":
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
      return { title: learningpath.title.title, path: routes.learningpath.edit(learningpath.id, locale) };
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
      <ContentWrapper>
        <Heading textStyle="heading.small">
          {`${t("welcomePage.welcomeBack")} ${userName ? `${userName}!` : t("welcomePage.welcomeText")}`}
        </Heading>
        {!!favoriteResource && (
          <Text>
            {t("welcomePage.lastFavorited")}
            <SafeLink to={favoriteResource.path} title={favoriteResource.title}>
              {favoriteResource.title}
            </SafeLink>
          </Text>
        )}
      </ContentWrapper>
      <SafeLinkButton to="/structure">{t("subNavigation.structure")}</SafeLinkButton>
    </StyledHeader>
  );
};

export default WelcomeHeader;
