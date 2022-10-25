import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

//Anon connects two 'User' objects, one is the real and the other is the annonymous
export type Anon = {
  _id: Types.ObjectId;
  realAccount: Schema.Types.ObjectId;
  anonAccount: Schema.Types.ObjectId;
};

const AnonSchema = new Schema<Anon>({
  // The User's real account
  realAccount: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The User's anon account
  anonAccount:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const AnonModel = model<Anon>('Anon', AnonSchema);
export default AnonModel;