import type {Request, Response} from 'express';
import express from 'express';
import GroupCollection from './collection';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import * as groupValidator from './middleware';
import * as userValidator from '../user/middleware';

const router = express.Router();


export {router as groupRouter};
