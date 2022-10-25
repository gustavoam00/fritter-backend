import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

// Type definition for User on the backend
export type Anon = {
  _id: Types.ObjectId;
  realAccount: Schema.Types.ObjectId;
  anonAccount: Schema.Types.ObjectId;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const AnonSchema = new Schema<Anon>({
  // The anon username
  realAccount: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The User's real account
  anonAccount:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const AnonModel = model<Anon>('Anon', AnonSchema);
export default AnonModel;