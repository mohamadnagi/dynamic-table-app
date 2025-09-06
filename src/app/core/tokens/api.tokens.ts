import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
export const API_TIMEOUT = new InjectionToken<number>('API_TIMEOUT');
export const TRACE_ID_HEADER = new InjectionToken<string>('TRACE_ID_HEADER');
