/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterDto {
  /** @example "nutrientuser" */
  username: string;
  /** @example "nutrient123" */
  password: string;
}

export interface LoginDto {
  /** @example "nutrientuser" */
  username: string;
  /** @example "nutrient123" */
  password: string;
}

export interface NutrientsCreateDto {
  /** @example "Белок" */
  name: string;
}

export interface NutrientsPublishDto {
  /** @example "Описание нутриента" */
  description?: string;
  /** @example 90 */
  dailyNorm: number;
  /** @example "г" */
  unit: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Lab4 API
 * @version 1.0.0
 * @contact
 *
 * Сессионная аутентификация. После login скопируйте sessionId из Set-Cookie и вставьте в Authorize → Cookie.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Users
     * @name AuthControllerRegister
     * @summary Регистрация нового пользователя (создателя)
     * @request POST:/api/users/register
     */
    authControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name AuthControllerLogin
     * @summary Аутентификация пользователя (создание сессии)
     * @request POST:/api/users/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name AuthControllerLogout
     * @summary Выход из аккаунта (удаление сессии)
     * @request POST:/api/users/logout
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/logout`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Nutrients
     * @name NutrientsControllerFindAll
     * @summary Получение списка опубликованных нутриентов с фильтрацией
     * @request GET:/api/nutrients
     */
    nutrientsControllerFindAll: (
      query?: {
        search?: string;
        minNorm?: number;
        maxNorm?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/nutrients`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Nutrients
     * @name NutrientsControllerCreate
     * @summary Добавление нового нутриента (черновика) с медиа
     * @request POST:/api/nutrients
     * @secure
     */
    nutrientsControllerCreate: (
      data: NutrientsCreateDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/nutrients`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Nutrients
     * @name NutrientsControllerGetFeed
     * @summary Получение ленты (открытие карточки или следующей)
     * @request GET:/api/nutrients/feed
     */
    nutrientsControllerGetFeed: (
      query: {
        id: string;
        next: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/nutrients/feed`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Nutrients
     * @name NutrientsControllerGetDraft
     * @summary Получение черновика авторизованного пользователя
     * @request GET:/api/nutrients/draft
     * @secure
     */
    nutrientsControllerGetDraft: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/nutrients/draft`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Nutrients
     * @name NutrientsControllerPublish
     * @summary Публикация черновика нутриента
     * @request PUT:/api/nutrients/{id}/publish
     * @secure
     */
    nutrientsControllerPublish: (
      id: number,
      data: NutrientsPublishDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/nutrients/${id}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Nutrients
     * @name NutrientsControllerRemove
     * @summary Логическое удаление нутриента
     * @request DELETE:/api/nutrients/{id}
     * @secure
     */
    nutrientsControllerRemove: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/nutrients/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Nutrients
     * @name NutrientsControllerLike
     * @summary Управление лайками (0 или 1)
     * @request POST:/api/nutrients/{id}/like
     * @secure
     */
    nutrientsControllerLike: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/nutrients/${id}/like`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
}
