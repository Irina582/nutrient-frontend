import { type FC } from 'react';

interface INutrients_InputFieldProps {
  minNorm: string;
  setMinNorm: (val: string) => void;
  maxNorm: string;
  setMaxNorm: (val: string) => void;
  onSubmit: () => void;
}

export const Nutrients_InputField: FC<INutrients_InputFieldProps> = ({ 
  minNorm, 
  setMinNorm, 
  maxNorm, 
  setMaxNorm, 
  onSubmit 
}) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <header className="app-header">
      <form onSubmit={handleFormSubmit} className="filter-form">
        <div className="filter-slider-box">
          <div className="filter-slider-header">
            <span className="filter-slider-label">Норма:</span>
            <span className="filter-slider-value">
              {minNorm || '0'} - {maxNorm || '150'}
            </span>
          </div>

          <div className="range-slider-wrapper">
            <div className="range-slider-track"></div>
            <input
              type="range"
              min="0"
              max="150"
              step="5"
              value={minNorm || '0'}
              onChange={(e) => setMinNorm(e.target.value)}
              className="filter-slider"
              title="Минимальная норма"
            />
            <input
              type="range"
              min="0"
              max="150"
              step="5"
              value={maxNorm || '150'}
              onChange={(e) => setMaxNorm(e.target.value)}
              className="filter-slider"
              title="Максимальная норма"
            />
          </div>

          <div className="filter-slider-scale">
            <span>0</span>
            <span>30</span>
            <span>60</span>
            <span>90</span>
            <span>120</span>
            <span>150</span>
          </div>
        </div>
        <button type="submit">НАЙТИ</button>
      </form>
    </header>
  );
};