import { type FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ProgressBar, Spinner } from 'react-bootstrap';
import type { AppDispatch, RootState } from '../nutrients_store';
import { nutrients_fetchList, nutrients_removeAsync } from '../nutrients_store/nutrients_listSlice';
import { Nutrients_Card } from '../nutrients_components/nutrients_Card';
import { Nutrients_InputField } from '../nutrients_components/nutrients_InputField';
import { NUTRIENTS_ROUTES } from '../nutrients_Routes';
import { useNutrientsClipSearch } from '../nutrients_hooks/useNutrientsClipSearch';

export const Nutrients_GridPage: FC = () => {
  const nutrients_navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { nutrients_items, nutrients_loading } = useSelector((state: RootState) => state.nutrients_list);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    displayedItems,
    ready,
    loadingModel,
    progress,
    searchByImage,
    resetSearch,
  } = useNutrientsClipSearch(nutrients_items);

  useEffect(() => {
    dispatch(nutrients_fetchList());
  }, [dispatch]);

  const nutrients_handleCardClick = (id: number) => {
    nutrients_navigate(NUTRIENTS_ROUTES.NUTRIENTS_FEED, { state: { selectedId: id } });
  };

  const nutrients_handleDelete = (id: number) => {
    dispatch(nutrients_removeAsync(id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      searchByImage(file);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    resetSearch();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <Nutrients_InputField />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 14px',
          background: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />

        {selectedImage && (
          <img
            src={selectedImage}
            alt="Поиск по фото"
            style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        )}

        <Button
          size="sm"
          variant="success"
          style={{ backgroundColor: '#259b23', borderColor: '#259b23' }}
          onClick={() => fileInputRef.current?.click()}
          disabled={!ready || loadingModel}
        >
          {loadingModel ? 'Анализ фото (CLIP)...' : 'Поиск по фото (ИИ)'}
        </Button>

        {selectedImage && (
          <Button size="sm" variant="outline-danger" onClick={handleClearImage} disabled={loadingModel}>
            Сбросить
          </Button>
        )}

        {loadingModel && (
          <div style={{ flex: 1, minWidth: '140px' }}>
            <ProgressBar now={progress || 100} label={progress ? `${Math.round(progress)}%` : 'Обработка...'} animated variant="success" />
          </div>
        )}
      </div>

      <div className="tile-grid" style={{ position: 'relative' }}>
        {nutrients_loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(245, 245, 245, 0.6)',
              zIndex: 10,
            }}
          >
            <Spinner animation="border" style={{ color: '#259b23' }} />
          </div>
        )}

        {displayedItems.map((nutrients_item: any) => (
          <Nutrients_Card
            key={nutrients_item.id || nutrients_item.nutrients_id}
            nutrients_item={nutrients_item}
            nutrients_onClick={() => nutrients_handleCardClick(nutrients_item.id || nutrients_item.nutrients_id)}
            nutrients_onDelete={nutrients_handleDelete}
          />
        ))}

        {!nutrients_loading && displayedItems.length === 0 && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', padding: '40px 0' }}>
            Нутриенты не найдены
          </p>
        )}
      </div>
    </>
  );
};