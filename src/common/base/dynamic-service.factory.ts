import { Injectable, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

export interface EntityType {
  id: number | string;
  [key: string]: any;
}

@Injectable()
export class DynamicServiceFactory {
  static create<T extends EntityType>(entity: Type<T>): Type<DynamicEntityService<T>> {
    @Injectable()
    class DynamicEntityServiceHost implements DynamicEntityService<T> {
      constructor(
        @InjectRepository(entity)
        protected readonly repository: Repository<T>,
      ) {}

      all(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
      }

      find(id: number | string, options?: FindManyOptions<T>): Promise<T | null> {
        if (options?.where) {
          options.where = { id, ...(options.where as any) } as FindOptionsWhere<T>;
        } else {
          options = { ...options, where: { id } as FindOptionsWhere<T> };
        }

        return this.repository.findOne(options);
      }

      create(data: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
      }

      async update(id: number | string, data: DeepPartial<T>): Promise<T | null> {
        await this.repository.update(id, data as any);
        return this.find(id);
      }

      async remove(id: number | string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
      }
    }

    return DynamicEntityServiceHost;
  }
}

export interface DynamicEntityService<T extends EntityType> {
  all(options?: FindManyOptions<T>): Promise<T[]>;
  find(id: number | string, options?: FindManyOptions<T>): Promise<T | null>;
  create(data: DeepPartial<T>): Promise<T>;
  update(id: number | string, data: DeepPartial<T>): Promise<T | null>;
  remove(id: number | string): Promise<boolean>;
}
