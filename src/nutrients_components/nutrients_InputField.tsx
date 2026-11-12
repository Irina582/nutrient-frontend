import { type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../nutrients_store';
import { nutrients_setMinNorm, nutrients_setMaxNorm, nutrients_fetchList } from '../nutrients_store/nutrients_listSlice';

export const Nutrients_InputField: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const minNorm = useSelector((state: RootState) => state.nutrients_list.nutrients_minNorm);
  const maxNorm = useSelector((state: RootState) => state.nutrients_list.nutrients_maxNorm);
  const loading = useSelector((state: RootState) => state.nutrients_list.nutrients_loading);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(nutrients_fetchList());
  };

  return (
    <header className="app-header">
      <form onSubmit={handleFormSubmit} className="filter-form">
        <div className="filter-slider-box">
          <div className="filter-slider-header">
            <span className="filter-slider-label">Норма:</span>
            <span className="filter-slider-value">{minNorm || '0'} - {maxNorm || '150'}</span>
          </div>

          <div className="range-slider-wrapper">
            <div className="range-slider-track"></div>
            <input type="range" min="0" max="150" step="5" value={minNorm || '0'} onChange={(e) => dispatch(nutrients_setMinNorm(e.target.value))} className="filter-slider" />
            <input type="range" min="0" max="150" step="5" value={maxNorm || '150'} onChange={(e) => dispatch(nutrients_setMaxNorm(e.target.value))} className="filter-slider" />
          </div>

          <div className="filter-slider-scale">
            <span>0</span><span>30</span><span>60</span><span>90</span><span>120</span><span>150</span>
          </div>
        </div>
        <button type="submit" disabled={loading}>{loading ? '...' : 'НАЙТИ'}</button>
      </form>
    </header>
  );
};