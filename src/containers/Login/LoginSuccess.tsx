/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { parseHash } from "../../util/authHelpers";
import { useSession } from "../Session/SessionProvider";

export const LoginSuccess = () => {
  const { login } = useSession();
  useEffect(() => {
    parseHash().then((res) => login(res));
  }, [login]);

  return null;
};
export default LoginSuccess;
