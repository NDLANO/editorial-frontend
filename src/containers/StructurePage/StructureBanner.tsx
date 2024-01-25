/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing, mq, breakpoints } from '@ndla/core';
import { Plus } from '@ndla/icons/action';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import { Switch } from '@ndla/switch';
import { NodeType } from '@ndla/types-taxonomy';
import AddNodeModalContent from './AddNodeModalContent';
import { ResourceGroupBanner, StyledShareIcon } from './styles';
import TaxonomyLightbox from '../../components/Taxonomy/TaxonomyLightbox';
import { TAXONOMY_ADMIN_SCOPE } from '../../constants';
import { useSession } from '../Session/SessionProvider';

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const AddSubjectButton = styled(ButtonV2)`
  margin: 0 0 0 ${spacing.small};
`;

const StyledPlusIcon = styled(Plus)`
  ${mq.range({ until: breakpoints.tablet })} {
    display: none;
  }
`;

const SwitchWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const CustomFilterSwitchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const StyledSwitch = styled(Switch)`
  & button {
    flex-shrink: 0;
  }
`;

interface Props {
  setShowFavorites: (checked: boolean) => void;
  showFavorites: boolean;
  setShowLmaSubjects: (checked: boolean) => void;
  setShowDeskSubjects: (checked: boolean) => void;
  setShowLanguageSubjects: (checked: boolean) => void;
  showLmaSubjects: boolean;
  showDeskSubjects: boolean;
  showLanguageSubjects: boolean;
  nodeType: NodeType;
  hasLmaSubjects: boolean;
  hasDeskSubjects: boolean;
  hasLanguageSubjects: boolean;
}

const StructureBanner = ({
  setShowFavorites,
  showFavorites,
  setShowLmaSubjects,
  setShowDeskSubjects,
  setShowLanguageSubjects,
  showLmaSubjects,
  showDeskSubjects,
  showLanguageSubjects,
  nodeType,
  hasLmaSubjects,
  hasDeskSubjects,
  hasLanguageSubjects,
}: Props) => {
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
        <SwitchWrapper>
          <CustomFilterSwitchWrapper>
            {hasLmaSubjects && (
              <StyledSwitch
                onChange={setShowLmaSubjects}
                checked={showLmaSubjects}
                label={t('taxonomy.showLMASubject')}
                id="lma-subject-switch"
              />
            )}
            {hasDeskSubjects && (
              <StyledSwitch
                onChange={setShowDeskSubjects}
                checked={showDeskSubjects}
                label={t('taxonomy.showDeskSubject')}
                id="desk-subject-switch"
              />
            )}
            {hasLanguageSubjects && (
              <StyledSwitch
                onChange={setShowLanguageSubjects}
                checked={showLanguageSubjects}
                label={t('taxonomy.showLanguageSubject')}
                id="language-subject-switch"
              />
            )}
          </CustomFilterSwitchWrapper>
          <StyledSwitch
            onChange={setShowFavorites}
            checked={showFavorites}
            label={t('taxonomy.favorites')}
            id="favorites"
            data-testid="switch-favorites"
          />
        </SwitchWrapper>

        {isTaxonomyAdmin && (
          <Modal open={addSubjectModalOpen} onOpenChange={setAddSubjectModalOpen}>
            <ModalTrigger>
              <AddSubjectButton
                size="small"
                onClick={() => setAddSubjectModalOpen(true)}
                data-testid="AddSubjectButton"
              >
                <StyledPlusIcon />
                {t('taxonomy.addNode', { nodeType: t(`taxonomy.nodeType.${nodeType}`) })}
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
