import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { NUTRIENTS_ROUTES, NUTRIENTS_ROUTE_LABELS } from '../nutrients_Routes';
import type { RootState, AppDispatch } from '../nutrients_store';
import { nutrients_logoutSuccess } from '../nutrients_store/nutrients_userSlice';
import { nutrients_resetFilters, nutrients_fetchList } from '../nutrients_store/nutrients_listSlice';
import { nutrients_clearDraft } from '../nutrients_store/nutrients_draftSlice';

export const Nutrients_TabBar: FC = () => {
  const nutrients_location = useLocation();
  const nutrients_navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const nutrients_isActive = (path: string) => nutrients_location.pathname === path;
  
  const isAuthenticated = useSelector((state: RootState) => state.nutrients_user.nutrients_isAuthenticated);
  const username = useSelector((state: RootState) => state.nutrients_user.nutrients_username);
  const isDraft = useSelector((state: RootState) => state.nutrients_draft.nutrients_isDraft);

  const nutrients_handleAuthClick = async () => {
    // Проверка строго на 1
    if (isAuthenticated === 1) {
      try {
        await axios.post('/api/users/logout', {}, { baseURL: '/', withCredentials: true });
      } catch (e) {
        console.error('Ошибка при выходе', e);
      }
      dispatch(nutrients_logoutSuccess());
      dispatch(nutrients_resetFilters());
      dispatch(nutrients_clearDraft());
      
      // Редирект на плитку при выходе
      nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_GRID);
      dispatch(nutrients_fetchList());
    } else {
      nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_LOGIN);
    }
  };

  return (
    <nav className="tabbar">
      <button type="button" className={`tab-item ${nutrients_isActive(NUTRIENTS_ROUTES.NUTRIENTS_FEED) ? 'active' : ''}`} onClick={() => nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_FEED)}>
        {NUTRIENTS_ROUTE_LABELS.NUTRIENTS_FEED}
      </button>

      <button type="button" className={`tab-item ${nutrients_isActive(NUTRIENTS_ROUTES.NUTRIENTS_ADD) ? 'active' : ''}`} onClick={() => isAuthenticated === 1 ? nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_ADD) : null} style={{ opacity: isAuthenticated === 1 ? 1 : 0.5 }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {NUTRIENTS_ROUTE_LABELS.NUTRIENTS_ADD}
          {isAuthenticated === 1 && isDraft && (
            <span style={{ background: 'red', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', marginLeft: '4px', fontWeight: 'bold' }}>1</span>
          )}
        </span>
      </button>

      <button type="button" className={`tab-item ${nutrients_isActive(NUTRIENTS_ROUTES.NUTRIENTS_GRID) ? 'active' : ''}`} onClick={() => nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_GRID)}>
        {NUTRIENTS_ROUTE_LABELS.NUTRIENTS_GRID}
      </button>

      <button type="button" className="tab-item" onClick={nutrients_handleAuthClick}>
        {isAuthenticated === 1 ? `Выход (${username})` : NUTRIENTS_ROUTE_LABELS.NUTRIENTS_LOGIN}
      </button>
    </nav>
  );
};