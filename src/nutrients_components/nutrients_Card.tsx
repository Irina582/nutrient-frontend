import { type FC } from 'react';
import type { INutrients_Item } from '../nutrients_modules/nutrients_api';

interface INutrients_CardProps {
  nutrients_item: INutrients_Item;
  nutrients_onClick: () => void;
}

export const Nutrients_Card: FC<INutrients_CardProps> = ({ nutrients_item, nutrients_onClick }) => {
  const nutrients_default_image = '/nutrients_default_image.jpg';
  
  return (
    <div className="card-block">
      <div className="card" onClick={nutrients_onClick} style={{ cursor: 'pointer' }}>
        <img
          className="card-image"
          src={nutrients_item.nutrients_image_url || nutrients_default_image}
          alt={nutrients_item.nutrients_name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = nutrients_default_image;
          }}
        />
        <div className="card-info">
          <p className="card-title">{nutrients_item.nutrients_name}</p>
          <p className="card-likes">{nutrients_item.nutrients_likes_count}</p>
        </div>
      </div>
      
      {/* Кнопка удалить (без функционала для 5-й лабы) */}
      <div className="delete-form">
        <button 
          className="delete-btn" 
          onClick={(e) => {
            e.stopPropagation(); 
          }}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};