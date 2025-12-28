import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async create(userData: Partial<User>): Promise<UserDocument> {
        return this.usersRepository.create(userData);
    }

    async findByPhoneNumber(phoneNumber: string): Promise<UserDocument | null> {
        return this.usersRepository.findByPhoneNumber(phoneNumber);
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.usersRepository.findById(id);
    }
}
