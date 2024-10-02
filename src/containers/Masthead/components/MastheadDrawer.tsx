/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType } from "react";
import { useTranslation } from "react-i18next";
import { CloseLine, List, MenuLine } from "@ndla/icons/action";
import { Audio, PlayLine, Podcast } from "@ndla/icons/common";
import { SubjectMaterial } from "@ndla/icons/contentType";
import { CameraLine, Concept, Globe, H5P, Learningpath, Taxonomy, Video } from "@ndla/icons/editor";
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
import { AUDIO_ADMIN_SCOPE, FRONTPAGE_ADMIN_SCOPE, TAXONOMY_ADMIN_SCOPE } from "../../../constants";
import { routes } from "../../../util/routeHelpers";
import { useSession } from "../../Session/SessionProvider";

const StyledNav = styled("nav", {
  base: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    columnGap: "xxlarge",
    rowGap: "medium",
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
    // justifyContent: "flex-end",
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
  icon: ElementType;
  to: string;
  text: string;
  permission?: string;
}

interface MenuList {
  id: string;
  title: string;
  items: MenuItem[];
  permission?: string;
}

const createItems: MenuItem[] = [
  { icon: Concept, to: routes.concept.create, text: "subNavigation.newConcept" },
  { icon: Globe, to: routes.gloss.create, text: "subNavigation.newGloss" },
  { icon: CameraLine, to: routes.image.create, text: "subNavigation.image" },
  { icon: Audio, to: routes.audio.create, text: "subNavigation.audio" },
  { icon: Podcast, to: routes.podcast.create, text: "subNavigation.podcast" },
  { icon: List, to: routes.podcastSeries.create, text: "subNavigation.podcastSeries", permission: AUDIO_ADMIN_SCOPE },
];

const editItems: MenuItem[] = [
  { icon: PlayLine, to: routes.film.edit(), text: "subNavigation.film" },
  { icon: H5P, to: routes.h5p.edit, text: "subNavigation.h5p" },
];

const adminItems: MenuItem[] = [
  {
    icon: Taxonomy,
    to: routes.taxonomy.versions,
    text: "subNavigation.taxonomyVersions",
    permission: TAXONOMY_ADMIN_SCOPE,
  },
  {
    icon: Taxonomy,
    to: routes.taxonomy.structure(),
    text: "subNavigation.structure",
    permission: TAXONOMY_ADMIN_SCOPE,
  },
];

const externalItems: MenuItem[] = [
  { icon: Video, to: config.brightcoveUrl, text: "subNavigation.brightcoveLink" },
  { icon: Learningpath, to: config.learningpathFrontendDomain, text: "subNavigation.learningPathLink" },
];

const frontpageLinks: MenuItem[] = [
  { icon: SubjectMaterial, to: routes.frontpage.create, text: "subNavigation.newFrontpageArticle" },
  {
    icon: SubjectMaterial,
    to: routes.frontpage.structure,
    text: "subNavigation.frontpage",
    permission: FRONTPAGE_ADMIN_SCOPE,
  },
];

const lists: MenuList[] = [
  {
    id: "create",
    title: "Opprett",
    items: createItems,
  },
  {
    id: "edit",
    title: "Rediger",
    items: editItems,
  },
  {
    id: "admin",
    title: "Admin",
    items: adminItems,
    permission: TAXONOMY_ADMIN_SCOPE,
  },
  {
    id: "external",
    title: "Eksterne ressurser",
    items: externalItems,
  },
  {
    id: "frontpage",
    title: "Om NDLA",
    items: frontpageLinks,
  },
];

export const MastheadDrawer = () => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();

  const filteredLists = lists.reduce<MenuList[]>((acc, list) => {
    if (list.permission && !userPermissions?.includes(list.permission)) {
      return acc;
    }

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
    <DialogRoot variant="drawer" position="left">
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
              <ListWrapper key={list.title}>
                <StyledText id={list.id} textStyle="label.medium" fontWeight="bold">
                  {list.title}
                </StyledText>
                <StyledList aria-describedby={list.id}>
                  {list.items.map((item) => (
                    <StyledListItem key={item.to}>
                      <StyledSafeLinkButton size="small" variant="tertiary" to={item.to}>
                        <item.icon />
                        {t(item.text)}
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
