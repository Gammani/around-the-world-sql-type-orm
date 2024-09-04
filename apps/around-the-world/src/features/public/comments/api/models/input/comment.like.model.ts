import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { LikeStatusIsValid } from '../../../../../../infrastructure/decorators/validate/like.status.isValid.decorator';
import { LikeStatus } from '../../../../../../infrastructure/helpres/types';
import { ApiProperty } from '@nestjs/swagger';

export class CommentLikeModel {
  @ApiProperty({
    description: 'like-status',
    example: 'None',
  })
  @Trim()
  @LikeStatusIsValid()
  likeStatus: LikeStatus;
}
