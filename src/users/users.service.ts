import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    try {
      const payload = {
        ...createUserDto,
        profile: createUserDto.profile ?? {},
      } as DeepPartial<User>;
  
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: payload.email },
          { username: payload.username },
        ],
      });
  
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }
  
      const user = this.userRepository.create(payload);
      return await this.userRepository.save(user);
    } catch (error) {
      if(error.code === "ECONNREFUSED") {
        throw new BadRequestException('An error occurred. Please try again later.', {
          description: 'Database connection was refused.',
        });
      }

      throw error;
    }
  }

  public async findAll() {
    return await this.userRepository.find({
      relations: { profile: true },
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  public async remove(id: number) {
    await this.userRepository.delete(id);
    return { message: `User with id ${id} has been removed` };
  }
}
