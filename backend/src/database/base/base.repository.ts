import {
  Model,
  Document,
  QueryOptions,
  UpdateQuery,
  PopulateOptions,
} from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: any): Promise<T> {
    const createdItem = new this.model(data);
    return createdItem.save();
  }

  async find(
    filter: any = {},
    options: QueryOptions = {},
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<T[]> {
    let query = this.model.find(
      { isDeleted: { $ne: true }, ...filter },
      null,
      options,
    );
    if (populate) {
      query = query.populate(populate);
    }
    return query.exec();
  }

  async findOne(
    filter: any,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<T | null> {
    let query = this.model.findOne({ isDeleted: { $ne: true }, ...filter });
    if (populate) {
      query = query.populate(populate);
    }
    return query.exec();
  }

  async findById(
    id: string,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<T | null> {
    let query = this.model.findOne({ _id: id, isDeleted: { $ne: true } });
    if (populate) {
      query = query.populate(populate);
    }
    return query.exec();
  }

  async update(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
    return this.model
      .findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, updateData, {
        new: true,
      })
      .exec();
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.model
      .findOneAndUpdate(
        { _id: id, isDeleted: { $ne: true } },
        { isDeleted: true, deletedAt: new Date() },
      )
      .exec();
    return !!result;
  }

  async count(filter: any = {}): Promise<number> {
    return this.model
      .countDocuments({ isDeleted: { $ne: true }, ...filter })
      .exec();
  }
}
