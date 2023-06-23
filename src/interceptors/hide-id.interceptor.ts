import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class HideIdInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map((data) => this.hideId(data)));
  }

  hideId(data: any) {
    if (Array.isArray(data)) {
      return data.map((item) => this.hideId(item));
    } else if (typeof data === 'object') {
      if ('id' in data) {
        delete data.id;
      }
      return data;
    } else {
      return data;
    }
  }
}
