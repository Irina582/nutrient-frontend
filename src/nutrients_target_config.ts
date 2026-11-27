export const nutrients_target_tauri = true;

export const nutrients_api_proxy_addr = 'http://10.27.13.32:3000';
export const nutrients_img_proxy_addr = 'http://10.27.13.32:9000';

export const nutrients_dest_api = nutrients_target_tauri ? nutrients_api_proxy_addr : '/';
export const nutrients_dest_img = nutrients_target_tauri ? nutrients_img_proxy_addr : '';
export const nutrients_dest_root = nutrients_target_tauri ? '' : '/nutrient-frontend';