import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppNav } from './nav/AppNav';
import { AppRoutes } from './nav/AppRoutes';
import type { FC } from './_shared/types';

export const App: FC = () => {
  return (
    <BrowserRouter>
      <AppNav />
      <AppRoutes />
    </BrowserRouter>
  );
};

App.displayName = 'App';