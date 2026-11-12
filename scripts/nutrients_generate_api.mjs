import { resolve } from 'path';
import { generateApi } from 'swagger-typescript-api';

generateApi({
    name: 'nutrients_Api.ts',
    output: resolve(process.cwd(), './src/nutrients_modules'),
    url: 'http://localhost:3000/api-json',
    httpClientType: 'axios',
});