import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import VotingCollection from './collection';
import VotingModel from './model';

const isVoteExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.voteId);
  const vote = validFormat ? await VotingCollection.findOne(req.params.voteId) : '';
  if (!vote) {
    res.status(404).json({
      error: {
        freetNotFound: `Vote with vote ID ${req.params.voteId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the vote whose voteId is in req.params
 */
const isValidVoteModifier = async (req: Request, res: Response, next: NextFunction) => {
  const vote = await VotingCollection.findOne(req.params.voteId);
  const userId = vote.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' f. votes'
    });
    return;
  }

  next();
};

const isFreetVoted = async (req: Request, res: Response, next: NextFunction) => {
    if (VotingModel.find({authorId: req.session.userI, freetId: req.params.freetId})) {
      res.status(405).json({
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
