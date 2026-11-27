import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { Nutrients_AppLayout } from './nutrients_AppLayout';
import { Nutrients_FeedPage } from './nutrients_pages/nutrients_FeedPage';
import { Nutrients_GridPage } from './nutrients_pages/nutrients_GridPage';
import { Nutrients_LoginPage } from './nutrients_pages/nutrients_LoginPage';
import { Nutrients_AddPage } from './nutrients_pages/nutrients_AddPage';
import { NUTRIENTS_ROUTES } from './nutrients_Routes';
import { nutrients_dest_root } from './nutrients_target_config';

function App() {
  useEffect(() => {
    invoke('tauri', { cmd: 'create' })
      .then(() => console.log('Tauri launched'))
      .catch(() => console.log('Tauri not launched'));
    return () => {
      invoke('tauri', { cmd: 'close' })
        .then(() => console.log('Tauri closed'))
        .catch(() => console.log('Tauri not launched'));
    };
  }, []);

  return (
    <BrowserRouter basename={nutrients_dest_root}>
      <Routes>
        <Route element={<Nutrients_AppLayout />}>
          <Route path="/" element={<Navigate to={NUTRIENTS_ROUTES.NUTRIENTS_GRID} replace />} />
          <Route path={NUTRIENTS_ROUTES.NUTRIENTS_FEED} element={<Nutrients_FeedPage />} />
          <Route path="/nutrients/feed/:id" element={<Nutrients_FeedPage />} />
          <Route path={NUTRIENTS_ROUTES.NUTRIENTS_GRID} element={<Nutrients_GridPage />} />
          <Route path={NUTRIENTS_ROUTES.NUTRIENTS_LOGIN} element={<Nutrients_LoginPage />} />
          <Route path={NUTRIENTS_ROUTES.NUTRIENTS_ADD} element={<Nutrients_AddPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;