import { type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { NUTRIENTS_ROUTES, NUTRIENTS_ROUTE_LABELS } from '../nutrients_Routes';
import type { RootState, AppDispatch } from '../nutrients_store';
import { nutrients_logoutSuccess } from '../nutrients_store/nutrients_userSlice';
import { nutrients_resetFilters, nutrients_fetchList } from '../nutrients_store/nutrients_listSlice';
import { nutrients_clearDraft } from '../nutrients_store/nutrients_draftSlice';
import { nutrients_target_tauri } from '../nutrients_target_config';

export const Nutrients_TabBar: FC = () => {
  const nutrients_location = useLocation();
  const nutrients_navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const nutrients_isActive = (path: string) =>
    nutrients_location.pathname === path;

  const isAuthenticated = useSelector(
    (state: RootState) => state.nutrients_user.nutrients_isAuthenticated
  );

  const username = useSelector(
    (state: RootState) => state.nutrients_user.nutrients_username
  );

  const isDraft = useSelector(
    (state: RootState) => state.nutrients_draft.nutrients_isDraft
  );

  const nutrients_canAdd =
    !nutrients_target_tauri && isAuthenticated === 1;

  const nutrients_handleAuthClick = async () => {
    if (nutrients_target_tauri) return;

    if (isAuthenticated === 1) {
      try {
        await axios.post('/api/users/logout', {}, {
          baseURL: '/',
          withCredentials: true,
        });
      } catch (e) {
        console.error('Ошибка при выходе', e);
      }

      dispatch(nutrients_logoutSuccess());
      dispatch(nutrients_resetFilters());
      dispatch(nutrients_clearDraft());

      nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_GRID);
      dispatch(nutrients_fetchList());
    } else {
      nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_LOGIN);
    }
  };

  return (
    <nav className="tabbar">

      <button
        type="button"
        className={`tab-item ${
          nutrients_isActive(NUTRIENTS_ROUTES.NUTRIENTS_FEED)
            ? 'active'
            : ''
        }`}
        onClick={() =>
          nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_FEED)
        }
      >
        {NUTRIENTS_ROUTE_LABELS.NUTRIENTS_FEED}
      </button>

      <button
        type="button"
        className={`tab-item ${
          nutrients_isActive(NUTRIENTS_ROUTES.NUTRIENTS_ADD)
            ? 'active'
            : ''
        }`}
        disabled={!nutrients_canAdd}
        onClick={() =>
          nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_ADD)
        }
        style={{
          opacity: nutrients_canAdd ? 1 : 0.5,
          cursor: nutrients_canAdd ? 'pointer' : 'not-allowed',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {NUTRIENTS_ROUTE_LABELS.NUTRIENTS_ADD}

          {nutrients_canAdd && isDraft && (
            <span
              style={{
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                marginLeft: '4px',
                fontWeight: 'bold',
              }}
            >
              1
            </span>
          )}
        </span>
      </button>

      <button
        type="button"
        className={`tab-item ${
          nutrients_isActive(NUTRIENTS_ROUTES.NUTRIENTS_GRID)
            ? 'active'
            : ''
        }`}
        onClick={() =>
          nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_GRID)
        }
      >
        {NUTRIENTS_ROUTE_LABELS.NUTRIENTS_GRID}
      </button>

      <button
        type="button"
        className="tab-item"
        disabled={nutrients_target_tauri}
        onClick={nutrients_handleAuthClick}
        style={{
          opacity: nutrients_target_tauri ? 0.5 : 1,
          cursor: nutrients_target_tauri ? 'not-allowed' : 'pointer',
        }}
      >
        {!nutrients_target_tauri && isAuthenticated === 1
          ? `Выход (${username})`
          : NUTRIENTS_ROUTE_LABELS.NUTRIENTS_LOGIN}
      </button>

    </nav>
  );
};