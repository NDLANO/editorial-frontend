/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { CloseLine, DeleteBinLine } from "@ndla/icons";
import {
  Button,
  IconButton,
  PopoverContent,
  PopoverDescription,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    width: "surface.medium",
  },
});

const PopoverHeader = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "medium",
  },
});

const PopoverHeaderButtons = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

const StyledPopoverDescription = styled(PopoverDescription, {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "3xsmall",
  },
});

const StyledButton = styled(Button, {
  base: {
    width: "xxlarge",
  },
});

interface Props extends PropsWithChildren {
  open: boolean;
  handleOpenChange: (value: boolean, shouldDelete?: boolean) => void;
  handleSymbolClick: (value: string) => void;
}

export const SymbolPopover = ({ open, handleOpenChange, handleSymbolClick, children }: Props) => {
  const { t } = useTranslation();
  const symbols = t("symbols", { returnObjects: true }) as Record<string, string>;

  return (
    <PopoverRoot open={open} onOpenChange={(details) => handleOpenChange(details.open)}>
      <PopoverTrigger asChild type={undefined}>
        {children}
      </PopoverTrigger>
      <Portal>
        <StyledPopoverContent>
          <PopoverHeader>
            <PopoverTitle>{t("form.content.symbol.title")}</PopoverTitle>
            <PopoverHeaderButtons>
              <IconButton
                variant="danger"
                size="small"
                aria-label={t("form.workflow.deleteComment.title")}
                title={t("form.workflow.deleteComment.title")}
                onClick={() => handleOpenChange(false, true)}
              >
                <DeleteBinLine />
              </IconButton>
              <IconButton
                variant="tertiary"
                size="small"
                aria-label={t("form.close")}
                title={t("form.close")}
                onClick={() => handleOpenChange(false)}
              >
                <CloseLine />
              </IconButton>
            </PopoverHeaderButtons>
          </PopoverHeader>
          <StyledPopoverDescription>
            {Object.entries(symbols).map(([symbol, label]) => (
              <TooltipRoot key={symbol} openDelay={0}>
                <TooltipTrigger asChild>
                  <StyledButton
                    variant="secondary"
                    onClick={() => handleSymbolClick(symbol)}
                    aria-label={label}
                    data-testid={`button-${symbol}`}
                  >
                    {symbol}
                  </StyledButton>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </TooltipRoot>
            ))}
          </StyledPopoverDescription>
        </StyledPopoverContent>
      </Portal>
    </PopoverRoot>
  );
};
