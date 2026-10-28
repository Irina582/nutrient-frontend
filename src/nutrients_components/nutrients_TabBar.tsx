import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NUTRIENTS_ROUTES, NUTRIENTS_ROUTE_LABELS } from '../nutrients_Routes';

export const Nutrients_TabBar: FC = () => {
  const nutrients_location = useLocation();
  const nutrients_navigate = useNavigate();
  const nutrients_isActive = (path: string) => nutrients_location.pathname === path;

  return (
    <nav className="tabbar">
      <button type="button" className={`tab-item ${nutrients_isActive(NUTRIENTS_ROUTES.NUTRIENTS_FEED) ? 'active' : ''}`} onClick={() => nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_FEED)}>
        <span className="tab-icon"></span>
        {NUTRIENTS_ROUTE_LABELS.NUTRIENTS_FEED}
      </button>

      {/* Кнопка "Добавление" - заглушка без действия */}
      <button type="button" className="tab-item" onClick={() => {}}>
        <span className="tab-icon"></span>
        {NUTRIENTS_ROUTE_LABELS.NUTRIENTS_ADD}
      </button>

      <button type="button" className={`tab-item ${nutrients_isActive(NUTRIENTS_ROUTES.NUTRIENTS_GRID) ? 'active' : ''}`} onClick={() => nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_GRID)}>
        <span className="tab-icon"></span>
        {NUTRIENTS_ROUTE_LABELS.NUTRIENTS_GRID}
      </button>

      {/* Кнопка "Вход" - заглушка без действия */}
      <button type="button" className="tab-item" onClick={() => {}}>
        <span className="tab-icon"></span>
        {NUTRIENTS_ROUTE_LABELS.NUTRIENTS_LOGIN}
      </button>
    </nav>
  );
};