/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { Tabs } from "@ndla/tabs";
import { ResourceType } from "@ndla/types-taxonomy";
import TaxonomyLightbox from "../../../components/Taxonomy/TaxonomyLightbox";
import AddExistingResource from "../plannedResource/AddExistingResource";
import PlannedResourceForm from "../plannedResource/PlannedResourceForm";
import { ResourceWithNodeConnectionAndMeta } from "../resourceComponents/StructureResources";
import { StyledPlusIcon } from "../StructureBanner";

const FullWidth = styled.div`
  width: 100%;
`;

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
          <FullWidth>
            <Tabs
              tabs={[
                {
                  title: t("taxonomy.createResource"),
                  id: "create-new-resource",
                  content: (
                    <PlannedResourceForm onClose={() => setOpen(false)} articleType="standard" node={currentNode} />
                  ),
                },
                {
                  title: t("taxonomy.getExisting"),
                  id: "get-existing-resource",
                  content: (
                    <AddExistingResource
                      resourceTypes={resourceTypes}
                      nodeId={currentNode.id}
                      onClose={() => setOpen(false)}
                      existingResourceIds={resources.map((r) => r.id)}
                    />
                  ),
                },
              ]}
            />
          </FullWidth>
        </TaxonomyLightbox>
      </ModalContent>
    </Modal>
  );
};

export default PlannedResourceModal;
