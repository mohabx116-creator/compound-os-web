import axios from 'axios';
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

export async function getApiData<T>(
  path: string,
  params?: object,
): Promise<ApiData<T>> {
  try {
    const response = await apiClient.get<unknown>(path, {
      params: cleanParams(params),
    });
    const body = response.data;

    if (!isApiResponse<T>(body)) {
      throw new ApiClientError('Unexpected API response shape', 'INVALID_RESPONSE', response.status, body);
    }

    if (!body.success) {
      throw new ApiClientError(body.message || 'Request failed', 'API_ERROR', response.status, body);
    }

    if (body.data === undefined) {
      throw new ApiClientError('API response did not include data', 'INVALID_RESPONSE', response.status, body);
    }

    return {
      data: body.data,
      meta: body.meta,
      message: body.message,
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
      const status = error.response?.status;
      const body = error.response?.data;
      const message = getEnvelopeMessage(body) || error.message || 'Unable to reach Compound OS API';
      const code = status ? 'HTTP_ERROR' : 'NETWORK_ERROR';

      throw new ApiClientError(message, code, status, body);
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : 'Unexpected API client error',
      'UNKNOWN_ERROR',
    );
  }
}
