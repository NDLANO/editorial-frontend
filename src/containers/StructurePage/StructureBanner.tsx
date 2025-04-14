/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { AddLine } from "@ndla/icons";
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
import AddNodeDialogContent from "./AddNodeDialogContent";
import { usePreferences } from "./PreferencesProvider";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import config from "../../config";
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
  nodeType: NodeType;
  hasLmaSubjects: boolean;
  hasDaSubjects: boolean;
  hasSaSubjects: boolean;
}

const StructureBanner = ({ nodeType, hasLmaSubjects, hasDaSubjects, hasSaSubjects }: Props) => {
  const [addSubjectDialogOpen, setAddSubjectDialogOpen] = useState(false);
  const {
    showFavorites,
    setShowFavorites,
    showLmaSubjects,
    setShowLmaSubjects,
    showDaSubjects,
    setShowDaSubjects,
    showSaSubjects,
    setShowSaSubjects,
    showQuality,
    setShowQuality,
    showMatomoStats,
    setShowMatomoStats,
  } = usePreferences();

  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const [params] = useSearchParams();
  const enableMatomo = params.get("enableMatomo") === "true";

  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  return (
    <ResourceGroupBanner>
      <Heading textStyle="title.small">{t("taxonomy.editStructure")}</Heading>
      <ButtonsWrapper>
        <PopoverRoot>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="small" data-testid="display-options">
              {t("taxonomy.displayOptions")}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <SwitchWrapper>
              {!!hasLmaSubjects && (
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
              {!!hasDaSubjects && (
                <SwitchRoot checked={showDaSubjects} onCheckedChange={(details) => setShowDaSubjects(details.checked)}>
                  <SwitchLabel>{t("taxonomy.showDASubject")}</SwitchLabel>
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                  <SwitchHiddenInput />
                </SwitchRoot>
              )}
              {!!hasSaSubjects && (
                <SwitchRoot checked={showSaSubjects} onCheckedChange={(details) => setShowSaSubjects(details.checked)}>
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
              {nodeType !== "PROGRAMME" && (
                <>
                  <SwitchRoot checked={showQuality} onCheckedChange={(details) => setShowQuality(details.checked)}>
                    <SwitchLabel>{t("taxonomy.quality")}</SwitchLabel>
                    <SwitchControl>
                      <SwitchThumb />
                    </SwitchControl>
                    <SwitchHiddenInput />
                  </SwitchRoot>
                  {config.enableMatomoData || enableMatomo ? (
                    <SwitchRoot
                      checked={showMatomoStats}
                      onCheckedChange={(details) => setShowMatomoStats(details.checked)}
                    >
                      <SwitchLabel>{t("matomo.switchLabel")}</SwitchLabel>
                      <SwitchControl>
                        <SwitchThumb />
                      </SwitchControl>
                      <SwitchHiddenInput />
                    </SwitchRoot>
                  ) : undefined}
                </>
              )}
            </SwitchWrapper>
          </PopoverContent>
        </PopoverRoot>

        {!!isTaxonomyAdmin && (
          <DialogRoot open={addSubjectDialogOpen} onOpenChange={({ open }) => setAddSubjectDialogOpen(open)}>
            <DialogTrigger asChild>
              <Button size="small" onClick={() => setAddSubjectDialogOpen(true)} data-testid="AddSubjectButton">
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
                <AddNodeDialogContent onClose={() => setAddSubjectDialogOpen(false)} nodeType={nodeType} />
              </DialogBody>
            </DialogContent>
          </DialogRoot>
        )}
      </ButtonsWrapper>
    </ResourceGroupBanner>
  );
};

export default StructureBanner;
