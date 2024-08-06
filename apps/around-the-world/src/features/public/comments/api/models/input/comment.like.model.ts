import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { LikeStatusIsValid } from '../../../../../../infrastructure/decorators/validate/like.status.isValid.decorator';
import { LikeStatus } from '../../../../../../infrastructure/helpres/types';

export class CommentLikeModel {
  @Trim()
  @LikeStatusIsValid()
  likeStatus: LikeStatus;
}
