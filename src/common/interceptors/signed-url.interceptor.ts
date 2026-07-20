import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { signUrl } from '../utils/signed-url.helper';

@Injectable()
export class SignedUrlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => this.processData(data)),
    );
  }

  private processData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      if (data.includes('/storage/')) {
        return signUrl(data);
      }
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.processData(item));
    }

    if (typeof data === 'object') {
      // Keep class instances / special objects if any (like Date)
      if (data instanceof Date) {
        return data;
      }
      
      const result = {};
      for (const key of Object.keys(data)) {
        result[key] = this.processData(data[key]);
      }
      return result;
    }

    return data;
  }
}
