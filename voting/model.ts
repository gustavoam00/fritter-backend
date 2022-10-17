import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';


export type Vote = {
  _id: Types.ObjectId; 
  authorId: Types.ObjectId;
  freetId: Types.ObjectId;
  up: Boolean;
};

const VotingSchema = new Schema<Vote>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
  },
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

const VotingModel = model<Vote>('Voting', VotingSchema);
export default VotingModel;