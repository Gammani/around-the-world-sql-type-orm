import { ObjectId } from 'mongodb';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';

export class BlogCreateModel {
  @ApiProperty({
    description: 'name',
    example: 'string',
  })
  @Trim()
  @IsString()
  @Length(1, 15)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'description',
    example: 'string',
  })
  @Trim()
  @IsString()
  @Length(1, 500)
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'websiteUrl',
    example:
      'https://tjyiiObWFcs6oLposi_9a-B8mhhzaFy9q3zuP2mFR4Yrz78Rvun5vS.RIC',
  })
  @Trim()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  @IsNotEmpty()
  websiteUrl: string;
}

export class BlogUpdateModel {
  @ApiProperty({
    description: 'name',
    example: 'string',
  })
  @Trim()
  @IsString()
  @Length(1, 15)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'description',
    example: 'string',
  })
  @Trim()
  @IsString()
  @Length(1, 500)
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'websiteUrl',
    example:
      'https://tjyiiObWFcs6oLposi_9a-B8mhhzaFy9q3zuP2mFR4Yrz78Rvun5vS.RIC',
  })
  @Trim()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  @IsNotEmpty()
  websiteUrl: string;
}
export type CreatedBlogType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogInputDtoType = {
  blogId: ObjectId;
  blogName: string;
};
