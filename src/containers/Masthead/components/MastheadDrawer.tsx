/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { CloseLine, MenuLine } from "@ndla/icons/action";
import { ExternalLinkLine } from "@ndla/icons/common";
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
  IconButton,
  Text,
} from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { MastheadLinks } from "./MastheadLinks";
import { MastheadSessionLink } from "./MastheadSessionLink";
import config from "../../../config";
import { AUDIO_ADMIN_SCOPE, DRAFT_ADMIN_SCOPE, FRONTPAGE_ADMIN_SCOPE, TAXONOMY_ADMIN_SCOPE } from "../../../constants";
import { routes } from "../../../util/routeHelpers";
import { useSession } from "../../Session/SessionProvider";

const StyledNav = styled("nav", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    mobileWide: {
      maxHeight: "surface.small",
      height: "surface.small",
    },
  },
});

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    whiteSpace: "nowrap",
    fontWeight: "normal",
    width: "100%",
    justifyContent: "flex-start",
  },
});

const ListWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    width: "fit-content",
  },
});

const StyledList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const StyledListItem = styled("li", {
  base: {
    width: "100%",
  },
});

const StyledText = styled(Text, {
  base: {
    marginInlineStart: "xsmall",
  },
});

const StyledDialogHeader = styled(DialogHeader, {
  base: {
    justifyContent: "flex-end",
  },
});

const StyledMastheadLinks = styled(MastheadLinks, {
  base: {
    marginInlineStart: "xsmall",
  },
});

const StyledDialogBody = styled(DialogBody, {
  base: {
    gap: "large",
  },
});

const LinksWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
    alignItems: "center",
    desktop: {
      display: "none",
    },
  },
});

interface MenuItem {
  to: string;
  text: string;
  permission?: string;
  external?: boolean;
}

interface MenuList {
  id: string;
  items: MenuItem[];
}

const createItems: MenuItem[] = [
  { to: routes.concept.create, text: "subNavigation.newConcept" },
  { to: routes.gloss.create, text: "subNavigation.newGloss" },
  { to: routes.image.create, text: "subNavigation.image" },
  { to: routes.audio.create, text: "subNavigation.audio" },
  { to: routes.podcast.create, text: "subNavigation.podcast" },
];

const editItems: MenuItem[] = [
  {
    to: routes.taxonomy.structure(),
    text: "subNavigation.structure",
  },
];

const adminItems: MenuItem[] = [
  {
    to: routes.taxonomy.versions,
    text: "subNavigation.taxonomyVersions",
    permission: TAXONOMY_ADMIN_SCOPE,
  },
  { to: routes.programme, text: "subNavigation.programme", permission: TAXONOMY_ADMIN_SCOPE },
  { to: routes.film.edit(), text: "subNavigation.film", permission: FRONTPAGE_ADMIN_SCOPE },
  {
    to: routes.frontpage.structure,
    text: "subNavigation.frontpage",
    permission: FRONTPAGE_ADMIN_SCOPE,
  },
  { to: config.brightcoveUrl, text: "subNavigation.brightcoveLink", external: true, permission: DRAFT_ADMIN_SCOPE },
  { to: routes.frontpage.create, text: "subNavigation.newFrontpageArticle", permission: FRONTPAGE_ADMIN_SCOPE },
  { to: routes.podcastSeries.create, text: "subNavigation.podcastSeries", permission: AUDIO_ADMIN_SCOPE },
];

const externalItems: MenuItem[] = [
  { to: config.learningpathFrontendDomain, text: "subNavigation.learningPathLink", external: true },

  { to: routes.h5p.edit, text: "subNavigation.h5p" },
];

const lists: MenuList[] = [
  {
    id: "create",
    items: createItems,
  },
  {
    id: "edit",
    items: editItems,
  },
  {
    id: "admin",
    items: adminItems,
  },
  {
    id: "external",
    items: externalItems,
  },
];

export const MastheadDrawer = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const filteredLists = lists.reduce<MenuList[]>((acc, list) => {
    const filteredItems = list.items.filter((item) => !item.permission || userPermissions?.includes(item.permission));

    if (!filteredItems.length) {
      return acc;
    }

    acc.push({
      ...list,
      items: filteredItems,
    });

    return acc;
  }, []);

  return (
    <DialogRoot
      variant="drawer"
      position="left"
      size="small"
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
    >
      <DialogTrigger asChild>
        <IconButton variant="clear" aria-label={t("masthead.menu.title")} title={t("masthead.menu.title")}>
          <MenuLine />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <StyledDialogHeader>
          <DialogCloseTrigger asChild>
            <Button variant="tertiary" size="small">
              <CloseLine />
              {t("close")}
            </Button>
          </DialogCloseTrigger>
        </StyledDialogHeader>
        <StyledDialogBody>
          <LinksWrapper>
            <StyledMastheadLinks />
            <MastheadSessionLink />
          </LinksWrapper>
          <StyledNav>
            {filteredLists.map((list) => (
              <ListWrapper key={list.id}>
                <StyledText id={list.id} textStyle="label.medium" fontWeight="bold">
                  {t(`subNavigation.listTitle.${list.id}`)}
                </StyledText>
                <StyledList aria-describedby={list.id}>
                  {list.items.map((item) => (
                    <StyledListItem key={item.to}>
                      <StyledSafeLinkButton
                        size="small"
                        variant="tertiary"
                        target={item.external ? "_blank" : undefined}
                        to={item.to}
                      >
                        {t(item.text)}
                        {!!item.external && <ExternalLinkLine />}
                      </StyledSafeLinkButton>
                    </StyledListItem>
                  ))}
                </StyledList>
              </ListWrapper>
            ))}
          </StyledNav>
        </StyledDialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
