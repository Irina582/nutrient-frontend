import { Api } from './Api';
import { nutrients_dest_api } from '../nutrients_target_config';

export const nutrients_api = new Api({
  baseURL: nutrients_dest_api,
  withCredentials: true,
});