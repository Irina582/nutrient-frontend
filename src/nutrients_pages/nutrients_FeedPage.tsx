import { type FC, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NUTRIENTS_MOCK_DATA } from '../nutrients_modules/nutrients_api';

export const Nutrients_FeedPage: FC = () => {
  const location = useLocation();
  const nutrients_default_video = '/nutrients_default_video.mp4';

  // Проверяем, пришли ли мы с плитки с конкретным id
  const initialId = location.state?.selectedId;
  const initialIndex = initialId 
    ? NUTRIENTS_MOCK_DATA.findIndex(n => n.nutrients_id === initialId) 
    : 0;

  // Локальное состояние для перелистывания карточек
  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

  // Синхронизируем индекс, если вдруг зашли с плитки на другую карточку
  useEffect(() => {
    if (initialId) {
      const idx = NUTRIENTS_MOCK_DATA.findIndex(n => n.nutrients_id === initialId);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [initialId]);

  const nutrients_item = NUTRIENTS_MOCK_DATA[currentIndex];

  // Кнопка Вниз переключает на следующий элемент по кругу, без смены URL
  const nutrients_handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % NUTRIENTS_MOCK_DATA.length);
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
          key={nutrients_item.nutrients_id} // Добавлено, чтобы видео перезапускалось при смене
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
          
          <div className="desc-container">
            <input type="checkbox" id="descToggle" className="desc-checkbox" />
            <p className="desc-text">{nutrients_item.nutrients_description}</p>
            <label htmlFor="descToggle" className="desc-label"></label>
          </div>
        </div>
      </div>
    </>
  );
};