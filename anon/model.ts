import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import UserCollection from 'user/collection';
import type {User} from '../user/model';

// Type definition for User on the backend
export type Anon = {
  _id: Types.ObjectId;
  username: string;
  connectedUser: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const AnonSchema = new Schema<Anon>({
  // The anon username
  username: {
    type: String,
    required: true
  },
  // The User's real account
  connectedUser:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const AnonModel = model<Anon>('Anon', AnonSchema);
export default AnonModel;