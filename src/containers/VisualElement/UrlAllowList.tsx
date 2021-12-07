import { css } from '@emotion/core';
import { useTranslation } from 'react-i18next';

interface AllowListEntry {
  name: string;
  url: string[];
}

interface Props {
  allowList: AllowListEntry[];
}

const sortEntries = (a: AllowListEntry, b: AllowListEntry) => a.name.localeCompare(b.name);

const UrlAllowList = ({ allowList }: Props) => {
  const { t } = useTranslation();

  const filteredAllowList = allowList.sort(sortEntries);
  return (
    <table
      className="c-table"
      css={css`
        display: table;
        margin-right: auto !important;
        margin-left: auto !important;
      `}>
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
