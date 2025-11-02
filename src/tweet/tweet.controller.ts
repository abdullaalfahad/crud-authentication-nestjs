import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { GetTweetQueryDto } from './dto/get-tweet-query.dto';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post()
  create(@Body() createTweetDto: CreateTweetDto) {
    return this.tweetService.create(createTweetDto);
  }

  @Get(':userId')
  findAll(@Param('userId', ParseIntPipe) userId: number, 
          @Query() getTweetQueryDto: GetTweetQueryDto
) {
    console.log(getTweetQueryDto);
    return this.tweetService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tweetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetService.update(id, updateTweetDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tweetService.remove(id);
  }
}
