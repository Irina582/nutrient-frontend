// src/nutrients_Routes.ts

export const NUTRIENTS_ROUTES = {
  NUTRIENTS_FEED: '/',
  NUTRIENTS_ADD: '/nutrients_add',
  NUTRIENTS_GRID: '/nutrients_grid',
  NUTRIENTS_LOGIN: '/nutrients_login',
} as const;

export type NutrientsRouteKey = keyof typeof NUTRIENTS_ROUTES;

export const NUTRIENTS_ROUTE_LABELS: Record<NutrientsRouteKey, string> = {
  NUTRIENTS_FEED: 'Лента',
  NUTRIENTS_ADD: 'Добавление',
  NUTRIENTS_GRID: 'Плитка',
  NUTRIENTS_LOGIN: 'Вход',
};