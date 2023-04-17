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
import TaxonomyLightbox from '../../components/Taxonomy/TaxonomyLightbox';

const Wrapper = styled.div`
  margin-right: auto;
`;

interface Props {
  onClose: () => void;
}

const AddSubjectModal = ({ onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <TaxonomyLightbox
      title={t('taxonomy.addNewPlannedResource')}
      onClose={onClose}
      actions={[
        {
          text: t('form.preview.button'),
          onClick: () => console.log('hehe'),
        },
        {
          text: t('form.save'),
          onClick: () => {
            console.log('save click');
          },
        },
      ]}
    >
      <Wrapper> {'hei'}</Wrapper>
    </TaxonomyLightbox>
  );
};

export default AddSubjectModal;
