/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Switch } from '@ndla/switch';
import { useState } from 'react';
import { ButtonV2 } from '@ndla/button';
import { Plus } from '@ndla/icons/action';
import { spacing, colors } from '@ndla/core';
import { ResourceGroupBanner, StyledShareIcon } from './styles';
import { useSession } from '../Session/SessionProvider';
import { TAXONOMY_ADMIN_SCOPE } from '../../constants';
import AddSubjectModal from './AddSubjectModal';

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;
const AddSubjectButton = styled(ButtonV2)`
  margin: 0px ${spacing.small};
`;

interface Props {
  onChange: (checked: boolean) => void;
  checked: boolean;
}

const StructureBanner = ({ onChange, checked }: Props) => {
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);

  const { t } = useTranslation();
  const { userPermissions } = useSession();

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  return (
    <ResourceGroupBanner>
      <FlexWrapper>
        <StyledShareIcon />
        {t('taxonomy.editStructure')}
      </FlexWrapper>
      <FlexWrapper>
        <Switch
          onChange={onChange}
          checked={checked}
          label={t('taxonomy.favorites')}
          id={'favorites'}
        />

        {isTaxonomyAdmin && (
          <AddSubjectButton
            size="small"
            onClick={() => setAddSubjectModalOpen(true)}
            data-testid="AddSubjectButton"
          >
            <Plus /> {t('taxonomy.addSubject')}
          </AddSubjectButton>
        )}
      </FlexWrapper>
      {addSubjectModalOpen && <AddSubjectModal onClose={() => setAddSubjectModalOpen(false)} />}
    </ResourceGroupBanner>
  );
};

export default StructureBanner;
