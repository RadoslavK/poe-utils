import React from 'react';
import {
  Route,
  Routes,
} from 'react-router-dom';
import { routes } from './routes';
import type { FC } from '../_shared/types';

export const AppRoutes: FC = () => {
  return (
    <Routes>
      {Object
        .entries(routes)
        .map(([path, { element }]) => (
          <Route
            key={path}
            path={path}
            element={element}
          />
        ))}
      <Route path="*" element={Object.values(routes)[0]?.element} />
    </Routes>
  );
};

AppRoutes.displayName = 'AppRoutes'