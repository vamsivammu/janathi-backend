import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attempt } from '../models/attempt.entity';

@Injectable()
export class AttemptsService {
    constructor(
        @InjectRepository(Attempt)
        private attemptsRepo:Repository<Attempt>
    ){  }
    
}
