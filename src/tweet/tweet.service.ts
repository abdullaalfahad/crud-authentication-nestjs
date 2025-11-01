import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { UsersService } from 'src/users/users.service';
import { Not, Repository } from 'typeorm';
import { Tweet } from './entities/tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashtagService } from 'src/hashtag/hashtag.service';

@Injectable()
export class TweetService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashtagService: HashtagService,
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
  ) {}

  public async create(createTweetDto: CreateTweetDto) {
    const user = await this.userService.findOne(createTweetDto.userId);
    if (!user) {
      throw new Error(`User with id ${createTweetDto.userId} not found`);
    }

    const hashtags = await this.hashtagService.findHashtagsByIds(createTweetDto.hashtags as number[]);

    const tweet = this.tweetRepository.create({
      ...createTweetDto,
      user,
      hashtags
    });

    return await this.tweetRepository.save(tweet);
  }

  public async findAll(userId: number) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return await this.tweetRepository.find({
      where: { user: { id: userId } },
      relations: { user: true, hashtags: true},
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} tweet`;
  }

  public async update(id: number, updateTweetDto: UpdateTweetDto) {
    const tweet = await this.tweetRepository.findOne({
      where: { id }, 
      relations: { user: true, hashtags: true },
    });

    if(!tweet) {
      throw new Error(`Tweet with id ${id} not found`);
    }

    const hashtags = await this.hashtagService.findHashtagsByIds(updateTweetDto.hashtags as number[])

    tweet.text = updateTweetDto.text ?? tweet.text;
    tweet.imageUrl = updateTweetDto.imageUrl ?? tweet.imageUrl;
    tweet.hashtags = updateTweetDto.hashtags ? hashtags : tweet.hashtags;

    return await this.tweetRepository.save(tweet); 
  }

  public async remove(id: number) {
    await this.tweetRepository.delete({id});

    return { deleted: true, id}
  }
}
