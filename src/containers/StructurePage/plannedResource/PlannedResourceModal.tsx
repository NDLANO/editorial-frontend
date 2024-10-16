/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonV2 } from "@ndla/button";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "@ndla/primitives";
import { ResourceType } from "@ndla/types-taxonomy";
import TaxonomyLightbox from "../../../components/Taxonomy/TaxonomyLightbox";
import AddExistingResource from "../plannedResource/AddExistingResource";
import PlannedResourceForm from "../plannedResource/PlannedResourceForm";
import { ResourceWithNodeConnectionAndMeta } from "../resourceComponents/StructureResources";
import { StyledPlusIcon } from "../styles";

interface Props {
  currentNode: ResourceWithNodeConnectionAndMeta;
  resourceTypes: Pick<ResourceType, "id" | "name">[];
  resources: ResourceWithNodeConnectionAndMeta[];
}

const PlannedResourceModal = ({ currentNode, resourceTypes, resources }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Modal open={open} onOpenChange={setOpen} modal={false}>
      <ModalTrigger>
        <ButtonV2 size="small">
          <StyledPlusIcon />
          {t("taxonomy.newResource")}
        </ButtonV2>
      </ModalTrigger>
      <ModalContent size={{ width: "normal", height: "large" }} position="top" forceOverlay>
        <TaxonomyLightbox title={t("taxonomy.addResource")}>
          <TabsRoot
            defaultValue={"create-new-resource"}
            translations={{
              listLabel: t("taxonomy.addResource"),
            }}
          >
            <TabsList>
              <TabsTrigger value="create-new-resource">{t("taxonomy.createResource")}</TabsTrigger>
              <TabsTrigger value="get-existing-resource">{t("taxonomy.getExisting")}</TabsTrigger>
              <TabsIndicator />
            </TabsList>
            <TabsContent value="create-new-resource">
              <PlannedResourceForm onClose={() => setOpen(false)} articleType="standard" node={currentNode} />
            </TabsContent>
            <TabsContent value="get-existing-resource">
              <AddExistingResource
                resourceTypes={resourceTypes}
                nodeId={currentNode.id}
                onClose={() => setOpen(false)}
                existingResourceIds={resources.map((r) => r.id)}
              />
            </TabsContent>
          </TabsRoot>
        </TaxonomyLightbox>
      </ModalContent>
    </Modal>
  );
};

export default PlannedResourceModal;
