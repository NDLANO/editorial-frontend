/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form } from 'formik';
import { spacing, mq } from '@ndla/core';
import styled from '@emotion/styled';

const StyledForm = styled(Form)`
  margin-top: ${spacing.normal};
  ${mq.range({ from: '37.5em' })} {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  & .c-editor__figure {
    position: relative;
  }
`;

export default StyledForm;
