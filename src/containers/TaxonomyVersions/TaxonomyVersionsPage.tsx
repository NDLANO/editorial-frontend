/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Heading, PageContainer, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Version } from "@ndla/types-taxonomy";
import { partition, sortBy } from "@ndla/util";
import UIVersion from "./components/Version";
import VersionForm from "./components/VersionForm";
import { useVersions } from "../../modules/taxonomy/versions/versionQueries";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const NewFormWrapper = styled("div", {
  base: {
    padding: "medium",
    border: "1px solid",
    borderColor: "stroke.default",
    borderRadius: "xsmall",
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "xsmall",
  },
});

const Row = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "xsmall",
    tabletDown: {
      flexWrap: "wrap",
    },
  },
});

const StyledButton = styled(Button, {
  base: {
    whiteSpace: "nowrap",
  },
});

const StyledVersionList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    listStyle: "none",
  },
});

const getPublishedAndOther = (versions: Version[]): { published: Version | undefined; other: Version[] } => {
  const [published, other] = partition(versions, (v) => v.versionType === "PUBLISHED");
  return {
    published: published[0],
    other: sortBy(other, (o) => o.created).reverse(),
  };
};

export const Component = () => <PrivateRoute component={<TaxonomyVersionsPage />} />;

const TaxonomyVersionsPage = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const { data } = useVersions();

  const { published, other } = getPublishedAndOther(data ?? []);

  const { t } = useTranslation();
  return (
    <StyledPageContainer>
      <title>{t("htmlTitles.versionsPage")}</title>
      <Heading textStyle="heading.medium">{t("taxonomyVersions.title")}</Heading>
      <Row>
        <Text>{t("taxonomyVersions.about")}</Text>
        <StyledButton onClick={() => setShowNewForm((prev) => !prev)}>
          {t("taxonomyVersions.newVersionButton")}
        </StyledButton>
      </Row>
      {!!showNewForm && (
        <NewFormWrapper>
          <VersionForm existingVersions={data ?? []} onClose={() => setShowNewForm(false)} headingLevel="h2" />
        </NewFormWrapper>
      )}
      <Heading textStyle="title.large" asChild consumeCss>
        <h2>{t("taxonomyVersions.publishedVersion")}</h2>
      </Heading>
      {published ? <UIVersion version={published} /> : t("taxonomyVersions.noPublished")}
      <Heading textStyle="title.large" asChild consumeCss>
        <h2>{t("taxonomyVersions.otherVersions")}</h2>
      </Heading>
      {other.length === 0 ? (
        <Text>{t("taxonomyVersions.noOtherVersions")}</Text>
      ) : (
        <StyledVersionList>
          {other.map((version) => (
            <li key={version.id}>
              <UIVersion version={version} />
            </li>
          ))}
        </StyledVersionList>
      )}
    </StyledPageContainer>
  );
};
