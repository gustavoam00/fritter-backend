import type {Request, Response} from 'express';
import express from 'express';
import AnonCollection from './collection';
import * as userValidator from '../user/middleware';
import * as anonValidator from './middleware';


const router = express.Router();

/**
 * Sign in user to anon account
 *
 * @name POST /api/anon/session
 *
 * @return {string} - success message
 * @throws {403} - If user is not logged in
 * @throws {403} - If user already in anon mode
 *
 */
 router.post(
    '/session',
    [
      userValidator.isUserLoggedIn,
      anonValidator.isInAnon
    ],
    async (req: Request, res: Response) => {
      const anon = await AnonCollection.findAnon(req.session.userId, false);
      console.log(anon);
      req.session.userId = anon.anonAccount.toString();
      res.status(200).json({
        message: 'You have switched into Anonymous mode',
      });
    }
);

/**
 * Sign out user from anon account
 *
 * @name DELETE /api/anon/session
 *
 * @return {string} - success message
 * @throws {403} - If user is not logged in
 * @throws {403} - If user not in anon mode
 *
 */
 router.delete(
    '/session',
    [
      userValidator.isUserLoggedIn,
      anonValidator.isNotInAnon
    ],
    async (req: Request, res: Response) => {
        const anon = await AnonCollection.findAnon(req.session.userId, true);
        req.session.userId = anon.realAccount.toString();
        res.status(200).json({
            message: 'You have switched out from Anonymous Mode',
        });
    }
);

export {router as anonRouter};