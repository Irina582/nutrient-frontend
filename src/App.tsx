import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Nutrients_AppLayout } from './nutrients_AppLayout';
import { Nutrients_FeedPage } from './nutrients_pages/nutrients_FeedPage';
import { Nutrients_GridPage } from './nutrients_pages/nutrients_GridPage';
import { NUTRIENTS_ROUTES } from './nutrients_Routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Nutrients_AppLayout />}>
          <Route path={NUTRIENTS_ROUTES.NUTRIENTS_FEED} element={<Nutrients_FeedPage />} />
          <Route path={NUTRIENTS_ROUTES.NUTRIENTS_GRID} element={<Nutrients_GridPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;