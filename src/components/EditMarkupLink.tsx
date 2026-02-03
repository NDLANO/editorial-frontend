/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CodeView } from "@ndla/icons";
import { SafeLinkIconButton } from "@ndla/safelink";
import { useLocation } from "react-router";

interface Props {
  to: string;
  title: string;
}

export const EditMarkupLink = ({ title, to }: Props) => {
  const location = useLocation();

  return (
    <SafeLinkIconButton
      variant="tertiary"
      data-testid="edit-markup-link"
      size="small"
      state={{ backUrl: location.pathname + location.search }}
      to={{ pathname: to }}
      title={title}
      aria-label={title}
    >
      <CodeView />
    </SafeLinkIconButton>
  );
};
