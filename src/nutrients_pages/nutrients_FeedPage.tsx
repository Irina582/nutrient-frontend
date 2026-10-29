import { type FC, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NUTRIENTS_MOCK_DATA } from '../nutrients_modules/nutrients_api';

// Фильтрация опубликованных карточек вне компонента
const PUBLISHED_ITEMS = NUTRIENTS_MOCK_DATA.filter(n => n.nutrients_status === 'опубликован');

export const Nutrients_FeedPage: FC = () => {
  const location = useLocation();
  const nutrients_default_video = '/nutrients_default_video.mp4';

  const initialId = location.state?.selectedId;
  const initialIndex = initialId 
    ? PUBLISHED_ITEMS.findIndex(n => n.nutrients_id === initialId) 
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

  useEffect(() => {
    if (initialId) {
      const idx = PUBLISHED_ITEMS.findIndex(n => n.nutrients_id === initialId);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [initialId]);

  // Если массив пустой, ничего не рендерится
  if (PUBLISHED_ITEMS.length === 0) return null;

  const nutrients_item = PUBLISHED_ITEMS[currentIndex];

  const nutrients_handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PUBLISHED_ITEMS.length);
  };

  return (
    <>
      <div className="feed-media">
        <video
          className="feed-video"
          src={nutrients_item.nutrients_video_url || nutrients_default_video}
          autoPlay
          loop
          muted
          playsInline
          key={`video-${nutrients_item.nutrients_id}`}
        />
        
        <div className="feed-actions-right">
          <span className="feed-likes">❤️ {nutrients_item.nutrients_likes_count}</span>
          <button className="next-arrow" onClick={nutrients_handleNext} title="Следующий">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="feed-norm">
            Норма: {nutrients_item.nutrients_daily_norm} {nutrients_item.nutrients_unit}
          </p>
        </div>

        <div className="feed-overlay">
          <p className="feed-title">{nutrients_item.nutrients_name}</p>
          
          {/* 
            ИСПРАВЛЕНИЕ ЗДЕСЬ: 
            Добавлен key (чтобы сбрасывать состояние чекбокса при смене карточки) 
            и уникальные id для input и htmlFor 
          */}
          <div className="desc-container" key={`desc-${nutrients_item.nutrients_id}`}>
            <input 
              type="checkbox" 
              id={`descToggle-${nutrients_item.nutrients_id}`} 
              className="desc-checkbox" 
            />
            <p className="desc-text">{nutrients_item.nutrients_description}</p>
            <label htmlFor={`descToggle-${nutrients_item.nutrients_id}`} className="desc-label"></label>
          </div>
        </div>
      </div>
    </>
  );
};