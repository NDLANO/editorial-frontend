/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import {
  Button,
  Heading,
  ListItemContent,
  ListItemHeading,
  ListItemRoot,
  PageContainer,
  Spinner,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import config from "../../config";
import { useLearningStepSamples } from "../../modules/learningpath/learningpathQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const StyledList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

const StyledListItemContent = styled(ListItemContent, {
  base: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
});

const IntroWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    gap: "xsmall",
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "small",
  },
});

export const Component = () => <PrivateRoute component={<LearningStepSamplePage />} />;

export const LearningStepSamplePage = () => {
  const { t } = useTranslation();

  const sampleQuery = useLearningStepSamples();

  return (
    <StyledPageContainer>
      <title>{t("htmlTitles.learningpath.stepSamples")}</title>
      <Heading textStyle="heading.medium">{t("learningstepSamplePage.title")}</Heading>
      <IntroWrapper>
        <Text>{t("learningstepSamplePage.introduction")}</Text>
        <Button onClick={() => sampleQuery.refetch()}>Hent nye</Button>
      </IntroWrapper>
      {sampleQuery.isLoading ? (
        <Spinner />
      ) : sampleQuery.isError ? (
        <Text color="text.error">{t("errorMessage.description")}</Text>
      ) : (
        <StyledList>
          {sampleQuery.data?.flatMap((lp) =>
            lp.learningsteps
              .filter((step) => !!step.embedUrl)
              .map((step) => (
                <ListItemRoot key={step.id} asChild consumeCss>
                  <li>
                    <StyledListItemContent>
                      <ListItemHeading asChild>
                        <SafeLink
                          to={`${config.ndlaFrontendDomain}/learningpaths/${lp.id}/steps/${step.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {step.title.title}
                        </SafeLink>
                      </ListItemHeading>
                      <Text>
                        {t("learningstepSamplePage.linksTo")}
                        <SafeLink target="_blank" rel="noopener noreferrer" to={step.embedUrl?.url ?? ""}>
                          {step.embedUrl?.url}
                        </SafeLink>
                      </Text>
                      <Text>{t("learningstepSamplePage.inPath", { title: lp.title.title })}</Text>
                    </StyledListItemContent>
                  </li>
                </ListItemRoot>
              )),
          )}
        </StyledList>
      )}
    </StyledPageContainer>
  );
};
