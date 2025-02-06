/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

import { ContentTypeProvider } from "../../../components/ContentTypeProvider";
import { FormContent } from "../../../components/FormikForm";
import LastUpdatedLine from "../../../components/LastUpdatedLine/LastUpdatedLine";
import { IngressField, TitleField } from "../../FormikForm";
import VisualElementField from "../../FormikForm/components/VisualElementField";

import { ConceptFormValues } from "../conceptInterfaces";

interface Props {
  inModal: boolean;
}

const ConceptContent = ({ inModal = false }: Props) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<ConceptFormValues>();
  const {
    values: { creators, updated },
  } = formikContext;

  return (
    <ContentTypeProvider value="concept">
      <FormContent>
        <div>
          <TitleField hideToolbar />
          <LastUpdatedLine onChange={() => {}} creators={creators} published={updated} contentType="concept" />
        </div>
        <VisualElementField types={["image"]} inModal={inModal} />
        <IngressField name="conceptContent" maxLength={800} placeholder={t("form.name.content")} />
      </FormContent>
    </ContentTypeProvider>
  );
};

export default ConceptContent;
