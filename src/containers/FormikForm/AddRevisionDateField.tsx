/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import addYears from "date-fns/addYears";
import { FieldInputProps } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { FieldRemoveButton, InputV3, FieldErrorMessage } from "@ndla/forms";
import { Switch } from "@ndla/switch";
import { ArticleFormType } from "./articleFormHooks";
import InlineDatePicker from "./components/InlineDatePicker";
import { FormControl } from "../../components/FormField";
import { Revision } from "../../constants";
import { formatDateForBackend } from "../../util/formatDate";
import { useMessages } from "../Messages/MessagesProvider";

type RevisionMetaFormType = ArticleFormType["revisionMeta"];

interface Props {
  formikField: FieldInputProps<RevisionMetaFormType>;
  name: string;
  placeholder?: string;
  onChange: Function;
  value: string[];
  showError?: boolean;
}

const Wrapper = styled.div`
  margin-bottom: ${spacing.small};
  align-items: baseline;
  display: flex;
  > div {
    &:first-of-type {
      + div {
        padding-left: ${spacing.normal};
      }
    }
  }
  &:empty {
    margin: 0;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const StyledSwitch = styled(Switch)`
  outline: none;
`;

const StyledDatePickerWrapper = styled.div`
  height: ${spacing.large};
`;

const StyledRemoveButton = styled(FieldRemoveButton)`
  height: 100%;
  padding-top: 0;
  [data-icon] {
    fill: ${colors.support.red};
  }
`;

const VerticalCenter = styled.div`
  display: flex;
  align-items: center;
`;

const AddRevisionDateField = ({ formikField, showError }: Props) => {
  const { t } = useTranslation();
  type RevisionMetaType = (typeof formikField.value)[number];
  const onRevisionChange = (newMetas: RevisionMetaFormType) => {
    formikField.onChange({
      target: {
        value: newMetas,
        name: formikField.name,
      },
    });
  };
  const addRevision = () => {
    onRevisionChange([
      ...formikField.value,
      {
        note: "",
        revisionDate: formatDateForBackend(addYears(new Date(), 5)),
        status: "needs-revision",
        new: true,
      },
    ]);
  };

  const removeRevision = (idx: number) => {
    const withoutIdx = formikField.value.filter((_, index) => index !== idx);
    onRevisionChange(withoutIdx);
  };

  const { createMessage } = useMessages();

  return (
    <>
      {formikField.value.map((revisionMeta, index) => {
        const editRevision = (editFunction: (old: RevisionMetaType) => RevisionMetaType) => {
          const newRevisions = [...formikField.value];
          newRevisions[index] = editFunction(newRevisions[index]);
          onRevisionChange(newRevisions);
        };
        return (
          <div key={`revision_${index}`}>
            <Wrapper>
              <InputWrapper>
                <FormControl isRequired isInvalid={showError && revisionMeta.note === ""}>
                  <InputV3
                    placeholder={t("form.revisions.inputPlaceholder")}
                    type="text"
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    value={revisionMeta.note}
                    data-testid="revisionInput"
                    onChange={(e) => {
                      editRevision((old) => ({
                        ...old,
                        note: e.currentTarget.value,
                      }));
                    }}
                  />
                  <FieldErrorMessage>{t("validation.noEmptyRevision")}</FieldErrorMessage>
                </FormControl>
              </InputWrapper>
              <VerticalCenter>
                <StyledDatePickerWrapper>
                  <InlineDatePicker
                    aria-label={t("form.revisions.datePickerTooltip")}
                    value={revisionMeta.revisionDate}
                    name={`revision_date_${index}`}
                    onChange={(date) =>
                      editRevision((old) => ({
                        ...old,
                        revisionDate: date.currentTarget.value,
                      }))
                    }
                    title={t("form.revisions.datePickerTooltip")}
                  />
                </StyledDatePickerWrapper>
                <div>
                  <StyledSwitch
                    aria-label={t("form.revisions.switchTooltip")}
                    checked={revisionMeta.status === Revision.revised}
                    onChange={(c) => {
                      const status = c ? Revision.revised : Revision.needsRevision;
                      editRevision((old) => ({ ...old, status }));
                      if (status === Revision.revised) {
                        createMessage({
                          translationKey: "form.revisions.reminder",
                          severity: "info",
                          timeToLive: 0,
                        });
                      }
                    }}
                    label={""}
                    id={`revision_switch_${index}`}
                    title={t("form.revisions.switchTooltip")}
                  />
                </div>
                <StyledRemoveButton
                  aria-label={t("form.revisions.deleteTooltip")}
                  data-visible={true}
                  onClick={() => removeRevision(index)}
                  title={t("form.revisions.deleteTooltip")}
                />
              </VerticalCenter>
            </Wrapper>
          </div>
        );
      })}
      <ButtonV2
        aria-label={t("form.revisions.add")}
        variant="outline"
        onClick={addRevision}
        data-testid="addRevision"
        title={t("form.revisions.add")}
      >
        {t("form.revisions.add")}
      </ButtonV2>
    </>
  );
};

export default AddRevisionDateField;
