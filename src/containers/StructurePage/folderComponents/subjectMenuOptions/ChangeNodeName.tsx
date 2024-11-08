/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldArray, Formik, FormikProps } from "formik";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { PencilFill, DeleteBinLine } from "@ndla/icons/action";
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  IconButton,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Translation, Node, NodeType } from "@ndla/types-taxonomy";
import AddNodeTranslation from "./AddNodeTranslation";
import { Row } from "../../../../components";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { FormField } from "../../../../components/FormField";
import { FormActionsContainer, FormikForm } from "../../../../components/FormikForm";
import validateFormik, { RulesType } from "../../../../components/formikValidationSchema";
import RoundIcon from "../../../../components/RoundIcon";
import SaveButton from "../../../../components/SaveButton";
import Spinner from "../../../../components/Spinner";
import { subjectpageLanguages } from "../../../../i18n2";
import {
  useDeleteNodeTranslationMutation,
  usePutNodeMutation,
  useUpdateNodeTranslationMutation,
} from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys, useNode } from "../../../../modules/nodes/nodeQueries";
import { isFormikFormDirty } from "../../../../util/formHelper";
import handleError from "../../../../util/handleError";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";
import MenuItemButton from "../sharedMenuOptions/components/MenuItemButton";
import { StyledErrorMessage } from "../styles";

const InputWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

interface FormikTranslationFormValues {
  translations: Translation[];
  name: string;
}

interface Props {
  node: Node;
  editModeHandler: EditModeHandler;
}

const rules: RulesType<Translation, Translation> = {
  name: {
    required: true,
  },
  language: {
    required: true,
  },
};

