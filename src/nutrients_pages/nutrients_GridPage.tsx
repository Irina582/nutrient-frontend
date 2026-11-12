import { type FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../nutrients_store';
import { nutrients_fetchList, nutrients_removeAsync } from '../nutrients_store/nutrients_listSlice';
import { Nutrients_Card } from '../nutrients_components/nutrients_Card';
import { Nutrients_InputField } from '../nutrients_components/nutrients_InputField';
import { NUTRIENTS_ROUTES } from '../nutrients_Routes';

export const Nutrients_GridPage: FC = () => {
  const nutrients_navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { nutrients_items, nutrients_loading } = useSelector((state: RootState) => state.nutrients_list);

  useEffect(() => {
    dispatch(nutrients_fetchList());
  }, [dispatch]);

  const nutrients_handleCardClick = (id: number) => {
    nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_FEED, { state: { selectedId: id } });
  };

  const nutrients_handleDelete = (id: number) => {
    dispatch(nutrients_removeAsync(id)); 
  };

  return (
    <>
      <Nutrients_InputField />
      <div className="tile-grid" style={{ position: 'relative' }}>
        
        {nutrients_loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(245, 245, 245, 0.6)', zIndex: 10 }}>
            <Spinner animation="border" style={{ color: '#259b23' }} />
          </div>
        )}

        {nutrients_items.map((nutrients_item: any) => (
          <Nutrients_Card
            key={nutrients_item.id || nutrients_item.nutrients_id}
            nutrients_item={nutrients_item}
            nutrients_onClick={() => nutrients_handleCardClick(nutrients_item.id || nutrients_item.nutrients_id)}
            nutrients_onDelete={nutrients_handleDelete}
          />
        ))}
        
        {!nutrients_loading && nutrients_items.length === 0 && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', padding: '40px 0' }}>Нутриенты не найдены</p>
        )}
      </div>
    </>
  );
};