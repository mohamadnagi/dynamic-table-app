import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { TableQuery, TableResult, Row } from '../models/table-column.model';
import { ConfigService } from '@core/services/config.service';
import { LoggerService } from '@core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);
  private readonly logger = inject(LoggerService);

  private readonly cache = new Map<string, { data: TableResult<Row>; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  loadData(endpoint: string, query: TableQuery): Observable<TableResult<Row>> {
    const cacheKey = this.buildCacheKey(endpoint, query);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.logger.debug('Returning cached data', { cacheKey });
      return new Observable(observer => observer.next(cached.data));
    }

    // Check if endpoint is a full URL (external API) or relative path (internal API)
    const url = endpoint.startsWith('http') ? endpoint : `${this.config.apiBaseUrl}${endpoint}`;
    const isExternalApi = endpoint.startsWith('http');
    const params = this.buildHttpParams(query, isExternalApi);

    this.logger.debug('Loading data', { url, query, isExternalApi });

    return this.http.get<any>(url, { params }).pipe(
      map(response => this.transformResponse(response, query, isExternalApi)),
      tap(result => {
        this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
        this.logger.debug('Data loaded and cached', { total: result.total });
      })
    );
  }

  private buildHttpParams(query: TableQuery, isExternalApi: boolean): HttpParams {
    let params = new HttpParams();

    // For external APIs, we'll handle pagination client-side
    // For internal APIs, use server-side pagination
    if (!isExternalApi) {
      params = params
        .set('page', query.page.toString())
        .set('size', query.size.toString());

      if (query.global) {
        params = params.set('global', query.global);
      }

      if (query.sorts.length > 0) {
        const sortString = query.sorts
          .map(sort => `${sort.field}:${sort.dir}`)
          .join(',');
        params = params.set('sort', sortString);
      }

      if (query.filters) {
        Object.entries(query.filters).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            params = params.set(`filter[${key}][op]`, value.op);
            params = params.set(`filter[${key}][value]`, value.value.toString());
          } else {
            params = params.set(`filter[${key}]`, value.toString());
          }
        });
      }
    }

    return params;
  }

  private buildCacheKey(endpoint: string, query: TableQuery): string {
    return `${endpoint}:${JSON.stringify(query)}`;
  }

  clearCache(): void {
    this.cache.clear();
    this.logger.debug('Cache cleared');
  }

  private transformResponse(response: any, query: TableQuery, isExternalApi: boolean): TableResult<Row> {
    // Handle different API response formats
    if (Array.isArray(response)) {
      // Direct array response (like JSONPlaceholder, REST Countries)
      const startIndex = query.page * query.size;
      const endIndex = startIndex + query.size;
      const paginatedData = response.slice(startIndex, endIndex);
      
      return {
        data: paginatedData.map((item, index) => ({
          id: item.id || item.cca3 || `row-${startIndex + index}`,
          ...item
        })),
        total: response.length,
        page: query.page,
        size: query.size,
        totalPages: Math.ceil(response.length / query.size)
      };
    } else if (response.data && typeof response.total === 'number') {
      // Standard paginated response format
      return {
        data: response.data.map((item: any, index: number) => ({
          id: item.id || `row-${index}`,
          ...item
        })),
        total: response.total,
        page: response.page || query.page,
        size: response.size || query.size,
        totalPages: response.totalPages || Math.ceil(response.total / query.size)
      };
    } else {
      // Fallback for unexpected response format
      this.logger.warn('Unexpected API response format', { response });
      return {
        data: [],
        total: 0,
        page: query.page,
        size: query.size,
        totalPages: 0
      };
    }
  }
}
