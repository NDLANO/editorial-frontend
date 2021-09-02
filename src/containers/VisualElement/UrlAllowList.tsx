import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  allowList: {
    name: string;
    url: string[];
  }[];
}

const UrlAllowList = ({ allowList }: Props) => {
  const { t } = useTranslation();

  const filteredAllowList = allowList.filter(
    e => !e.url.find(url => url.includes('test.ndla') || url.includes('staging.ndla')),
  );
  return (
    <table className="c-table">
      <thead>
        <tr>
          <th>{t('form.content.link.name')}</th>
          <th>{t('form.content.link.domains')}</th>
        </tr>
      </thead>
      <tbody>
        {filteredAllowList
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(provider => (
            <tr>
              <td>{provider.name}</td>
              <td>
                {provider.url.map(url => (
                  <div>{url}</div>
                ))}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default UrlAllowList;
