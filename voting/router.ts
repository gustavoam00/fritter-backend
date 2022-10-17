import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import VotingCollection from './collection';
import * as votingValidator from './middleware';
import * as util from './util';

import FreetCollection from '../freet/collection';
import * as freetValidator from '../freet/middleware';
import * as userValidator from '../user/middleware';


const router = express.Router();

/**
 * Get votes by freet.
 *
 * @name GET /api/votes?freetId=id
 *
 * @return {VoteResponse[]} - An array of votes for freet with id, freetId
 * @throws {404} - If no freet has given freetId
 *
 */
 router.get(
    '/',
    [
      freetValidator.isFreetExists
    ],
    async (req: Request, res: Response) => {
      const freetVotes = await VotingCollection.allVotesforFreet(req.query.freet_id as string);
      res.status(200).json(freetVotes);
    }
  );

/**
 * Upvote freet.
 *
 * @name POST /api/votes/ 
 *
 * @return {VoteResponse} - The created vote
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet does not exist
 * @throws {405} - If freet has already been voted by user
 */
 router.post(
    '/:freetId?',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
      votingValidator.isVoteExists,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? '';
      const type = req.body.type === "Upvote";
      const vote = await VotingCollection.vote(userId, req.params.freetId, type);
  
      res.status(201).json({
        message: 'Your vote was saved successfully.',
        vote: vote
      });
    }
  );


/**
 * Delete a vote
 *
 * @name DELETE /api/votes/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the vote
 * @throws {404} - If the voteId is not valid
 */
 router.delete(
    '/:voteId?',
    [
      userValidator.isUserLoggedIn,
      votingValidator.isVoteExists,
      votingValidator.isValidVoteModifier,
    ],
    async (req: Request, res: Response) => {
      await FreetCollection.deleteOne(req.params.voteId);
      res.status(200).json({
        message: 'Your vote was deleted successfully.'
      });
    }
  );

export {router as votingRouter};

