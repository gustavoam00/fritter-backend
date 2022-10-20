import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import VoteCollection from './collection';
import VoteModel from './model';

const isVoteExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.voteId);
  const vote = validFormat ? await VoteCollection.findOne(req.params.voteId) : '';
  if (!vote) {
    res.status(404).json({
      error: {
        voteNotFound: `Vote with vote ID ${req.params.voteId} does not exist.`
      }
    });
    return;
  }

  next();
};

const isValidVoteModifier = async (req: Request, res: Response, next: NextFunction) => {
  const vote = await VoteCollection.findOne(req.params.voteId);
  const userId = vote.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' votes'
    });
    return;
  }

  next();
};

const isFreetVoted = async (req: Request, res: Response, next: NextFunction) => {
  const result = await VoteModel.findOne({authorId: req.session.userId, freetId: req.params.freetId})
  if (result) {
    res.status(403).json({
      error: 'Cannot vote twice'
    });
    return;
  }
    next();
  };

export {
  isVoteExists,
  isValidVoteModifier,
  isFreetVoted
};
