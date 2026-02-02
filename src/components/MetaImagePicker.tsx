/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ReactNode, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogCloseButton } from "./DialogCloseButton";

interface Props {
  imageSearch: (close: VoidFunction) => ReactNode;
  imageForm: (close: VoidFunction) => ReactNode;
  children?: ReactNode;
}

const StyledTabsContent = styled(TabsContent, {
  base: {
    "& > *": {
      width: "100%",
    },
  },
});

export const MetaImagePicker = ({ imageSearch, imageForm, children }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const onClose = useCallback(() => setOpen(false), []);
  return (
    <DialogRoot role="alertdialog" size="large" open={open} onOpenChange={(details) => setOpen(details.open)}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("form.metaImage.add")}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <TabsRoot defaultValue="image" translations={{ listLabel: t("form.visualElement.image") }}>
            <TabsList>
              <TabsTrigger value="image">{t("form.visualElement.image")}</TabsTrigger>
              <TabsTrigger value="uploadImage">{t("form.visualElement.imageUpload")}</TabsTrigger>
              <TabsIndicator />
            </TabsList>
            <StyledTabsContent value="image">{imageSearch(onClose)}</StyledTabsContent>
            <StyledTabsContent value="uploadImage">{imageForm(onClose)}</StyledTabsContent>
          </TabsRoot>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
