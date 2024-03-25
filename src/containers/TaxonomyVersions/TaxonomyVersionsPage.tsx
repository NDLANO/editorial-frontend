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
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing, misc } from "@ndla/core";
import { HelmetWithTracker } from "@ndla/tracker";
import { Version } from "@ndla/types-taxonomy";
import { OneColumn } from "@ndla/ui";
import DeletePublishRequests from "./components/DeletePublishRequests";
import UIVersion from "./components/Version";
import VersionForm from "./components/VersionForm";
import VersionList from "./components/VersionList";
import { Row } from "../../components";
import { TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH } from "../../constants";
import { useNodes } from "../../modules/nodes/nodeQueries";
import { useVersions } from "../../modules/taxonomy/versions/versionQueries";
import Footer from "../App/components/FooterWrapper";

const NewFormWrapper = styled.div`
  padding: ${spacing.normal};
  border: 1.5px solid ${colors.brand.primary};
  border-radius: 5px;
`;

const FormSpacingWrapper = styled.div`
  padding-top: ${spacing.normal};
`;

const DangerZone = styled.div`
  display: flex;
  padding: ${spacing.normal};
  border-radius: ${misc.borderRadius};
  background-color: ${colors.support.redLight};
  justify-content: space-between;
`;

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

  const { data: publishRequests } = useNodes({
    key: TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH,
    value: "true",
    taxonomyVersion: "default",
  });

  const { published, other } = getPublishedAndOther(data ?? []);

  const { t } = useTranslation();
  return (
    <>
      <OneColumn>
        <HelmetWithTracker title={t("htmlTitles.versionsPage")} />
        <h1>{t("taxonomyVersions.title")}</h1>
        <Row alignItems="center">
          <p>{t("taxonomyVersions.about")}</p>
          <ButtonV2 onClick={() => setShowNewForm((prev) => !prev)}>{t("taxonomyVersions.newVersionButton")}</ButtonV2>
        </Row>
        {showNewForm && (
          <FormSpacingWrapper>
            <NewFormWrapper>
              <VersionForm existingVersions={data ?? []} onClose={() => setShowNewForm(false)} />
            </NewFormWrapper>
          </FormSpacingWrapper>
        )}
        <h3>{t("taxonomyVersions.publishedVersion")}</h3>
        {published ? <UIVersion version={published} /> : t("taxonomyVersions.noPublished")}
        <h3>{t("taxonomyVersions.otherVersions")}</h3>
        <VersionList versions={other} />
        {publishRequests?.length ? (
          <>
            <h2>{t("publishRequests.deleteAll")}</h2>
            <DangerZone>
              <>{t("publishRequests.deleteAllInfo")}</>
              <DeletePublishRequests nodes={publishRequests} />
            </DangerZone>
          </>
        ) : null}
      </OneColumn>
      <Footer />
    </>
  );
};

export default TaxonomyVersionsPage;
