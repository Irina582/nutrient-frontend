// src/nutrients_modules/nutrients_api.ts

export interface INutrients_Item {
  nutrients_id: number;
  nutrients_name: string;
  nutrients_daily_norm: number;
  nutrients_unit: string;
  nutrients_description: string;
  nutrients_image_url: string;
  nutrients_video_url?: string;
  nutrients_likes_count: number;
}

export const NUTRIENTS_MOCK_DATA: INutrients_Item[] = [
  {
    nutrients_id: 1,
    nutrients_name: 'Витамин C',
    nutrients_daily_norm: 90,
    nutrients_unit: 'мг',
    nutrients_description: 'Поддерживает иммунитет и синтез коллагена. Также он является мощным антиоксидантом, который защищает клетки от повреждений свободными радикалами. Отлично усваивается из цитрусовых, киви, шиповника и черной смородины. Регулярное употребление помогает бороться с усталостью и улучшает усвоение железа.',
    nutrients_image_url: '/nutrients_default_image.jpg',
    nutrients_video_url: '/nutrients_default_video.mp4',
    nutrients_likes_count: 3,
  },
  {
    nutrients_id: 2,
    nutrients_name: 'Белок',
    nutrients_daily_norm: 90,
    nutrients_unit: 'г',
    nutrients_description: 'Главный строительный материал для всех клеток, тканей и органов нашего тела. Он критически важен для роста мышц, восстановления после тренировок и выработки ферментов. Лучшие источники: мясо птицы, рыба, яйца, творог, а также бобовые и орехи для вегетарианцев. Обеспечивает долгое чувство сытости.',
    nutrients_image_url: '/nutrients_default_image.jpg',
    nutrients_video_url: '/nutrients_default_video.mp4',
    nutrients_likes_count: 2,
  },
  {
    nutrients_id: 3,
    nutrients_name: 'Железо',
    nutrients_daily_norm: 18,
    nutrients_unit: 'мг',
    nutrients_description: 'Участвует в переносе кислорода в составе гемоглобина ко всем органам и тканям. Достаточный уровень железа предотвращает анемию, хроническую слабость и головокружения. Гемовое железо (из красного мяса и печени) усваивается лучше всего, а растительное (из яблок, гречки, шпината) рекомендуется употреблять вместе с витамином С.',
    nutrients_image_url: '/nutrients_default_image.jpg',
    nutrients_video_url: '/nutrients_default_video.mp4',
    nutrients_likes_count: 0,
  },
  {
    nutrients_id: 4,
    nutrients_name: 'Клетчатка',
    nutrients_daily_norm: 30,
    nutrients_unit: 'г',
    nutrients_description: 'Сложный углевод, который не переваривается, но служит пищей для полезных бактерий в кишечнике. Нормализует пищеварение, помогает контролировать вес и снижает уровень сахара и холестерина в крови. Содержится в цельнозерновых крупах, свежих овощах, фруктах с кожурой и отрубях.',
    nutrients_image_url: '/nutrients_default_image.jpg',
    nutrients_video_url: '/nutrients_default_video.mp4',
    nutrients_likes_count: 0,
  },
  {
    nutrients_id: 5,
    nutrients_name: 'Омега-3',
    nutrients_daily_norm: 1.6,
    nutrients_unit: 'г',
    nutrients_description: 'Полиненасыщенные жирные кислоты, незаменимые для здоровья сердечно-сосудистой системы и мозга. Они уменьшают воспаления в организме, улучшают память и поддерживают здоровье суставов и кожи. Главный источник — жирная морская рыба (лосось, скумбрия, сельдь), а также льняное семя и грецкие орехи.',
    nutrients_image_url: '/nutrients_default_image.jpg',
    nutrients_video_url: '/nutrients_default_video.mp4',
    nutrients_likes_count: 3,
  },
  {
    nutrients_id: 6,
    nutrients_name: 'Кальций',
    nutrients_daily_norm: 1000,
    nutrients_unit: 'мг',
    nutrients_description: 'Необходим для прочности костей и зубов, особенно в период роста и в старшем возрасте. Помимо этого, кальций регулирует мышечные сокращения и передачу нервных импульсов. Основные источники: молочные продукты, кунжут, миндаль и темно-зеленые листовые овощи. Для хорошего усвоения требуется витамин D.',
    nutrients_image_url: '/nutrients_default_image.jpg',
    nutrients_video_url: '/nutrients_default_video.mp4',
    nutrients_likes_count: 0,
  },
];