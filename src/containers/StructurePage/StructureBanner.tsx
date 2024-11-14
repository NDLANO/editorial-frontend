/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AddLine } from "@ndla/icons/action";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  Heading,
  DialogTitle,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { NodeType } from "@ndla/types-taxonomy";
import AddNodeModalContent from "./AddNodeModalContent";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { TAXONOMY_ADMIN_SCOPE } from "../../constants";
import { useSession } from "../Session/SessionProvider";

const SwitchWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    flexDirection: "column",
    alignItems: "flex-end",
  },
});

export const ResourceGroupBanner = styled("div", {
  base: {
    backgroundColor: "surface.brand.2.subtle",
    borderRadius: "xsmall",
    padding: "small",
    border: "1px solid",
    borderColor: "stroke.subtle",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "3xsmall",
    marginBlockEnd: "xsmall",
  },
});

const ButtonsWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

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
      <Heading textStyle="title.small">{t("taxonomy.editStructure")}</Heading>
      <ButtonsWrapper>
        {nodeType !== "PROGRAMME" && (
          <PopoverRoot>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="small" data-testid="display-options">
                {t("taxonomy.displayOptions")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <SwitchWrapper>
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
                  <SwitchRoot
                    checked={showDaSubjects}
                    onCheckedChange={(details) => setShowDaSubjects(details.checked)}
                  >
                    <SwitchLabel>{t("taxonomy.showDASubject")}</SwitchLabel>
                    <SwitchControl>
                      <SwitchThumb />
                    </SwitchControl>
                    <SwitchHiddenInput />
                  </SwitchRoot>
                )}
                {hasSaSubjects && (
                  <SwitchRoot
                    checked={showSaSubjects}
                    onCheckedChange={(details) => setShowSaSubjects(details.checked)}
                  >
                    <SwitchLabel>{t("taxonomy.showSASubject")}</SwitchLabel>
                    <SwitchControl>
                      <SwitchThumb />
                    </SwitchControl>
                    <SwitchHiddenInput />
                  </SwitchRoot>
                )}
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
              </SwitchWrapper>
            </PopoverContent>
          </PopoverRoot>
        )}

        {isTaxonomyAdmin && (
          <DialogRoot open={addSubjectModalOpen} onOpenChange={({ open }) => setAddSubjectModalOpen(open)}>
            <DialogTrigger asChild>
              <Button size="small" onClick={() => setAddSubjectModalOpen(true)} data-testid="AddSubjectButton">
                <AddLine />
                {t("taxonomy.newNode", { nodeType: t(`taxonomy.nodeType.${nodeType}`) })}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t("taxonomy.addNode", {
                    nodeType: t(`taxonomy.nodeType.${nodeType}`),
                  })}
                </DialogTitle>
                <DialogCloseButton />
              </DialogHeader>
              <DialogBody>
                <AddNodeModalContent onClose={() => setAddSubjectModalOpen(false)} nodeType={nodeType} />
              </DialogBody>
            </DialogContent>
          </DialogRoot>
        )}
      </ButtonsWrapper>
    </ResourceGroupBanner>
  );
};

export default StructureBanner;
