/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { AddLine } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@ndla/primitives";
import { ResourceType } from "@ndla/types-taxonomy";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import AddExistingResource from "../plannedResource/AddExistingResource";
import PlannedResourceForm from "../plannedResource/PlannedResourceForm";
import { ResourceWithNodeConnectionAndMeta } from "../resourceComponents/StructureResources";

interface Props {
  currentNode: ResourceWithNodeConnectionAndMeta;
  resourceTypes: Pick<ResourceType, "id" | "name">[];
  resources: ResourceWithNodeConnectionAndMeta[];
}

const PlannedResourceDialog = ({ currentNode, resourceTypes, resources }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <DialogRoot open={open} position="top" onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button size="small">
          <AddLine />
          {t("taxonomy.newResource")}
        </Button>
      </DialogTrigger>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("taxonomy.addResource")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
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
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default PlannedResourceDialog;
