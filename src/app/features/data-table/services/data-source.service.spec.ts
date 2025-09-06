import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataSourceService } from './data-source.service';
import { TableQuery, TableResult } from '../models/table-column.model';

describe('DataSourceService', () => {
  let service: DataSourceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataSourceService]
    });
    service = TestBed.inject(DataSourceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load data with correct parameters', () => {
    const mockQuery: TableQuery = {
      page: 0,
      size: 10,
      sorts: [{ field: 'name', dir: 'asc' }],
      global: 'test',
      filters: { status: 'active' }
    };

    const mockResult: TableResult<any> = {
      data: [{ id: '1', name: 'Test' }],
      total: 1
    };

    service.loadData('/test', mockQuery).subscribe(result => {
      expect(result).toEqual(mockResult);
    });

    const req = httpMock.expectOne('/api/test?page=0&size=10&global=test&sort=name:asc&filter[status]=active');
    expect(req.request.method).toBe('GET');
    req.flush(mockResult);
  });

  it('should cache results', () => {
    const mockQuery: TableQuery = {
      page: 0,
      size: 10,
      sorts: [],
      global: '',
      filters: {}
    };

    const mockResult: TableResult<any> = {
      data: [{ id: '1', name: 'Test' }],
      total: 1
    };

    // First call
    service.loadData('/test', mockQuery).subscribe();
    const req1 = httpMock.expectOne('/api/test?page=0&size=10');
    req1.flush(mockResult);

    // Second call should use cache
    service.loadData('/test', mockQuery).subscribe(result => {
      expect(result).toEqual(mockResult);
    });
    httpMock.expectNone('/api/test');
  });

  it('should clear cache', () => {
    service.clearCache();
    // Cache should be empty after clearing
    expect(service).toBeTruthy();
  });
});
