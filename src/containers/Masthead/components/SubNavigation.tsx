import { ReactElement } from 'react';
import { withRouter, NavLink, RouteComponentProps } from 'react-router-dom';
import { UseQueryResult } from 'react-query';
import { classes } from './Navigation';
import { SearchType } from '../../../interfaces';
import { SearchParams } from '../../SearchPage/components/form/SearchForm';
import { ResultType } from '../../SearchPage/SearchContainer';

interface SubType {
  title: string;
  type: SearchType;
  url: string;
  icon: ReactElement;
  path: string;
  searchHook: (query: SearchParams) => UseQueryResult<ResultType>;
}

const colorType = {
  media: 'brand-color',
  'subject-matter': 'article-color',
};

interface Props extends RouteComponentProps {
  type: 'media';
  subtypes: SubType[];
}

const isCurrentTab = (location: RouteComponentProps['location'], subtype: SubType) => {
  const locations = location.pathname.split('/') ?? [];
  if (locations.length > 2 && locations[2] === subtype.type) {
    return true;
  }
  return false;
};

const SubNavigation = ({ subtypes, type, location }: Props) => (
  <div {...classes('container', colorType[type])}>
    <div {...classes('items')}>
      {subtypes.map(subtype => (
        <NavLink
          key={`typemenu_${subtype.type}`}
          id={subtype.type}
          to={subtype.url}
          isActive={() => isCurrentTab(location, subtype)}
          {...classes('item')}
          activeClassName="c-navigation__item--active">
          {subtype.icon}
          <span>{subtype.title}</span>
        </NavLink>
      ))}
    </div>
  </div>
);

export default withRouter(SubNavigation);
