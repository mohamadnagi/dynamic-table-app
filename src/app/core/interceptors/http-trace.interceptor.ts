import { HttpInterceptorFn } from '@angular/common/http';

export const httpTraceInterceptor: HttpInterceptorFn = (req, next) => {
  const traceId = generateTraceId();
  const tracedReq = req.clone({
    setHeaders: {
      'X-Trace-Id': traceId,
      'X-Request-Time': new Date().toISOString()
    }
  });

  return next(tracedReq);
};

function generateTraceId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
