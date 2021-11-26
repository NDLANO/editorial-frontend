import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
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

interface Props {
  type: 'media';
  subtypes: SubType[];
}

const SubNavigation = ({ subtypes, type }: Props) => (
  <div {...classes('container', colorType[type])}>
    <div {...classes('items')}>
      {subtypes.map(subtype => (
        <NavLink
          key={`typemenu_${subtype.type}`}
          id={subtype.type}
          to={subtype.url}
          className={({ isActive }) => classes('item', isActive ? 'active' : '').className}>
          {subtype.icon}
          <span>{subtype.title}</span>
        </NavLink>
      ))}
    </div>
  </div>
);

export default SubNavigation;
