import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../nutrients_store';
import { nutrients_setTextEmbeddings } from '../nutrients_store/nutrients_listSlice';
import { nutrients_cosineSimilarity } from '../nutrients_modules/nutrients_math';

// Порог косинусного сходства для SigLIP (из-за Sigmoid вместо Softmax значения обычно 0.01 - 0.15)
export const NUTRIENTS_CLIP_THRESHOLD = 0.03;
// Максимальное количество возвращаемых карточек (TopK)
export const NUTRIENTS_CLIP_TOP_K = 3;

export const useNutrientsClipSearch = (items: any[]) => {
  const dispatch = useDispatch<AppDispatch>();
  const cachedTextEmbeddings = useSelector(
    (state: RootState) => state.nutrients_list.nutrients_textEmbeddings
  );

  const [imageEmbedding, setImageEmbedding] = useState<number[] | null>(null);
  const [ready, setReady] = useState<boolean>(true);
  const [loadingModel, setLoadingModel] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const workerRef = useRef<Worker | null>(null);
  const pendingFileRef = useRef<File | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../nutrients_workers/nutrients_search.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      const { type, data } = e.data;

      switch (type) {
        case 'progress':
          if (data.status === 'progress' && typeof data.progress === 'number') {
            setProgress(data.progress);
          }
          break;

        case 'text_embeddings_ready':
          dispatch(nutrients_setTextEmbeddings(data));
          if (pendingFileRef.current) {
            workerRef.current?.postMessage({ type: 'image', data: pendingFileRef.current });
            pendingFileRef.current = null;
          } else {
            setLoadingModel(false);
            setReady(true);
          }
          break;

        case 'image_embedding_ready':
          setImageEmbedding(data);
          setLoadingModel(false);
          setReady(true);
          break;

        case 'error':
          setLoadingModel(false);
          setReady(true);
          break;
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [dispatch]);

  const searchByImage = (file: File) => {
    setLoadingModel(true);
    setReady(false);

    // Проверяем, для каких карточек ещё не посчитаны текстовые эмбеддинги в Redux
    const missingItems = items
      .map((item) => ({
        id: item.id ?? item.nutrients_id,
        descriptionEn: item.descriptionEn ?? item.nutrients_description_en ?? '',
      }))
      .filter((item) => !cachedTextEmbeddings[item.id] && item.descriptionEn.trim().length > 0);

    if (missingItems.length > 0) {
      pendingFileRef.current = file;
      workerRef.current?.postMessage({ type: 'init_texts', data: missingItems });
    } else {
      workerRef.current?.postMessage({ type: 'image', data: file });
    }
  };

  const resetSearch = () => {
    setImageEmbedding(null);
    pendingFileRef.current = null;
  };

  // Если картинка не загружена — возвращаем исходный список
  let displayedItems = items;

  if (imageEmbedding) {
    displayedItems = items
      .map((item) => {
        const id = item.id ?? item.nutrients_id;
        const textVec = cachedTextEmbeddings[id];
        const score = textVec ? nutrients_cosineSimilarity(imageEmbedding, textVec) : 0;
        return { ...item, similarityScore: score };
      })
      .filter((item) => item.similarityScore >= NUTRIENTS_CLIP_THRESHOLD)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, NUTRIENTS_CLIP_TOP_K);
  }

  return {
    displayedItems,
    ready,
    loadingModel,
    progress,
    imageEmbedding,
    searchByImage,
    resetSearch,
  };
};