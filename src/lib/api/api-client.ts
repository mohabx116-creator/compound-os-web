import axios from 'axios';
import { getAccessToken } from '../auth/auth-token-provider';
import type { ApiResponse, PaginatedMeta } from './types';

const DEFAULT_API_BASE_URL = 'https://compound-os-api.onrender.com/api/v1';

export type ApiClientErrorCode =
  | 'HTTP_ERROR'
  | 'API_ERROR'
  | 'INVALID_RESPONSE'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export class ApiClientError extends Error {
  readonly status?: number;
  readonly code: ApiClientErrorCode;
  readonly details?: unknown;

  constructor(message: string, code: ApiClientErrorCode, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken()?.trim();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

function cleanParams(params?: object) {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => (
      value !== undefined
      && value !== null
      && value !== ''
      && ['string', 'number', 'boolean'].includes(typeof value)
    )),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPaginatedMeta(meta: unknown): meta is PaginatedMeta {
  return (
    isRecord(meta)
    && typeof meta.page === 'number'
    && typeof meta.limit === 'number'
    && typeof meta.totalCount === 'number'
    && typeof meta.totalPages === 'number'
    && typeof meta.hasNextPage === 'boolean'
    && typeof meta.hasPreviousPage === 'boolean'
  );
}

function isApiResponse<T>(body: unknown): body is ApiResponse<T> {
  return (
    isRecord(body)
    && typeof body.success === 'boolean'
    && typeof body.message === 'string'
    && (!('meta' in body) || body.meta === undefined || isPaginatedMeta(body.meta))
  );
}

function getEnvelopeMessage(body: unknown) {
  return isRecord(body) && typeof body.message === 'string' ? body.message : undefined;
}

export interface ApiData<T> {
  data: T;
  meta?: PaginatedMeta;
  message: string;
}

function unwrapApiData<T>(body: unknown, status: number): ApiData<T> {
  if (!isApiResponse<T>(body)) {
    throw new ApiClientError('Unexpected API response shape', 'INVALID_RESPONSE', status, body);
  }

  if (!body.success) {
    throw new ApiClientError(body.message || 'Request failed', 'API_ERROR', status, body);
  }

  if (body.data === undefined) {
    throw new ApiClientError('API response did not include data', 'INVALID_RESPONSE', status, body);
  }

  return {
    data: body.data,
    meta: body.meta,
    message: body.message,
  };
}

function normalizeApiError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    const status = error.response?.status;
    const body = error.response?.data;
    const message = getEnvelopeMessage(body) || error.message || 'Unable to reach Compound OS API';
    const code = status ? 'HTTP_ERROR' : 'NETWORK_ERROR';

    return new ApiClientError(message, code, status, body);
  }

  return new ApiClientError(
    error instanceof Error ? error.message : 'Unexpected API client error',
    'UNKNOWN_ERROR',
  );
}

export async function getApiData<T>(
  path: string,
  params?: object,
): Promise<ApiData<T>> {
  try {
    const response = await apiClient.get<unknown>(path, {
      params: cleanParams(params),
    });
    const body = response.data;

    return unwrapApiData<T>(body, response.status);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function postApiData<T>(
  path: string,
  payload?: object,
): Promise<ApiData<T>> {
  try {
    const response = await apiClient.post<unknown>(path, payload);
    const body = response.data;

    return unwrapApiData<T>(body, response.status);
  } catch (error) {
    throw normalizeApiError(error);
  }
}
