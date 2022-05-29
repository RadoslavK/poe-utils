import React from 'react';
import type { LayoutRouteProps } from 'react-router-dom';
import { Eldritch } from '../Eldritch';
import { Gems } from '../Gems';

const routePaths = ['gems', 'eldritch'] as const;

type RoutePath = typeof routePaths[number];
type AppRoute = {
  readonly element: LayoutRouteProps['element'];
  readonly label: string;
};

export const routes: Record<RoutePath, AppRoute> = {
  gems: {
    element: <Gems />,
    label: 'gems',
  },
  eldritch: {
    element: <Eldritch />,
    label: 'Eldritch',
  },
}