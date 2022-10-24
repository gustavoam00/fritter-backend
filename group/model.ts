import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Group = {
  _id: Types.ObjectId; 
  owner: Types.ObjectId;
  members: Array<String>;
  name: String;
};

const GroupSchema = new Schema<Group>({
  // The author userId
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Array of users in this group
  members: {
    type: [String],
    required: true,
  },
  //name of group
  name: {
    type: String,
    required: true
  }
});

const GroupModel = model<Group>('Group', GroupSchema);
export default GroupModel;