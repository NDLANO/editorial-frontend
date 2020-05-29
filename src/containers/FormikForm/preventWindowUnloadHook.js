/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';

const usePreventWindowUnload = preventDefault => {
  useEffect(() => {
    if (preventDefault) {
      const handleBeforeUnload = event => {
        event.preventDefault();
        return (event.returnValue = '');
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () =>
        window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [preventDefault]);
};

export default usePreventWindowUnload;
