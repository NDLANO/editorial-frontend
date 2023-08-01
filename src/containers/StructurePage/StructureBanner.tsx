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
import { NodeType } from '@ndla/types-taxonomy';
import { useState } from 'react';
import { ButtonV2 } from '@ndla/button';
import { Plus } from '@ndla/icons/action';
import { spacing, colors } from '@ndla/core';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import { ResourceGroupBanner, StyledShareIcon } from './styles';
import { useSession } from '../Session/SessionProvider';
import { TAXONOMY_ADMIN_SCOPE } from '../../constants';
import AddNodeModalContent from './AddNodeModalContent';
import TaxonomyLightbox from '../../components/Taxonomy/TaxonomyLightbox';

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
  nodeType: NodeType;
}

const StructureBanner = ({ onChange, checked, nodeType }: Props) => {
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
          <Modal open={addSubjectModalOpen} onOpenChange={setAddSubjectModalOpen}>
            <ModalTrigger>
              <AddSubjectButton
                size="small"
                onClick={() => setAddSubjectModalOpen(true)}
                data-testid="AddSubjectButton"
              >
                <Plus /> {t('taxonomy.addNode', { nodeType: t(`taxonomy.nodeType.${nodeType}`) })}
              </AddSubjectButton>
            </ModalTrigger>
            <ModalContent position="top">
              <TaxonomyLightbox
                title={t('taxonomy.addNode', { nodeType: t(`taxonomy.nodeType.${nodeType}`) })}
              >
                <AddNodeModalContent
                  onClose={() => setAddSubjectModalOpen(false)}
                  nodeType={nodeType}
                />
              </TaxonomyLightbox>
            </ModalContent>
          </Modal>
        )}
      </FlexWrapper>
    </ResourceGroupBanner>
  );
};

export default StructureBanner;
