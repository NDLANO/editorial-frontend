/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Version } from "@ndla/types-taxonomy";
import { HeadingLevel } from "@ndla/ui";
import VersionLockedField from "./VersionLockedField";
import VersionNameField from "./VersionNameField";
import VersionSourceField from "./VersionSourceField";
import { AlertDialog } from "../../../components/AlertDialog/AlertDialog";
import { FormActionsContainer, FormikForm } from "../../../components/FormikForm";
import validateFormik, { RulesType } from "../../../components/formikValidationSchema";
import SaveButton from "../../../components/SaveButton";
import Fade from "../../../components/Taxonomy/Fade";
import {
  usePostVersionMutation,
  usePublishVersionMutation,
  usePutVersionMutation,
} from "../../../modules/taxonomy/versions/versionMutations";
import { versionQueryKeys } from "../../../modules/taxonomy/versions/versionQueries";
import {
  VersionFormType,
  versionFormTypeToVersionPostType,
  versionFormTypeToVersionPutType,
  versionTypeToVersionFormType,
} from "../versionTransformers";

interface Props {
  version?: Version;
  existingVersions: Version[];
  onClose: () => void;
  headingLevel: Extract<HeadingLevel, "h2" | "h3">;
}

const versionFormRules: RulesType<VersionFormType> = {
  name: {
    required: true,
  },
};

const StyledButton = styled(Button, {
  base: {
    width: "fit-content",
  },
});

const Row = styled("div", {
  base: {
    display: "grid",
    gap: "xsmall",
    gridAutoFlow: "column",
  },
});

const VersionForm = ({ version, existingVersions, onClose, headingLevel: HeadingLevel }: Props) => {
  const { t } = useTranslation();
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const initialValues = versionTypeToVersionFormType(version);
  const qc = useQueryClient();
  const versionsKey = versionQueryKeys.versions();

  const versionPostMutation = usePostVersionMutation({
    onMutate: async ({ body }) => {
      setError(undefined);
      await qc.cancelQueries({ queryKey: versionsKey });
      const optimisticVersion: Version = {
        id: "",
        versionType: "BETA",
        name: body.name,
        hash: "",
        locked: !!body.locked,
        created: "",
      };
      const existingVersions = qc.getQueryData<Version[]>(versionsKey) ?? [];
      qc.setQueryData<Version[]>(versionsKey, existingVersions.concat(optimisticVersion));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: versionsKey }),
    onError: () => setError(t("taxonomyVersions.postError")),
  });

  const versionPutMutation = usePutVersionMutation({
    onMutate: async ({ id, body }) => {
      setError(undefined);
      await qc.cancelQueries({ queryKey: versionsKey });
      const existingVersions = qc.getQueryData<Version[]>(versionsKey) ?? [];
      const newVersions = existingVersions.map((version) => {
        if (version.id === id) {
          return {
            ...version,
            locked: body.locked ?? version.locked,
            name: body.name ?? version.name,
          };
        } else return version;
      });
      qc.setQueryData<Version[]>(versionsKey, newVersions);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: versionsKey }),
    onError: () => setError(t("taxonomyVersions.putError")),
  });

  const publishVersionMutation = usePublishVersionMutation({
    onMutate: async ({ id }) => {
      setError(undefined);
      await qc.cancelQueries({ queryKey: versionsKey });
      const existingVersions = qc.getQueryData<Version[]>(versionsKey) ?? [];
      const updatedVersions: Version[] = existingVersions.map((version) => {
        if (version.id === id) {
          return { ...version, versionType: "PUBLISHED" };
        } else return version;
      });
      qc.setQueryData<Version[]>(versionsKey, updatedVersions);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: versionsKey }),
    onError: () => setError(t("taxonomyVersions.publishError")),
  });

  const onPublish = async () => {
    if (!version) return;
    await publishVersionMutation.mutateAsync({ id: version.id });
    onClose();
  };

  const onSubmit = async (values: VersionFormType, helpers: FormikHelpers<VersionFormType>) => {
    helpers.setSubmitting(true);
    if (!version) {
      const body = versionFormTypeToVersionPostType(values);
      await versionPostMutation.mutateAsync({
        body,
        sourceId: values.sourceId,
      });
    } else {
      const body = versionFormTypeToVersionPutType(values);
      await versionPutMutation.mutateAsync({ id: version.id, body });
    }
    helpers.setSubmitting(false);
    onClose();
  };
  return (
    <Fade show>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validateOnMount={true}
        onSubmit={(values, helpers) => onSubmit(values, helpers)}
        validate={(values) => validateFormik(values, versionFormRules, t)}
      >
        {({ isSubmitting, isValid, dirty, handleSubmit }) => {
          return (
            <FormikForm>
              <Text textStyle="title.small" asChild consumeCss>
                <HeadingLevel>
                  {t(`taxonomyVersions.${!version ? "newVersionTitle" : "editVersionTitle"}`)}
                </HeadingLevel>
              </Text>
              <VersionNameField />
              {!version && <VersionSourceField existingVersions={existingVersions} />}
              {version?.versionType !== "PUBLISHED" && <VersionLockedField />}
              {!!error && <Text color="text.error">{error}</Text>}
              <Row>
                {version?.versionType === "BETA" && (
                  <StyledButton disabled={dirty} onClick={() => setShowAlertDialog(true)}>
                    {t("taxonomyVersions.publishButton")}
                  </StyledButton>
                )}
                <FormActionsContainer>
                  <Button variant="secondary" onClick={onClose}>
                    {t("form.abort")}
                  </Button>
                  <SaveButton
                    loading={isSubmitting}
                    disabled={!dirty || !isValid}
                    onClick={() => handleSubmit()}
                    formIsDirty={dirty}
                  />
                </FormActionsContainer>
              </Row>
              <AlertDialog
                title={t("taxonomyVersions.publishTitle")}
                label={t("taxonomyVersions.publishTitle")}
                show={showAlertDialog}
                text={t("taxonomyVersions.publishWarning")}
                onCancel={() => setShowAlertDialog(false)}
              >
                <FormActionsContainer>
                  <Button onClick={() => setShowAlertDialog(false)} variant="danger">
                    {t("form.abort")}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAlertDialog(false);
                      onPublish();
                    }}
                    variant="secondary"
                  >
                    {t("alertDialog.continue")}
                  </Button>
                </FormActionsContainer>
              </AlertDialog>
            </FormikForm>
          );
        }}
      </Formik>
    </Fade>
  );
};
export default VersionForm;
