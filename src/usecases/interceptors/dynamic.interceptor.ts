import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { PostsEntity } from "src/database/entities/posts/posts.entities";
import { UserEntity } from "src/database/entities/user/user.entities";

@Injectable()
export class DynamicSerializationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data?.data)) {
          // Tableau d'entités
          if (data.data.length && data.data[0]?.hasOwnProperty('title')) {
            data.data = data.data.map((item: any) => new PostsEntity(item));
          } else if (data.data.length && data.data[0]?.hasOwnProperty('email')) {
            data.data = data.data.map((item: any) => new UserEntity(item));
          }
        } else if (data?.data) {
          // Entité unique
          if (data.data.hasOwnProperty('title')) {
            data.data = new PostsEntity(data.data);
          } else if (data.data.hasOwnProperty('email')) {
            data.data = new UserEntity(data.data);
          }
        }
        return data;
      }),
    );
  }
}