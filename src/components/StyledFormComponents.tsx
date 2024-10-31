/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form } from "formik";
import styled from "@emotion/styled";
import { spacing, mq } from "@ndla/core";

const StyledForm = styled(Form)`
  width: 100%;
  margin-top: ${spacing.normal};
  ${mq.range({ from: "37.5em" })} {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
`;

export default StyledForm;
