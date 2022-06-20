/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import FormikField from '../../components/FormikField';
import PlainTextEditor from '../../components/SlateEditor/PlainTextEditor';
import { textTransformPlugin } from '../../components/SlateEditor/plugins/textTransform';
import { MetaImageSearch } from '.';
import AsyncSearchTags from '../../components/Dropdown/asyncDropdown/AsyncSearchTags';
import AvailabilityField from './components/AvailabilityField';
import { DRAFT_ADMIN_SCOPE } from '../../constants';
import { useSession } from '../Session/SessionProvider';
import { fetchSearchTags } from '../../modules/draft/draftApi';

interface Props {
  articleLanguage: string;
  showCheckbox?: boolean;
  checkboxAction?: (image: IImageMetaInformationV2) => void;
}

const MetaDataField = ({ articleLanguage, showCheckbox, checkboxAction }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const plugins = [textTransformPlugin];

  return (
    <>
      <FormikField
        name="tags"
        label={t('form.tags.label')}
        showError
        description={t('form.tags.description')}>
        {({ field, form }) => (
          <AsyncSearchTags
            multiSelect
            initialTags={field.value}
            language={articleLanguage}
            field={field}
            form={form}
            fetchTags={fetchSearchTags}
          />
        )}
      </FormikField>
      {userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
        <FormikField name="availability" label={t('form.availability.label')}>
          {({ field }) => <AvailabilityField field={field} />}
        </FormikField>
      )}
      <FormikField
        name="metaDescription"
        maxLength={155}
        showMaxLength
        label={t('form.metaDescription.label')}
        description={t('form.metaDescription.description')}>
        {({ field }) => (
          <PlainTextEditor
            id={field.name}
            placeholder={t('form.metaDescription.label')}
            {...field}
            plugins={plugins}
          />
        )}
      </FormikField>
      <FormikField name="metaImageId">
        {({ field, form }) => (
          <MetaImageSearch
            metaImageId={field.value}
            setFieldTouched={form.setFieldTouched}
            showRemoveButton={false}
            showCheckbox={showCheckbox}
            checkboxAction={checkboxAction}
            {...field}
          />
        )}
      </FormikField>
    </>
  );
};

export default MetaDataField;
