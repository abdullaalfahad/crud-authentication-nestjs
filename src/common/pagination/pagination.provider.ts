import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationProvider {
    public async paginateQuery<T extends ObjectLiteral>(paginateQueryDto: PaginationQueryDto, repository: Repository<T>, where?: FindOptionsWhere<T>) {
        const findOptions = {
            where: where ?? {},
            skip: (paginateQueryDto.page as number) * (paginateQueryDto.limit as number),
            take: paginateQueryDto.limit,
       };

        return await repository.find(findOptions);
}}
