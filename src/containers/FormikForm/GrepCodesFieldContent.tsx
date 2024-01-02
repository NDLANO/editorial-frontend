/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, FormikHelpers, FormikValues } from "formik";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { FormPill } from "@ndla/forms";
import AsyncDropdown from "../../components/Dropdown/asyncDropdown/AsyncDropdown";
import { FormikFieldHelp } from "../../components/FormikField";
import FormikFieldDescription from "../../components/FormikField/FormikFieldDescription";
import { fetchGrepCodes } from "../../modules/draft/draftApi";
import { fetchGrepCodeTitle } from "../../modules/grep/grepApi";
import { isGrepCodeValid } from "../../util/articleUtil";

interface Props {
  field: FieldProps<string[]>["field"];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>["setFieldTouched"];
  };
}

const StyledErrorPreLine = styled.span`
  white-space: pre-line;
`;

interface GrepCode {
  code: string;
  title?: string;
}

export const convertGrepCodesToObject = async (grepCodes: string[]) => {
  return Promise.all(
    grepCodes.map(async (c) => {
      const grepCodeTitle = await fetchGrepCodeTitle(c);
      return {
        code: c,
        title: grepCodeTitle ? `${c} - ${grepCodeTitle}` : c,
      };
    }),
  );
};

const GrepCodesFieldContent = ({ field, form }: Props) => {
  const { t } = useTranslation();
  const [grepCodes, setGrepCodes] = useState<GrepCode[]>([]);
  const [failedGrepCodes, setFailedGrepCodes] = useState<string[]>([]);

  const searchForGrepCodes = async (inp: string) => {
    const result = await fetchGrepCodes(inp);
    const convertedGrepCodes = await convertGrepCodesToObject(result.results);
    return { ...result, results: convertedGrepCodes };
  };

  useEffect(() => {
    (async () => {
      const comp = await convertGrepCodesToObject(field.value);
      setGrepCodes(comp);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFormik = (formikField: Props["field"], newData: string[]) => {
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const fetchGrepCodeTitles = async (newGrepCodes: string[]) => {
    const newGrepCodeNames = [];
    for (const grepCode of newGrepCodes) {
      const grepCodeTitle = await fetchGrepCodeTitle(grepCode);
      const savedGrepCode = grepCodes.filter((c) => c.code === grepCode).length;
      if (grepCodeTitle && !savedGrepCode && isGrepCodeValid(grepCode)) {
        newGrepCodeNames.push({
          code: grepCode,
          title: `${grepCode} - ${grepCodeTitle}`,
        });
      } else if (!savedGrepCode) {
        setFailedGrepCodes((prevState) => [...prevState, grepCode]);
      }
    }
    return newGrepCodeNames;
  };

  const createNewGrepCodes = async (input: string) => {
    setFailedGrepCodes([]);
    const newGrepCodes = input
      ? input
          .toUpperCase()
          .split(",")
          .map((grepCode) => grepCode.trim())
      : [];
    const newGrepCodeNames = await fetchGrepCodeTitles(newGrepCodes);
    const temp = [...grepCodes].concat(newGrepCodeNames);
    setGrepCodes(temp);
    updateFormik(
      field,
      temp.map((c) => c.code),
    );
    form.setFieldTouched("grepCodes", true, true);
  };

  const removeGrepCode = (index: string) => {
    const reduced_array = grepCodes.filter((_, idx) => idx !== parseInt(index));
    setGrepCodes(reduced_array);
    updateFormik(
      field,
      reduced_array.map((c) => c.code),
    );
    form.setFieldTouched("grepCodes", true, true);
  };

  const isTitleTooLong = (title: string | undefined | null) => {
    return title ? (title.length >= 110 ? `${title.slice(0, 110)}...` : title) : "";
  };

  return (
    <>
      <FormikFieldDescription description={t("form.grepCodes.description")} />
      {!!failedGrepCodes.length && (
        <FormikFieldHelp error>
          <StyledErrorPreLine>{`${t("errorMessage.grepCodes")}${failedGrepCodes.join(", ")}`}</StyledErrorPreLine>
        </FormikFieldHelp>
      )}
      <AsyncDropdown
        idField="title"
        labelField="title"
        placeholder={t("form.grepCodes.placeholder")}
        apiAction={searchForGrepCodes}
        onClick={(e: Event) => e.stopPropagation()}
        onChange={(c: GrepCode) => createNewGrepCodes(c.code)}
        selectedItems={grepCodes}
        multiSelect
        disableSelected
        onCreate={createNewGrepCodes}
        clearInputField
        customCreateButtonText="Legg til kode"
        hideTotalSearchCount
        saveOnEnter
      />

      {grepCodes.map((grepCode, index) => (
        <FormPill id={index.toString()} label={isTitleTooLong(grepCode.title)} onClick={removeGrepCode} key={index} />
      ))}
    </>
  );
};

export default GrepCodesFieldContent;
