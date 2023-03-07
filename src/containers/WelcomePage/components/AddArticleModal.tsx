/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import { InputV2 } from '@ndla/forms';
import TaxonomyLightbox from '../../../components/Taxonomy/TaxonomyLightbox';

const FormWrapper = styled.form``;

interface Props {
  onClose: () => void;
}

const AddArticleModal = ({ onClose }: Props) => {
  const { t } = useTranslation();

  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <TaxonomyLightbox title={t('welcomePage.plannedArticle')} onClose={onClose}>
      <>
        <FormWrapper>
          <InputV2 label={'test'} name={''} />
          <ButtonV2 type="submit" onClick={handleClick}>
            {t('form.save')}
          </ButtonV2>
        </FormWrapper>
      </>
    </TaxonomyLightbox>
  );
};

export default AddArticleModal;
