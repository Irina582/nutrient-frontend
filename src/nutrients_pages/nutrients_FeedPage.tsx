import { type FC, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../nutrients_store';
import { nutrients_fetchFeedAsync, nutrients_likeAsync } from '../nutrients_store/nutrients_listSlice';
import { NUTRIENTS_MOCK_DATA } from '../nutrients_modules/nutrients_api';

export const Nutrients_FeedPage: FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const nutrients_default_video = '/nutrients_default_video.mp4';

  const isAuthenticated = useSelector((state: RootState) => state.nutrients_user.nutrients_isAuthenticated);

  // Получаем ID из стейта роутера (если пришли с плитки)
  const initialId = location.state?.selectedId;

  const [currentNutrient, setCurrentNutrient] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Функция загрузки через Thunk с fallback на моки, если бэкенд выключен
  const loadFeed = async (id?: number, next: boolean = false) => {
    setLoading(true);
    try {
      const resultAction = await dispatch(
        nutrients_fetchFeedAsync({
          id: id !== undefined ? String(id) : '',
          next: String(next),
        })
      );

      if (nutrients_fetchFeedAsync.fulfilled.match(resultAction) && resultAction.payload) {
        setCurrentNutrient(resultAction.payload);
      } else {
        // Если бэкенд упал или не вернул данные — берем опубликованные моки
        const publishedMocks = NUTRIENTS_MOCK_DATA.filter(n => n.nutrients_status === 'опубликован');
        if (publishedMocks.length > 0) {
          const foundIndex = publishedMocks.findIndex(n => n.nutrients_id === id);
          const targetItem = foundIndex !== -1 && next 
            ? publishedMocks[(foundIndex + 1) % publishedMocks.length] 
            : (publishedMocks[foundIndex] || publishedMocks[0]);
          setCurrentNutrient(targetItem);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки ленты, используем моки', error);
      const publishedMocks = NUTRIENTS_MOCK_DATA.filter(n => n.nutrients_status === 'опубликован');
      setCurrentNutrient(publishedMocks[0] || null);
    } finally {
      setLoading(false);
    }
  };

  // При открытии страницы грузим карточку
  useEffect(() => {
    if (initialId) {
      loadFeed(initialId, false);
    } else {
      loadFeed(undefined, true);
    }
  }, [initialId]);

  if (loading && !currentNutrient) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Загрузка ленты...</div>;
  }

  if (!currentNutrient) return null;

  const itemId = currentNutrient.id || currentNutrient.nutrients_id;
  const isLikedByMe = currentNutrient.isLiked === 1;
  const currentLikes = currentNutrient.likesCount ?? currentNutrient.nutrients_likes_count ?? 0;

  const rawVideo = currentNutrient.videoKey || currentNutrient.nutrients_video_url || nutrients_default_video;
  const videoUrl = typeof rawVideo === 'string' ? rawVideo.replace('http://localhost:9000', '') : rawVideo;

  // Кнопка «Следующий»
  const nutrients_handleNext = () => {
    loadFeed(itemId, true);
  };

  // Кнопка «Лайк»
  const nutrients_handleLike = async () => {
    if (isAuthenticated === 0) return;
    const toggleValue = isLikedByMe ? 0 : 1;
    await dispatch(nutrients_likeAsync({ id: itemId, value: toggleValue }));
    loadFeed(itemId, false);
  };

  const getLikeButtonBg = () => {
    if (isAuthenticated === 1) {
      return isLikedByMe ? 'rgba(220, 53, 69, 0.9)' : 'rgba(0, 0, 0, 0.6)';
    }
    return 'rgba(100, 100, 100, 0.5)';
  };

  return (
    <div className="feed-media">
      <video
        className="feed-video"
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        key={`video-${itemId}`}
      />
      
      <div className="feed-actions-right">
        <button 
          type="button"
          className="feed-like-btn" 
          onClick={nutrients_handleLike} 
          disabled={isAuthenticated === 0}
          style={{ backgroundColor: getLikeButtonBg() }}
          title={isAuthenticated === 1 ? 'Поставить лайк' : 'Авторизуйтесь для лайка'}
        >
          <span style={{ fontSize: '15px' }}>{isLikedByMe ? '❤️' : '🤍'}</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>{currentLikes}</span>
        </button>

        <button type="button" className="next-arrow" onClick={nutrients_handleNext} title="Следующий">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <p className="feed-norm">
          Норма: {currentNutrient.dailyNorm ?? currentNutrient.nutrients_daily_norm} {currentNutrient.unit ?? currentNutrient.nutrients_unit}
        </p>
      </div>

      <div className="feed-overlay">
        <p className="feed-title">{currentNutrient.name || currentNutrient.nutrients_name}</p>
        
        <div className="desc-container" key={`desc-${itemId}`}>
          <input 
            type="checkbox" 
            id={`descToggle-${itemId}`} 
            className="desc-checkbox" 
          />
          <p className="desc-text">{currentNutrient.description || currentNutrient.nutrients_description}</p>
          <label htmlFor={`descToggle-${itemId}`} className="desc-label"></label>
        </div>
      </div>
    </div>
  );
};