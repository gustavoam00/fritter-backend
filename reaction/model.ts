import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Reaction = {
  _id: Types.ObjectId; 
  authorId: Types.ObjectId;
  freetId: Types.ObjectId;
  emoji: String;
};

const ReactionSchema = new Schema<Reaction>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true
  },
  //The freet this is a reaction to
  freetId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // What Emoji reaction it is  
  emoji: {
    type: String,
    required: true
  }
});

const ReactionModel = model<Reaction>('Reaction', ReactionSchema);
export default ReactionModel;