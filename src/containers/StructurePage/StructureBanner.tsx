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
import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb, Text } from "@ndla/primitives";
import { NodeType } from "@ndla/types-taxonomy";
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

const SwitchGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xxsmall};
  align-items: flex-end;
  justify-content: center;
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
  showQuality: boolean;
  setShowQuality: (checked: boolean) => void;
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
  showQuality,
  setShowQuality,
}: Props) => {
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);

  const { t } = useTranslation();
  const { userPermissions } = useSession();

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  return (
    <ResourceGroupBanner>
      <FlexWrapper>
        <StyledShareIcon />
        <Text textStyle="label.small" fontWeight="bold">
          {t("taxonomy.editStructure")}
        </Text>
      </FlexWrapper>
      <FlexWrapper>
        {nodeType !== "PROGRAMME" && (
          <SwitchWrapper>
            <SwitchGroupWrapper>
              {hasLmaSubjects && (
                <SwitchRoot
                  checked={showLmaSubjects}
                  onCheckedChange={(details) => setShowLmaSubjects(details.checked)}
                >
                  <SwitchLabel>{t("taxonomy.showLMASubject")}</SwitchLabel>
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                  <SwitchHiddenInput />
                </SwitchRoot>
              )}
              {hasDaSubjects && (
                <SwitchRoot checked={showDaSubjects} onCheckedChange={(details) => setShowDaSubjects(details.checked)}>
                  <SwitchLabel>{t("taxonomy.showDASubject")}</SwitchLabel>
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                  <SwitchHiddenInput />
                </SwitchRoot>
              )}
              {hasSaSubjects && (
                <SwitchRoot checked={showSaSubjects} onCheckedChange={(details) => setShowSaSubjects(details.checked)}>
                  <SwitchLabel>{t("taxonomy.showSASubject")}</SwitchLabel>
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                  <SwitchHiddenInput />
                </SwitchRoot>
              )}
            </SwitchGroupWrapper>
            <SwitchGroupWrapper>
              <SwitchRoot
                checked={showFavorites}
                data-testid="switch-favorites"
                onCheckedChange={(details) => setShowFavorites(details.checked)}
              >
                <SwitchLabel>{t("taxonomy.favorites")}</SwitchLabel>
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchHiddenInput />
              </SwitchRoot>
              <SwitchRoot checked={showQuality} onCheckedChange={(details) => setShowQuality(details.checked)}>
                <SwitchLabel>{t("taxonomy.quality")}</SwitchLabel>
                <SwitchControl>
                  <SwitchThumb />
                </SwitchControl>
                <SwitchHiddenInput />
              </SwitchRoot>
            </SwitchGroupWrapper>
          </SwitchWrapper>
        )}

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
