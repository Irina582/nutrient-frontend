import { type FC, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../nutrients_store';
import { nutrients_fetchList, nutrients_likeAsync } from '../nutrients_store/nutrients_listSlice';

export const Nutrients_FeedPage: FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const nutrients_default_video = '/nutrients_default_video.mp4';

  const publishedItems = useSelector((state: RootState) => state.nutrients_list.nutrients_items);
  const isAuthenticated = useSelector((state: RootState) => state.nutrients_user.nutrients_isAuthenticated);

  // 1. Берем ID из перехода, если он был
  const initialId = location.state?.selectedId;

  // 2. Храним ЖЕЛЕЗНЫЙ ID карточки, которую сейчас смотрим
  const [currentViewedId, setCurrentViewedId] = useState<number | null>(initialId || null);

  useEffect(() => {
    if (publishedItems.length === 0) {
      dispatch(nutrients_fetchList());
    }
  }, [dispatch, publishedItems.length]);

  // 3. Если зашли без ID, ставим ID самого первого нутриента
  useEffect(() => {
    if (!currentViewedId && publishedItems.length > 0) {
      const firstItem: any = publishedItems[0];
      setCurrentViewedId(firstItem.id || firstItem.nutrients_id);
    }
  }, [publishedItems, currentViewedId]);

  if (publishedItems.length === 0) return null;

  // 4. Находим актуальный индекс карточки по её железобетонному ID
  const currentIndex = publishedItems.findIndex((n: any) => (n.id || n.nutrients_id) === currentViewedId);
  const actualIndex = currentIndex !== -1 ? currentIndex : 0; 
  
  const nutrients_item: any = publishedItems[actualIndex];
  const itemId = nutrients_item.id || nutrients_item.nutrients_id;
  const isLikedByMe = nutrients_item.isLiked === 1;
  const currentLikes = nutrients_item.likesCount ?? nutrients_item.nutrients_likes_count ?? 0;

  const rawVideo = nutrients_item.videoKey || nutrients_item.nutrients_video_url || nutrients_default_video;
  const videoUrl = typeof rawVideo === 'string' ? rawVideo.replace('http://localhost:9000', '') : rawVideo;

  const nutrients_handleNext = () => {
    const nextIndex = (actualIndex + 1) % publishedItems.length;
    const nextItem: any = publishedItems[nextIndex];
    setCurrentViewedId(nextItem.id || nextItem.nutrients_id);
  };

  const nutrients_handleLike = async () => {
    if (isAuthenticated === 0) return;
    const toggleValue = isLikedByMe ? 0 : 1;
    dispatch(nutrients_likeAsync({ id: itemId, value: toggleValue }));
  };

  return (
    <>
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
            className="next-arrow" 
            onClick={nutrients_handleLike} 
            disabled={isAuthenticated === 0}
            style={{ 
              background: isAuthenticated === 1
                ? (isLikedByMe ? 'rgba(220, 53, 69, 0.9)' : 'rgba(0, 0, 0, 0.6)') 
                : 'rgba(100, 100, 100, 0.5)',
              display: 'flex', 
              flexDirection: 'column', 
              color: 'white', 
              border: 'none',
              lineHeight: '1.2'
            }}
            title={isAuthenticated === 1 ? 'Поставить лайк' : 'Авторизуйтесь для лайка'}
          >
            <span style={{ fontSize: '15px' }}>{isLikedByMe ? '❤️' : '🤍'}</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{currentLikes}</span>
          </button>

          <button className="next-arrow" onClick={nutrients_handleNext} title="Следующий">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="feed-norm">
            Норма: {nutrients_item.dailyNorm ?? nutrients_item.nutrients_daily_norm} {nutrients_item.unit ?? nutrients_item.nutrients_unit}
          </p>
        </div>

        <div className="feed-overlay">
          <p className="feed-title">{nutrients_item.name || nutrients_item.nutrients_name}</p>
          
          <div className="desc-container" key={`desc-${itemId}`}>
            <input 
              type="checkbox" 
              id={`descToggle-${itemId}`} 
              className="desc-checkbox" 
            />
            <p className="desc-text">{nutrients_item.description || nutrients_item.nutrients_description}</p>
            <label htmlFor={`descToggle-${itemId}`} className="desc-label"></label>
          </div>
        </div>
      </div>
    </>
  );
};