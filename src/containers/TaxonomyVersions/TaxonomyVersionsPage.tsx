/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import partition from "lodash/partition";
import sortBy from "lodash/sortBy";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Heading, PageContainer } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { Version } from "@ndla/types-taxonomy";
import UIVersion from "./components/Version";
import VersionForm from "./components/VersionForm";
import VersionList from "./components/VersionList";
import { Row } from "../../components";
import { useVersions } from "../../modules/taxonomy/versions/versionQueries";

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

const getPublishedAndOther = (versions: Version[]): { published: Version | undefined; other: Version[] } => {
  const [published, other] = partition(versions, (v) => v.versionType === "PUBLISHED");
  return {
    published: published[0],
    other: sortBy(other, "created").reverse(),
  };
};

const TaxonomyVersionsPage = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const { data } = useVersions();

  const { published, other } = getPublishedAndOther(data ?? []);

  const { t } = useTranslation();
  return (
    <StyledPageContainer>
      <HelmetWithTracker title={t("htmlTitles.versionsPage")} />
      <Heading textStyle="heading.medium">{t("taxonomyVersions.title")}</Heading>
      <Row alignItems="center">
        <p>{t("taxonomyVersions.about")}</p>
        <Button onClick={() => setShowNewForm((prev) => !prev)}>{t("taxonomyVersions.newVersionButton")}</Button>
      </Row>
      {!!showNewForm && (
        <NewFormWrapper>
          <VersionForm existingVersions={data ?? []} onClose={() => setShowNewForm(false)} />
        </NewFormWrapper>
      )}
      <Heading textStyle="heading.small" asChild consumeCss>
        <h2>{t("taxonomyVersions.publishedVersion")}</h2>
      </Heading>
      {published ? <UIVersion version={published} /> : t("taxonomyVersions.noPublished")}
      <Heading textStyle="heading.small" asChild consumeCss>
        <h2>{t("taxonomyVersions.otherVersions")}</h2>
      </Heading>
      <VersionList versions={other} />
    </StyledPageContainer>
  );
};

export default TaxonomyVersionsPage;
