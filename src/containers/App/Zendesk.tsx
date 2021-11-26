/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Fragment, useEffect } from 'react';
import { isAccessTokenValid } from '../../util/authHelpers';
import { fetchZendeskToken } from '../../modules/auth0/auth0Api';
import config from '../../config';
import { useSession } from '../Session/SessionProvider';

const Zendesk = () => {
  const { authenticated } = useSession();
  const addScriptsToPage = async () => {
    const zendeskToken = await fetchZendeskToken();

    const zeSettings = document.createElement('script');
    zeSettings.type = 'text/javascript';
    zeSettings.innerHTML = `
          window.zESettings = {
            webWidget: {
              authenticate: {
                  jwtFn: function(callback) {
                      callback('${zendeskToken.token}');
                  }
              }
            }
        };
      `;
    document.body.appendChild(zeSettings);

    if (config.zendeskWidgetKey) {
      const zeScript = document.createElement('script');
      zeScript.id = 'ze-snippet';
      zeScript.src = `https://static.zdassets.com/ekr/snippet.js?key=${config.zendeskWidgetKey}`;
      document.body.appendChild(zeScript);
    }
  };

  useEffect(() => {
    if (authenticated && isAccessTokenValid()) {
      addScriptsToPage();
    }
  }, [authenticated]);

  return <Fragment />;
};

export default Zendesk;
