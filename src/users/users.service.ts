import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from './entities/user.entity';
import { table } from 'console';
import { AlreadyUserExistException } from 'src/CustomExceptions/already-user-exist.exception';

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
  
      const existingUserEmail = await this.userRepository.findOne({
        where: [
          { email: payload.email }
        ],
      });
  
      if (existingUserEmail) {
        throw new AlreadyUserExistException('email', createUserDto.email);
      }

      const existingUserUsername = await this.userRepository.findOne({
        where: [
          { username: payload.username }
        ],
      });
  
      if (existingUserUsername) {
        throw new AlreadyUserExistException('username', createUserDto.username);
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
    const user = this.userRepository.findOne({
      where: { id },
    });

    if(!user) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: `User with id ${id} not found`,
        table: 'users',
      }, HttpStatus.NOT_FOUND );
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  public async remove(id: number) {
    await this.userRepository.delete(id);
    return { message: `User with id ${id} has been removed` };
  }
}
