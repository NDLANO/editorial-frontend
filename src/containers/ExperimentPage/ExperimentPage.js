/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Suspense } from 'react';
import { OneColumn } from '@ndla/ui';

const MonacoEditor = React.lazy(() =>
  import('../../components/MonacoEditor/MonacoEditor'),
);

class ExperimentPage extends React.Component {
  render() {
    return (
      <OneColumn>
        <Suspense fallback={<div>Loading...</div>}>
          <MonacoEditor />
        </Suspense>
      </OneColumn>
    );
  }
}
ExperimentPage.propTypes = {};

export default ExperimentPage;
