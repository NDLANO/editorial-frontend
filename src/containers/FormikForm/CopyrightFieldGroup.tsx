/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { FormContent } from "../../components/FormikForm";
import ContributorsField from "./components/ContributorsField";
import LicenseField from "./components/LicenseField";
import OriginField from "./components/OriginField";
import ProcessedField from "./components/ProcessedField";

const contributorTypes = ["creators", "rightsholders", "processors"] as const;

interface Props {
  enableLicenseNA?: boolean;
}

const CopyrightFieldGroup = ({ enableLicenseNA }: Props) => {
  return (
    <FormContent>
      <ContributorsField contributorTypes={contributorTypes} />
      <LicenseField enableLicenseNA={enableLicenseNA} />
      <OriginField />
      <ProcessedField />
    </FormContent>
  );
};

export default memo(CopyrightFieldGroup);
