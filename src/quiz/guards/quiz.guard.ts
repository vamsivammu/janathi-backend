import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { QuizService } from '../service/quiz.service';

@Injectable()
export class QuizGuard implements CanActivate {
  constructor(
    private quizService:QuizService
  ){  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request:Request = context.switchToHttp().getRequest();
    const userId = request.user['id'];
    const quizId = request.params['quizId'];
    return this.quizService.hasAttemptAccess(quizId,userId);
  }
}
