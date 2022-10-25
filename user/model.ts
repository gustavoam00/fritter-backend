import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type User = {
  _id: Types.ObjectId;
  username: string;
  password: string;
  dateJoined: Date;
  anon: Boolean;
};

const UserSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true
  },
  //Whether or not this User is an Anon account
  anon: {
    type: Boolean,
    required:true
  }
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
