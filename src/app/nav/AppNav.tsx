import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from './routes';
import type { FC } from '../_shared/types';

export const AppNav: FC = () => {
  return (
    <div>
      {Object
        .entries(routes)
        .map(([path, { label }]) => (
          <Link
            key={path}
            to={path}
          >
            {label}
          </Link>
        ))}
    </div>
  );
};

AppNav.displayName = 'AppNav';