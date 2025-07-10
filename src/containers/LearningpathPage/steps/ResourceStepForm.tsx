/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FieldHelper, FieldLabel, FieldRoot } from "@ndla/primitives";
import { ResourcePicker } from "./ResourcePicker";
import { LearningpathStepFormValues } from "./types";

interface Props {
  // TODO: Yeah...
  resource: any | undefined;
}

export const ResourceStepForm = ({ resource }: Props) => {
  const { t } = useTranslation();
  const [selectedResource, setSelectedResource] = useState<ResourceData | undefined>(resource);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);
  const { setFieldValue } = useFormikContext<LearningpathStepFormValues>();

  const onSelectResource = (resource: ResourceData) => {
    setSelectedResource(resource);
    setFieldValue("embedUrl", resource.url, true);
    setFieldValue("title", resource.title, true);
    setFocusId("remove-resource");
  };

  const onRemove = () => {
    setSelectedResource(undefined);
    setFieldValue("embedUrl", "", true);
    setFieldValue("title", "", true);
    setFocusId("resource-input");
  };

  useEffect(() => {
    if (focusId) {
      document.getElementById(focusId)?.focus();
      setFocusId(undefined);
    }
  }, [focusId]);
  if (!selectedResource) {
    return (
      <FieldRoot>
        <FieldLabel fontWeight="bold">{t("myNdla.learningpath.form.content.resource.label")}</FieldLabel>
        <FieldHelper>{t("myNdla.learningpath.form.content.resource.labelHelper")}</FieldHelper>
        {/* TODO: Label and Helper should be connected to combobox... */}
        <ResourcePicker setResource={onSelectResource} />
      </FieldRoot>
    );
  }

  // TODO: This should not be a field
  return (
    <FieldRoot>
      <FieldLabel fontWeight="bold">{t("myNdla.learningpath.form.content.resource.label")}</FieldLabel>
      <FieldHelper>{t("myNdla.learningpath.form.content.resource.labelHelper")}</FieldHelper>
      {/* <ResourceContent selectedResource={selectedResource} onRemove={onRemove} /> */}
    </FieldRoot>
  );
};
