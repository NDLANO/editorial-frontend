/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FormPill } from '@ndla/forms';
import { FieldProps, FormikHelpers, FormikValues } from 'formik';
import styled from '@emotion/styled';
import { fetchGrepCodes } from '../../modules/draft/draftApi';
import { fetchGrepCodeTitle } from '../../modules/grep/grepApi';
import { AsyncDropdown } from '../../components/Dropdown';
import { isGrepCodeValid } from '../../util/articleUtil';
import FormikFieldDescription from '../../components/FormikField/FormikFieldDescription';
import { FormikFieldHelp } from '../../components/FormikField';

interface Props {
  articleGrepCodes: string[];
  field: FieldProps<string[]>['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
}

const StyledErrorPreLine = styled.span`
  white-space: pre-line;
`;

interface GrepCode {
  code: string;
  title: string | undefined | null;
}

export const convertGrepCodesToObject = async (grepCodes: string[]) => {
  return Promise.all(
    grepCodes.map(async c => {
      const grepCodeTitle = await fetchGrepCodeTitle(c);
      return {
        code: c,
        title: grepCodeTitle ? `${c} - ${grepCodeTitle}` : c,
      };
    }),
  );
};

const GrepCodesFieldContent = ({ t, articleGrepCodes, field, form }: Props & tType) => {
  const [grepCodes, setGrepCodes] = useState<GrepCode[]>([]);
  const [failedGrepCodes, setFailedGrepCodes] = useState<string[]>([]);

  const searchForGrepCodes = async (inp: string) => {
    if (inp) {
      const result = await fetchGrepCodes(inp);
      const convertedGrepCodes = await convertGrepCodesToObject(result.results);
      return { ...result, results: convertedGrepCodes };
    } else return [];
  };

  useEffect(() => {
    (async () => {
      const comp = await convertGrepCodesToObject(articleGrepCodes);
      setGrepCodes(comp);
    })();
  }, [articleGrepCodes]);

  const updateFormik = (formikField: Props['field'], newData: string[]) => {
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
      const savedGrepCode = grepCodes.filter(c => c.code === grepCode).length;
      if (grepCodeTitle && !savedGrepCode && isGrepCodeValid(grepCode)) {
        newGrepCodeNames.push({
          code: grepCode,
          title: `${grepCode} - ${grepCodeTitle}`,
        });
      } else if (!savedGrepCode) {
        setFailedGrepCodes(prevState => [...prevState, grepCode]);
      }
    }
    return newGrepCodeNames;
  };

  const createNewGrepCodes = async (input: string) => {
    setFailedGrepCodes([]);
    const newGrepCodes = input
      .toUpperCase()
      .split(',')
      .map(grepCode => grepCode.trim());
    const newGrepCodeNames = await fetchGrepCodeTitles(newGrepCodes);
    const temp = [...grepCodes].concat(newGrepCodeNames);
    setGrepCodes(temp);
    updateFormik(
      field,
      temp.map(c => c.code),
    );
    form.setFieldTouched('grepCodes', true, true);
  };

  const removeGrepCode = (index: string) => {
    const reduced_array = grepCodes.filter((_, idx) => idx !== parseInt(index));
    setGrepCodes(reduced_array);
    updateFormik(
      field,
      reduced_array.map(c => c.code),
    );
    form.setFieldTouched('grepCodes', true, true);
  };

  const isTitleTooLong = (title: string | undefined | null) => {
    return title ? (title.length >= 110 ? `${title.slice(0, 110)}...` : title) : '';
  };

  return (
    <Fragment>
      <FormikFieldDescription description={t('form.grepCodes.description')} />
      {!!failedGrepCodes.length && (
        <FormikFieldHelp error>
          <StyledErrorPreLine>
            {`${t('errorMessage.grepCodes')}${failedGrepCodes.join(', ')}`}
          </StyledErrorPreLine>
        </FormikFieldHelp>
      )}
      <AsyncDropdown
        idField="title"
        name="GrepCodesSearch"
        labelField="title"
        placeholder={t('form.grepCodes.placeholder')}
        label="label"
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
        <FormPill
          id={index.toString()}
          label={isTitleTooLong(grepCode.title)}
          onClick={removeGrepCode}
          key={index}
        />
      ))}
    </Fragment>
  );
};

export default injectT(GrepCodesFieldContent);
