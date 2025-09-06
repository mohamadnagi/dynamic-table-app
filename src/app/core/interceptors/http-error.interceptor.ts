import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);

  return next(req).pipe(
    retry({
      count: req.method === 'GET' ? 1 : 0,
      delay: (error, retryCount) => {
        logger.warn(`Retrying request (${retryCount}): ${req.url}`);
        return timer(1000 * retryCount);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      logger.error(`HTTP Error: ${error.status} - ${error.message}`, error);
      
      let errorMessage = 'An unexpected error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request';
            break;
          case 401:
            errorMessage = 'Unauthorized';
            break;
          case 403:
            errorMessage = 'Forbidden';
            break;
          case 404:
            errorMessage = 'Not Found';
            break;
          case 500:
            errorMessage = 'Internal Server Error';
            break;
          case 0:
            errorMessage = 'Network Error - Please check your connection';
            break;
        }
      }

      return throwError(() => ({ ...error, userMessage: errorMessage }));
    })
  );
};
