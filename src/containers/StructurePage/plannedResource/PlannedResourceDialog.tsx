/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useDialogContext } from "@ark-ui/react";
import {
  DialogBody,
  DialogHeader,
  DialogTitle,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@ndla/primitives";
import { Node, ResourceType } from "@ndla/types-taxonomy";
import { useTranslation } from "react-i18next";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import AddExistingResource from "../plannedResource/AddExistingResource";
import PlannedResourceForm from "../plannedResource/PlannedResourceForm";
import { ResourceGroup } from "../utils";

interface Props {
  currentNode: Node;
  resourceTypes: ResourceType[];
  existingResourceIds: string[];
  supplementary?: boolean;
  type: Exclude<ResourceGroup, "link">;
}

export const PlannedResourceDialogContent = ({ currentNode, resourceTypes, existingResourceIds, type }: Props) => {
  const { t } = useTranslation();
  const { setOpen } = useDialogContext();
  return (
    <>
      <DialogHeader>
        <DialogTitle>{t(`taxonomy.${type}.dialogTitle`)}</DialogTitle>
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
            <PlannedResourceForm onClose={() => setOpen(false)} type={type} node={currentNode} />
          </TabsContent>
          <TabsContent value="get-existing-resource">
            <AddExistingResource
              type={type}
              resourceTypes={resourceTypes}
              nodeId={currentNode.id}
              onClose={() => setOpen(false)}
              existingResourceIds={existingResourceIds}
            />
          </TabsContent>
        </TabsRoot>
      </DialogBody>
    </>
  );
};
