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

  const isMyCard = (isAuthenticated === 1) && (nutrients_item.isCreator === 1 || nutrients_item.isCreator === true);
  const itemId = nutrients_item.id || nutrients_item.nutrients_id;
  const currentLikes = nutrients_item.likesCount ?? nutrients_item.nutrients_likes_count ?? 0;
  
  const dailyNorm = nutrients_item.dailyNorm ?? nutrients_item.nutrients_daily_norm;
  const unit = nutrients_item.unit ?? nutrients_item.nutrients_unit;

  const rawImage = nutrients_item.imageKey || nutrients_item.nutrients_image_url || nutrients_default_image;
  const imageUrl = typeof rawImage === 'string' ? rawImage.replace('http://localhost:9000', '') : rawImage;

  return (
    <div className="card-block">
      <div className="card" onClick={nutrients_onClick} style={{ cursor: 'pointer', width: '100%' }}>
        
        <img
          className="card-image"
          src={imageUrl}
          alt={nutrients_item.name || nutrients_item.nutrients_name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = nutrients_default_image;
          }}
        />
        
        <div className="card-info" style={{ padding: '8px 10px 10px' }}>
          {/* Название */}
          <p className="card-title">{nutrients_item.name || nutrients_item.nutrients_name}</p>
          
          {/* Текст нормы: тот же класс card-title (тот же шрифт, семейство и размер 13px), но цвет серый */}
          {dailyNorm !== undefined && (
            <p className="card-title" style={{ color: '#777777', margin: '2px 0 6px 0', fontWeight: '500' }}>
              Норма: {dailyNorm} {unit || ''}
            </p>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            
            <p className="card-likes">{currentLikes}</p>

            {isMyCard && nutrients_onDelete && (
              <button 
                type="button" 
                className="card-delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); 
                  nutrients_onDelete(itemId);
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