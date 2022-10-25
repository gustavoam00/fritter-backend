import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import VoteCollection from './collection';
import * as voteValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as userValidator from '../user/middleware';

const router = express.Router();

/**
 * Get votes by freet.
 *
 * @name GET /api/votes/:freetId
 *
 * @return {VoteResponse[]} - An array of votes for freet with id, freetId
 * @throws {404} - If no freet has given freetId
 *
 */
 router.get(
    '/:freetId',
    [
      freetValidator.isFreetExists
    ],
    async (req: Request, res: Response) => {
      const freetVotes = await VoteCollection.allVotesforFreet(req.params.freetId);
      res.status(200).json({
          votes: freetVotes
      });
    }
  );

/**
 * Upvote freet.
 *
 * @name POST /api/votes/:freetId
 *
 * @return {VoteResponse} - The created vote
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet does not exist
 * @throws {403} - If freet has already been voted by user
 */
 router.post(
    '/:freetId',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
      voteValidator.isFreetVoted,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? '';
      console.log(req.body)
      console.log(req.body.type)
      const type = req.body.type === "upvote";
      const vote = await VoteCollection.vote(userId, req.params.freetId, type);
  
      res.status(201).json({
        message: 'Your vote was saved successfully.',
        vote: vote
      });
    }
  );


/**
 * Delete a vote
 *
 * @name DELETE /api/votes/:voteId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the vote
 * @throws {404} - If the voteId is not valid
 */
 router.delete(
    '/:voteId',
    [
      userValidator.isUserLoggedIn,
      voteValidator.isVoteExists,
      voteValidator.isValidVoteModifier,
    ],
    async (req: Request, res: Response) => {
      await VoteCollection.deleteVote(req.params.voteId);
      res.status(200).json({
        message: 'Your vote was deleted successfully.'
      });
    }
  );

export {router as voteRouter};

