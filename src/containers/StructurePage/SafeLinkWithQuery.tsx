/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLocation } from "react-router";
import { SafeLink, SafeLinkProps } from "@ndla/safelink";

export const SafeLinkWithQuery = ({ children, to, ...props }: SafeLinkProps) => {
  const { search } = useLocation();

  return (
    <SafeLink to={to + search} {...props}>
      {children}
    </SafeLink>
  );
};
