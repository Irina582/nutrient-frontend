import { type FC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Nutrients_TabBar } from './nutrients_components/nutrients_TabBar';
import { NUTRIENTS_ROUTES } from './nutrients_Routes';

export const Nutrients_AppLayout: FC = () => {
  const location = useLocation();
  
  // По умолчанию стиль Плитки
  let pageClass = 'tile-screen'; 
  
  // Если это Лента, ставим стиль Ленты
  if (location.pathname === NUTRIENTS_ROUTES.NUTRIENTS_FEED) {
    pageClass = 'feed-screen';
  }

  return (
    <main className={`screen ${pageClass}`}>
      <Outlet />
      <Nutrients_TabBar />
    </main>
  );
};