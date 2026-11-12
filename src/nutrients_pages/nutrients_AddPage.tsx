import { type FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../nutrients_store';
import { nutrients_fetchDraft, nutrients_updateDraftData, nutrients_createDraftAsync, nutrients_publishDraftAsync } from '../nutrients_store/nutrients_draftSlice';
import { useNavigate } from 'react-router-dom';
import { NUTRIENTS_ROUTES } from '../nutrients_Routes';

export const Nutrients_AddPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { nutrients_isDraft, nutrients_data, nutrients_draftId } = useSelector((state: RootState) => state.nutrients_draft);
  const isAuthenticated = useSelector((state: RootState) => state.nutrients_user.nutrients_isAuthenticated);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [previewImage, setPreviewImage] = useState<string>('/nutrients_default_image.jpg');
  const [previewVideo, setPreviewVideo] = useState<string>('/nutrients_default_video.mp4');

  useEffect(() => {
    if (isAuthenticated === 0) {
      navigate(NUTRIENTS_ROUTES.NUTRIENTS_LOGIN);
      return;
    }
    dispatch(nutrients_fetchDraft());
  }, [dispatch, isAuthenticated, navigate]);

  const nutrients_handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const nutrients_handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setPreviewVideo(URL.createObjectURL(file));
    }
  };

  const nutrients_handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(nutrients_updateDraftData({ [e.target.name]: e.target.value }));
  };

  const nutrients_handleCreate = (e: React.FormEvent) => {
    e.preventDefault(); 
    const formData = new FormData();
    formData.append('name', nutrients_data.name);
    if (imageFile) formData.append('image', imageFile);
    if (videoFile) formData.append('video', videoFile);

    // Вызываем Thunk через dispatch
    dispatch(nutrients_createDraftAsync(formData))
      .unwrap()
      .catch((error) => {
        alert("Ошибка при создании: " + error);
      });
  };

  const nutrients_handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (nutrients_draftId) {
      const payload = {
        id: nutrients_draftId,
        data: {
          dailyNorm: Number(nutrients_data.dailyNorm),
          unit: nutrients_data.unit,
          description: nutrients_data.description
        }
      };
      
      // Вызываем Thunk через dispatch
      dispatch(nutrients_publishDraftAsync(payload))
        .unwrap()
        .then(() => {
          navigate(NUTRIENTS_ROUTES.NUTRIENTS_GRID);
        })
        .catch(() => {
          console.error("Ошибка публикации");
        });
    }
  };

  return (
    <div className="add-screen-wrapper">
      <header className="app-header">
        <h1>Добавление</h1>
      </header>

      <div className="add-scroll">
        {nutrients_isDraft ? (
          <form onSubmit={nutrients_handlePublish} className="add-form">
            <div className="media-block">
              <span className="media-label">📷 ИЗОБРАЖЕНИЕ</span>
              <img src={nutrients_data.imageKey || "/nutrients_default_image.jpg"} alt="Изображение" className="preview-media" />
            </div>

            <div className="media-block">
              <span className="media-label">🎬 ВИДЕО</span>
              <video src={nutrients_data.videoKey || "/nutrients_default_video.mp4"} controls className="preview-media"></video>
            </div>

            <label>
              Название
              <input type="text" name="name" value={nutrients_data.name} readOnly />
            </label>

            <label>
              Суточная норма
              <input type="number" name="dailyNorm" value={nutrients_data.dailyNorm} onChange={nutrients_handleInputChange} required />
            </label>

            <label>
              Единица измерения
              <input type="text" name="unit" value={nutrients_data.unit} onChange={nutrients_handleInputChange} required />
            </label>

            <label>
              Описание
              <textarea name="description" value={nutrients_data.description} onChange={nutrients_handleInputChange}></textarea>
            </label>

            <button type="submit" className="publish-btn">Опубликовать</button>
          </form>
        ) : (
          <form onSubmit={nutrients_handleCreate} className="add-form">
            <div className="media-block">
              <span className="media-label">📷 ИЗОБРАЖЕНИЕ</span>
              <img src={previewImage} alt="Preview" className="preview-media" />
              <input type="file" accept="image/*" onChange={nutrients_handleImageChange} className="file-upload-input" />
            </div>

            <div className="media-block">
              <span className="media-label">🎬 ВИДЕО</span>
              <video src={previewVideo} controls className="preview-media"></video>
              <input type="file" accept="video/*" onChange={nutrients_handleVideoChange} className="file-upload-input" />
            </div>

            <label>
              Название
              <input type="text" name="name" value={nutrients_data.name} onChange={nutrients_handleInputChange} required />
            </label>

            <button type="submit" className="next-btn">Далее</button>
          </form>
        )}
      </div>
    </div>
  );
};