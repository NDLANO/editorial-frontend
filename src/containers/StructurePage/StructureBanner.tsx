/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { Switch } from "@ndla/switch";
import { NodeType } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import AddNodeModalContent from "./AddNodeModalContent";
import { ResourceGroupBanner, StyledPlusIcon, StyledShareIcon } from "./styles";
import TaxonomyLightbox from "../../components/Taxonomy/TaxonomyLightbox";
import { TAXONOMY_ADMIN_SCOPE } from "../../constants";
import { useSession } from "../Session/SessionProvider";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const AddSubjectButton = styled(ButtonV2)`
  margin: 0 0 0 ${spacing.small};
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
  setShowDaSubjects: (checked: boolean) => void;
  setShowSaSubjects: (checked: boolean) => void;
  showLmaSubjects: boolean;
  showDaSubjects: boolean;
  showSaSubjects: boolean;
  nodeType: NodeType;
  hasLmaSubjects: boolean;
  hasDaSubjects: boolean;
  hasSaSubjects: boolean;
}

const StructureBanner = ({
  setShowFavorites,
  showFavorites,
  setShowLmaSubjects,
  setShowDaSubjects,
  setShowSaSubjects,
  showLmaSubjects,
  showDaSubjects,
  showSaSubjects,
  nodeType,
  hasLmaSubjects,
  hasDaSubjects,
  hasSaSubjects,
}: Props) => {
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);

  const { t } = useTranslation();
  const { userPermissions } = useSession();

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  return (
    <ResourceGroupBanner>
      <FlexWrapper>
        <StyledShareIcon />
        <Text textStyle="button" margin="none">
          {t("taxonomy.editStructure")}
        </Text>
      </FlexWrapper>
      <FlexWrapper>
        <SwitchWrapper>
          <CustomFilterSwitchWrapper>
            {hasLmaSubjects && (
              <StyledSwitch
                onChange={setShowLmaSubjects}
                checked={showLmaSubjects}
                label={t("taxonomy.showLMASubject")}
                id="lma-subject-switch"
              />
            )}
            {hasDaSubjects && (
              <StyledSwitch
                onChange={setShowDaSubjects}
                checked={showDaSubjects}
                label={t("taxonomy.showDASubject")}
                id="desk-subject-switch"
              />
            )}
            {hasSaSubjects && (
              <StyledSwitch
                onChange={setShowSaSubjects}
                checked={showSaSubjects}
                label={t("taxonomy.showSASubject")}
                id="language-subject-switch"
              />
            )}
          </CustomFilterSwitchWrapper>
          <StyledSwitch
            onChange={setShowFavorites}
            checked={showFavorites}
            label={t("taxonomy.favorites")}
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
                {t("taxonomy.newNode", { nodeType: t(`taxonomy.nodeType.${nodeType}`) })}
              </AddSubjectButton>
            </ModalTrigger>
            <ModalContent position="top">
              <TaxonomyLightbox
                title={t("taxonomy.addNode", {
                  nodeType: t(`taxonomy.nodeType.${nodeType}`),
                })}
              >
                <AddNodeModalContent onClose={() => setAddSubjectModalOpen(false)} nodeType={nodeType} />
              </TaxonomyLightbox>
            </ModalContent>
          </Modal>
        )}
      </FlexWrapper>
    </ResourceGroupBanner>
  );
};

export default StructureBanner;