const ChangeNodeName = ({ editModeHandler: { editMode, toggleEditMode }, node }: Props) => {
  const { t } = useTranslation();

  const onModalChange = useCallback(
    (open: boolean) => {
      if (open) {
        toggleEditMode("changeSubjectName");
      } else toggleEditMode("");
    },
    [toggleEditMode],
  );

  return (
    <DialogRoot open={editMode === "changeSubjectName"} onOpenChange={(details) => onModalChange(details.open)}>
      {/* TODO: Remove consumeCss once MenuItemButton is updated */}
      <DialogTrigger asChild consumeCss>
        <MenuItemButton data-testid="changeNodeNameButton">
          <RoundIcon small icon={<PencilFill />} />
          {t("taxonomy.changeName.buttonTitle")}
        </MenuItemButton>
      </DialogTrigger>
      <Portal>
        <DialogContent>
          <ChangeNodeNameContent node={node} />
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

interface ModalProps {
  node: Node;
  nodeType?: NodeType;
}

const ChangeNodeNameContent = ({ node, nodeType = "SUBJECT" }: ModalProps) => {
  const { t } = useTranslation();
  const [updateError, setUpdateError] = useState("");
  const [saved, setSaved] = useState(false);
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();
  const { id, baseName } = node;

  const nodeWithoutTranslationsQuery = useNode({
    id: node.id,
    taxonomyVersion,
  });

  const { mutateAsync: deleteNodeTranslation } = useDeleteNodeTranslationMutation();
  const { mutateAsync: updateNodeTranslation } = useUpdateNodeTranslationMutation();
  const putNodeMutation = usePutNodeMutation();

  const toRecord = (translations: Translation[]): Record<string, Translation> =>
    translations.reduce((prev, curr) => ({ ...prev, [curr.language]: curr }), {});

  const onSubmit = async (formik: FormikProps<FormikTranslationFormValues>) => {
    formik.setSubmitting(true);
    const initial = toRecord(formik.initialValues.translations);
    const newValues = toRecord(formik.values.translations);

    const deleted = Object.entries(initial).filter(([key]) => !newValues[key]);
    const toUpdate = Object.entries(newValues).filter(([key, value]) => value !== initial[key]);

    const promises: (() => Promise<any>)[] = [];

    if (formik.initialValues.name !== formik.values.name) {
      promises.push(() =>
        putNodeMutation.mutateAsync({
          id,
          taxonomyVersion,
          name: formik.values.name,
        }),
      );
    }

    deleted.forEach(([, d]) =>
      promises.push(() => deleteNodeTranslation({ id, language: d.language, taxonomyVersion })),
    );

    toUpdate.forEach(([, u]) =>
      promises.push(() =>
        updateNodeTranslation({
          id,
          language: u.language,
          body: { name: u.name },
          taxonomyVersion,
        }),
      ),
    );
    try {
      for (const promise of promises) {
        await promise();
      }
    } catch (e) {
      console.error(e);
      handleError(e);
      setUpdateError(t("taxonomy.changeName.updateError"));
      await qc.invalidateQueries({
        queryKey: nodeQueryKeys.nodes({ nodeType: nodeType, taxonomyVersion }),
      });

      await qc.invalidateQueries({
        queryKey: nodeQueryKeys.node({ id, taxonomyVersion }),
      });
      formik.setSubmitting(false);
      return;
    }

    if (promises.length > 0) {
      await qc.invalidateQueries({
        queryKey: nodeQueryKeys.nodes({ nodeType: nodeType, taxonomyVersion }),
      });

      await qc.invalidateQueries({
        queryKey: nodeQueryKeys.node({ id, taxonomyVersion }),
      });
    }
    formik.resetForm({ values: formik.values, isSubmitting: false });
    setSaved(true);
  };

  if (nodeWithoutTranslationsQuery.isLoading) {
    return <Spinner />;
  }

  if (nodeWithoutTranslationsQuery.isError || !nodeWithoutTranslationsQuery.data) {
    return <StyledErrorMessage>{t("taxonomy.changeName.loadError")}</StyledErrorMessage>;
  }

  const initialValues = {
    translations: nodeWithoutTranslationsQuery.data.translations?.slice() ?? [],
    name: nodeWithoutTranslationsQuery.data.baseName,
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("taxonomy.changeName.title")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <Formik
          initialValues={initialValues}
          onSubmit={(_, __) => {}}
          validate={(values) => {
            const errors = values.translations.map((translation) => validateFormik(translation, rules, t));

            const nameErrors = validateFormik(
              { name: values.name },
              {
                name: {
                  required: true,
                },
              },
              t,
            );
            if (errors.some((err) => Object.keys(err).length > 0) || Object.keys(nameErrors).length > 0) {
              return { translations: errors, ...nameErrors };
            }
          }}
          enableReinitialize={true}
        >
          {(formik) => {
            const { values, dirty, isSubmitting, isValid } = formik;
            const takenLanguages = values.translations.reduce((prev, curr) => ({ ...prev, [curr.language]: "" }), {});
            const availableLanguages = subjectpageLanguages.filter(
              (trans) => !Object.prototype.hasOwnProperty.call(takenLanguages, trans),
            );
            const formIsDirty: boolean = isFormikFormDirty({
              values,
              initialValues,
              dirty,
            });

            if (formIsDirty) {
              setUpdateError("");
              setSaved(false);
            }
            return (
              <FormikForm data-testid="edit-node-name-form">
                <FormField name="name">
                  {({ field, meta }) => (
                    <FieldRoot required invalid={!!meta.error}>
                      <FieldLabel>{t("taxonomy.changeName.defaultName")}</FieldLabel>
                      <FieldInput {...field} />
                      <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                    </FieldRoot>
                  )}
                </FormField>
                {values.translations.length === 0 && <>{t("taxonomy.changeName.noTranslations")}</>}
                <FieldArray name="translations">
                  {({ push, remove }) => (
                    <>
                      {values.translations.map((trans, i) => (
                        <Row key={i}>
                          <FormField name={`translations.${i}.name`}>
                            {({ field, meta }) => (
                              <FieldRoot required invalid={!!meta.error}>
                                <FieldLabel>{t(`languages.${trans.language}`)}</FieldLabel>
                                <InputWrapper>
                                  <FieldInput {...field} data-testid={`subjectName_${trans.language}`} />
                                  <IconButton
                                    variant="danger"
                                    aria-label={t("form.remove")}
                                    title={t("form.remove")}
                                    onClick={() => remove(i)}
                                    data-testid={`subjectName_${trans.language}_delete`}
                                  >
                                    <DeleteBinLine />
                                  </IconButton>
                                </InputWrapper>
                                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                              </FieldRoot>
                            )}
                          </FormField>
                        </Row>
                      ))}
                      <AddNodeTranslation
                        defaultName={baseName}
                        onAddTranslation={push}
                        availableLanguages={availableLanguages}
                      />
                    </>
                  )}
                </FieldArray>
                <FormActionsContainer>
                  <DialogCloseTrigger asChild>
                    <Button variant="secondary">{t("taxonomy.changeName.cancel")}</Button>
                  </DialogCloseTrigger>
                  <SaveButton
                    data-testid="saveNodeTranslationsButton"
                    size="large"
                    isSaving={isSubmitting}
                    showSaved={!formIsDirty && saved}
                    formIsDirty={formIsDirty}
                    onClick={() => onSubmit(formik)}
                    disabled={!isValid}
                  />
                </FormActionsContainer>
                {updateError && <StyledErrorMessage>{updateError}</StyledErrorMessage>}
              </FormikForm>
            );
          }}
        </Formik>
      </DialogBody>
    </>
  );
};

export default ChangeNodeName;
