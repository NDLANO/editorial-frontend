/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import { injectT } from '@ndla/i18n';
import { FormPill } from '@ndla/forms';
import { FieldProps, FormikActions, FormikValues } from 'formik';
import { fetchGrepCodes } from '../../modules/draft/draftApi';
import { fetchGrepCodeTitle } from '../../modules/grep/grepApi';
import { AsyncDropdown } from '../../components/Dropdown';
import { isGrepCodeValid } from '../../util/articleUtil';
import { TranslateType } from '../../interfaces';
import FormikFieldDescription from '../../components/FormikField/FormikFieldDescription';

interface Props {
  t: TranslateType;
  articleGrepCodes: string[];
  field: FieldProps<string[]>['field'];
  form: {
    setFieldTouched: FormikActions<FormikValues>['setFieldTouched'];
  };
}

interface GrepCode {
  code: string;
  title: string | undefined | null;
}

const FormikGrepCodesContent = ({
  t,
  articleGrepCodes = [],
  field,
  form,
}: Props) => {
  const convertGrepCodesToObject = async (grepCodes: string[]) => {
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
  const [grepCodes, setGrepCodes] = useState<GrepCode[]>([]);

  const searchForGrepCodes = async (inp: string) => {
    if (inp) {
      const result = await fetchGrepCodes(inp);
      result.results = await convertGrepCodesToObject(result.results);
      return result;
    } else return [];
  };

  useEffect(() => {
    (async () => {
      const comp = await convertGrepCodesToObject(articleGrepCodes);
      setGrepCodes(comp);
    })();
  }, []);

  const updateFormik = (formikField: Props['field'], newData: string[]) => {
    formikField.onChange({
      target: {
        name: formikField.name,
        value: newData || null,
      },
    });
  };

  const createNewGrepCode = async (newGrepCode: string) => {
    const grepCode = newGrepCode.toUpperCase();
    const grepCodeTitle = await fetchGrepCodeTitle(grepCode);
    if (
      grepCodeTitle &&
      !grepCodes.filter(c => c.code === grepCode).length &&
      isGrepCodeValid(grepCode)
    ) {
      const temp = [
        ...grepCodes,
        {
          code: grepCode,
          title: `${grepCode} - ${grepCodeTitle}`,
        },
      ];
      setGrepCodes(temp);
      updateFormik(
        field,
        temp.map(c => c.code),
      );
      form.setFieldTouched('grepCodes', true, true);
    }
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

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const isTitleTooLong = (title: string | undefined | null) => {
    return title
      ? title.length >= 110
        ? `${title.slice(0, 110)}...`
        : title
      : '';
  };

  return (
    <Fragment>
      <FormikFieldDescription description={t('form.grepCodes.description')} />
      <AsyncDropdown
        idField="title"
        name="GrepCodesSearch"
        labelField="title"
        placeholder={t('form.grepCodes.placeholder')}
        label="label"
        apiAction={searchForGrepCodes}
        onClick={(e: Event) => e.stopPropagation()}
        onChange={(c: GrepCode) => createNewGrepCode(c.code)}
        selectedItems={grepCodes}
        multiSelect
        disableSelected
        onCreate={createNewGrepCode}
        onKeyDown={onKeyDown}
        clearInputField
        customCreateButtonText="Legg til kode"
        hideTotalSearchCount
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

export default injectT(FormikGrepCodesContent);
