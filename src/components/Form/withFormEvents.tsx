/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentType } from 'react';
import { FormEventProvider } from './FormEventProvider';

function withFormEventsProvider<P>(Component: ComponentType<P>) {
  return (props: P) => {
    return (
      <FormEventProvider>
        <Component {...props} />
      </FormEventProvider>
    );
  };
}

export default withFormEventsProvider;
