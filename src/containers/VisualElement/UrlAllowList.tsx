import React from 'react';
import { useTranslation } from 'react-i18next';

interface AllowListEntry {
  name: string;
  url: string[];
}

interface Props {
  allowList: AllowListEntry[];
}

const removeTestDomains = (entry: AllowListEntry) => ({
  ...entry,
  url: entry.url.filter(url => !url.includes('test.ndla') && !url.includes('staging.ndla')),
});

const sortEntries = (a: AllowListEntry, b: AllowListEntry) => a.name.localeCompare(b.name);

const UrlAllowList = ({ allowList }: Props) => {
  const { t } = useTranslation();

  const filteredAllowList = allowList.map(removeTestDomains).sort(sortEntries);
  return (
    <table className="c-table">
      <thead>
        <tr>
          <th>{t('form.content.link.name')}</th>
          <th>{t('form.content.link.domains')}</th>
        </tr>
      </thead>
      <tbody>
        {filteredAllowList.map(provider => (
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
