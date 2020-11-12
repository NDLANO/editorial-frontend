/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
  getNdlaUserName,
  getNdlaUserEmail,
  isAccessTokenValid,
} from '../../util/authHelpers';
import config from '../../config';

const Zendesk = authenticated => {
  useEffect(() => {
    if (authenticated && isAccessTokenValid()) {
      const payload = {
        name: getNdlaUserName(),
        email: getNdlaUserEmail(),
        iat: Math.floor(Date.now() / 1000),
        jti: uuidv4(),
      };
      const zendeskToken = jwt.sign(payload, config.zendeskWidgetSecret);

      const zeSettings = document.createElement('script');
      zeSettings.type = 'text/javascript';
      zeSettings.innerHTML = `
          window.zESettings = {
            webWidget: {
              authenticate: {
                  jwtFn: function(callback) {
                      callback('${zendeskToken}');
                  }
              }
            }
        };
      `;
      document.body.appendChild(zeSettings);

      const zeScript = document.createElement('script');
      zeScript.id = 'ze-snippet';
      zeScript.src = `https://static.zdassets.com/ekr/snippet.js?key=${config.zendeskWidgetKey}`;
      document.body.appendChild(zeScript);
    }
  }, []);

  return <div />;
};

export default Zendesk;
