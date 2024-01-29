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
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";

import { ButtonV2, CloseButton } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Input } from "@ndla/forms";
import { Pencil } from "@ndla/icons/action";
import { ModalHeader, ModalBody, Modal, ModalTitle, ModalContent, ModalTrigger } from "@ndla/modal";
import { Translation, Node, NodeType } from "@ndla/types-taxonomy";
import AddNodeTranslation from "./AddNodeTranslation";
import { Row } from "../../../../components";
import DeleteButton from "../../../../components/DeleteButton";
import UIField from "../../../../components/Field";
import FormikField from "../../../../components/FormikField";
import validateFormik, { RulesType } from "../../../../components/formikValidationSchema";
import RoundIcon from "../../../../components/RoundIcon";
import SaveButton from "../../../../components/SaveButton";
import Spinner from "../../../../components/Spinner";
import StyledForm from "../../../../components/StyledFormComponents";
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

const StyledDeleteButton = styled(DeleteButton)`
  text-align: center;
  align-items: center;
`;

const InputRow = styled.div`
  display: flex;
  width: 100%;
  gap: ${spacing.normal};
  align-items: center;
  > div {
    width: 100%;
  }
`;

const StyledModalBody = styled(ModalBody)`
  padding-top: 0;
`;

const StyledCancelButton = styled(ButtonV2)`
  padding: 0 ${spacing.normal};
`;

const StyledUIField = styled(UIField)`
  margin-right: 0px;
`;

const StyledFormikField = styled(FormikField)`
  margin-top: 0px;
`;

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

  const onClose = useCallback(() => {
    toggleEditMode("");
  }, [toggleEditMode]);

  return (
    <>
      <Modal open={editMode === "changeSubjectName"} onOpenChange={onModalChange}>
        <ModalTrigger>
          <MenuItemButton data-testid="changeNodeNameButton">
            <RoundIcon small icon={<Pencil />} />
            {t("taxonomy.changeName.buttonTitle")}
          </MenuItemButton>
        </ModalTrigger>
        <ModalContent>
          <ChangeNodeNameContent node={node} onClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  );
};

interface ModalProps {
  onClose: () => void;
  node: Node;
  nodeType?: NodeType;
}

const ChangeNodeNameContent = ({ onClose, node, nodeType = "SUBJECT" }: ModalProps) => {
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
      <ModalHeader>
        <ModalTitle>{t("taxonomy.changeName.title")}</ModalTitle>
        <CloseButton title={t("dialog.close")} data-testid="close-modal-button" onClick={onClose} />
      </ModalHeader>
      <StyledModalBody>
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
              <StyledForm data-testid="edit-node-name-form">
                <StyledFormikField name="name" label={t("taxonomy.changeName.defaultName")}>
                  {({ field }) => <Input {...field} />}
                </StyledFormikField>
                {values.translations.length === 0 && <>{t("taxonomy.changeName.noTranslations")}</>}
                <FieldArray name="translations">
                  {({ push, remove }) => (
                    <>
                      {values.translations.map((trans, i) => (
                        <Row key={i}>
                          <StyledFormikField name={`translations.${i}.name`} label={t(`languages.${trans.language}`)}>
                            {({ field }) => (
                              <InputRow>
                                <Input {...field} data-testid={`subjectName_${trans.language}`} />
                                <StyledDeleteButton
                                  aria-label={t("form.remove")}
                                  onClick={() => remove(i)}
                                  data-testid={`subjectName_${trans.language}_delete`}
                                />
                              </InputRow>
                            )}
                          </StyledFormikField>
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
                <StyledUIField right noBorder>
                  <Row justifyContent="end">
                    <StyledCancelButton onClick={onClose}>{t("taxonomy.changeName.cancel")}</StyledCancelButton>
                    <SaveButton
                      data-testid="saveNodeTranslationsButton"
                      size="large"
                      isSaving={isSubmitting}
                      showSaved={!formIsDirty && saved}
                      formIsDirty={formIsDirty}
                      onClick={() => onSubmit(formik)}
                      disabled={!isValid}
                    />
                  </Row>
                </StyledUIField>
                {updateError && <StyledErrorMessage>{updateError}</StyledErrorMessage>}
              </StyledForm>
            );
          }}
        </Formik>
      </StyledModalBody>
    </>
  );
};

export default ChangeNodeName;
