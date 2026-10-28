import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { INutrients_Item } from '../nutrients_modules/nutrients_api';
import { NUTRIENTS_MOCK_DATA } from '../nutrients_modules/nutrients_api';
import { Nutrients_Card } from '../nutrients_components/nutrients_Card';
import { Nutrients_InputField } from '../nutrients_components/nutrients_InputField';

export const Nutrients_GridPage: FC = () => {
  const nutrients_navigate = useNavigate();
  const [minNorm, setMinNorm] = useState('0');
  const [maxNorm, setMaxNorm] = useState('150');
  const [nutrients_items, nutrients_setItems] = useState<INutrients_Item[]>([]);

  useEffect(() => {
    // При первой загрузке берем только опубликованные
    const publishedOnly = NUTRIENTS_MOCK_DATA.filter(n => n.nutrients_status === 'опубликован');
    nutrients_setItems(publishedOnly);
  }, []);

  const nutrients_handleSearch = () => {
    // При поиске фильтруем сначала по статусу, затем по норме
    let filtered = NUTRIENTS_MOCK_DATA.filter(n => n.nutrients_status === 'опубликован');
    
    if (minNorm) {
      filtered = filtered.filter(n => n.nutrients_daily_norm >= Number(minNorm));
    }
    if (maxNorm) {
      filtered = filtered.filter(n => n.nutrients_daily_norm <= Number(maxNorm));
    }
    nutrients_setItems(filtered);
  };

  const nutrients_handleCardClick = (id: number) => {
    nutrients_navigate('/', { state: { selectedId: id } });
  };

  return (
    <>
      <Nutrients_InputField
        minNorm={minNorm}
        setMinNorm={setMinNorm}
        maxNorm={maxNorm}
        setMaxNorm={setMaxNorm}
        onSubmit={nutrients_handleSearch}
      />

      <div className="tile-grid">
        {nutrients_items.map((nutrients_item) => (
          <Nutrients_Card
            key={nutrients_item.nutrients_id}
            nutrients_item={nutrients_item}
            nutrients_onClick={() => nutrients_handleCardClick(nutrients_item.nutrients_id)}
          />
        ))}
        {nutrients_items.length === 0 && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', padding: '40px 0' }}>Нутриенты не найдены</p>
        )}
      </div>
    </>
  );
};