import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Vote = {
  _id: Types.ObjectId; 
  authorId: Types.ObjectId;
  freetId: Types.ObjectId;
  up: Boolean;
};

const VoteSchema = new Schema<Vote>({
  //the author's user id
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  //the freet this is a vote to
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // Whether its an upvote or downvote
  up: {
    type: Boolean,
    required: true
  }
});

const VoteModel = model<Vote>('Vote', VoteSchema);
export default VoteModel;