/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { HTMLArkProps } from "@ark-ui/react";
import { Heading, Text, TextProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { WithCss } from "@ndla/styled-system/types";
import { SegmentHeader } from "../../components/Form/SegmentHeader";

export const FormHeaderSegment = styled(SegmentHeader, {
  base: {
    paddingBlock: "3xsmall",
    marginBlock: "xsmall",
  },
});

export const FormHeaderHeadingContainer = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "3xsmall",
  },
});

interface FormHeaderHeadingProps extends TextProps, Omit<HTMLArkProps<"h1">, "color">, WithCss {
  contentType: string;
}

export const FormHeaderHeading = ({ contentType, children, ...props }: FormHeaderHeadingProps) => {
  const { t } = useTranslation();
  return (
    <Heading textStyle="title.medium" {...props}>
      {children ?? t("form.createNew", { type: t(`contentTypes.${contentType}`) })}
    </Heading>
  );
};

export const FormHeaderStatusWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    gap: "3xsmall",
  },
});

const StyledText = styled(Text, {
  base: {
    display: "flex",
    "& > *": {
      flex: "1",
    },
  },
});

interface FormHeaderResponsibleInfoProps {
  responsibleName: string | undefined;
}

export const FormHeaderResponsibleInfo = ({ responsibleName }: FormHeaderResponsibleInfoProps) => {
  const { t } = useTranslation();
  return (
    <StyledText textStyle="label.xsmall">
      <b>{`${t("form.responsible.label")}: `}</b>
      {responsibleName || t("form.responsible.noResponsible")}
    </StyledText>
  );
};

interface FormHeaderStatusInfoProps {
  isNewLanguage: boolean;
  statusText: string | undefined;
}

export const FormHeaderStatusInfo = ({ isNewLanguage, statusText }: FormHeaderStatusInfoProps) => {
  const { t } = useTranslation();
  return (
    <StyledText textStyle="label.xsmall">
      <b>{`${t("form.workflow.statusLabel")}: `}</b>
      {isNewLanguage ? t("form.status.new_language") : statusText || t("form.status.new")}
    </StyledText>
  );
};
