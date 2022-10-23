import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReactionCollection from './collection';
import * as reactionValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as userValidator from '../user/middleware';


const router = express.Router();

/**
 * Get reactions by freet.
 *
 * @name GET GET /api/freetId
 *
 * @return {ReactionResponse[]} - An array of reactions for freet with id, freetId
 * @throws {404} - If no freet has given freetId
 *
 */
 router.get(
    '/:freetId',
    [
      freetValidator.isFreetExists
    ],
    async (req: Request, res: Response) => {
      const freetReactions = await ReactionCollection.allReactionsforFreet(req.params.freetId);
      res.status(200).json(freetReactions);
    }
  );

/**
 * React to a freet.
 *
 * @name POST /api/reaction/freetId
 *
 * @return {ReactionResponse} - The created reaction
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet does not exist
 * @throws {403} - If freet has already been reacted by user
 */
 router.post(
    '/:freetId',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
      reactionValidator.isFreetReacted,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? '';
      const emoji = req.body.emoji;
      const reaction = await ReactionCollection.react(userId, req.params.freetId, emoji);
  
      res.status(201).json({
        message: 'Your reaction was saved successfully.',
        reaction: reaction
      });
    }
  );


/**
 * Delete a reaction
 *
 * @name DELETE /api/reaction/reactionId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of the reaction 
 * @throws {404} - If the reactionId is not valid
 */
 router.delete(
    '/:reactionId',
    [
      userValidator.isUserLoggedIn,
      reactionValidator.isReactionExists,
      reactionValidator.isValidReactionModifier,
    ],
    async (req: Request, res: Response) => {
      await ReactionCollection.deleteReaction(req.params.reactionId);
      res.status(200).json({
        message: 'Your reaction was deleted successfully.'
      });
    }
  );

export {router as reactionRouter};