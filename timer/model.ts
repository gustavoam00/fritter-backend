import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Timer = {
  _id: Types.ObjectId;
  on: Boolean;
  timeout: Number;
};

const TimerSchema = new Schema<Timer>({
  // whether the setting is on
  on: {
    type: Boolean,
    required: true
  },
  // Timer setting in minutes
  timeout: {
    type: Number,
    required: true
  }
});

const TimerModel = model<Timer>('Timer', TimerSchema);
export default TimerModel;