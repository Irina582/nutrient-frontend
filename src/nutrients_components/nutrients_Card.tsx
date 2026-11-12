import { type FC } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../nutrients_store';

interface INutrients_CardProps {
  nutrients_item: any;
  nutrients_onClick: () => void;
  nutrients_onDelete?: (id: number) => void;
}

export const Nutrients_Card: FC<INutrients_CardProps> = ({ nutrients_item, nutrients_onClick, nutrients_onDelete }) => {
  const isAuthenticated = useSelector((state: RootState) => state.nutrients_user.nutrients_isAuthenticated);
  const nutrients_default_image = '/nutrients_default_image.jpg';

  // Строгая проверка на 1
  const isMyCard = (isAuthenticated === 1) && (nutrients_item.isCreator === 1 || nutrients_item.isCreator === true);
  const itemId = nutrients_item.id || nutrients_item.nutrients_id;
  const currentLikes = nutrients_item.likesCount ?? nutrients_item.nutrients_likes_count ?? 0;
  
  const rawImage = nutrients_item.imageKey || nutrients_item.nutrients_image_url || nutrients_default_image;
  const imageUrl = typeof rawImage === 'string' ? rawImage.replace('http://localhost:9000', '') : rawImage;

  return (
    <div className="card-block" style={{ height: '100%' }}>
      <div className="card" onClick={nutrients_onClick} style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        <img
          className="card-image"
          src={imageUrl}
          alt={nutrients_item.name || nutrients_item.nutrients_name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = nutrients_default_image;
          }}
        />
        
        <div className="card-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p className="card-title">{nutrients_item.name || nutrients_item.nutrients_name}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            
            {/* Обычный текст с количеством лайков, без возможности клика */}
            <p className="card-likes">{currentLikes}</p>

            {isMyCard && nutrients_onDelete && (
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation(); 
                  nutrients_onDelete(itemId);
                }}
                style={{
                  background: '#259b23',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}
              >
                Удалить
              </button>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};