/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { connect } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { fonts } from "@ndla/core";
import { AudioFormikType } from "./AudioForm";
import FormikField from "../../../components/FormikField";
import PlainTextEditor from "../../../components/SlateEditor/PlainTextEditor";
import { textTransformPlugin } from "../../../components/SlateEditor/plugins/textTransform";

const plugins = [textTransformPlugin];

const StyledFormikField = styled(FormikField)`
  label {
    font-weight: ${fonts.weight.semibold};
    ${fonts.sizes("30px", "38px")};
  }
`;

const StyledPlainTextEditor = styled(PlainTextEditor)`
  white-space: pre-wrap;
  ${fonts.sizes("16px", "30px")};
  font-family: ${fonts.sans};
`;

const AudioManuscript = () => {
  const { t } = useTranslation();

  return (
    <StyledFormikField label={t("podcastForm.fields.manuscript")} name="manuscript">
      {({ field }) => (
        <StyledPlainTextEditor
          id={field.name}
          {...field}
          placeholder={t("podcastForm.fields.manuscript")}
          plugins={plugins}
        />
      )}
    </StyledFormikField>
  );
};

export default connect<{}, AudioFormikType>(AudioManuscript);
