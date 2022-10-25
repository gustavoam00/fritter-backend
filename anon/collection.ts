import type {HydratedDocument, Types} from 'mongoose';
import type {Anon} from './model';
import AnonModel from './model';
import UserCollection from '../user/collection';

class AnonCollection {
    /**
     * Creates an Anonymous object to connect two 'Users', one of which is real and the other is the anonymous
     * 
     * @param {Types.ObjectId} userId -  user id of the real account
     * @param {string} pw - the password of the real account, which is being used as the password to the anonymous
     * @returns {Promise<HydratedDocument<Anon>>} - the newly created anon
     */
    static async createAnon(userId: Types.ObjectId, pw: string): Promise<HydratedDocument<Anon>>{
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let username = ''
        for ( var i = 0; i < 10; i++ ) { //creates a random username, technically not unique so I would change this to check for uniqueness if system scaled
            username += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const anonUser = await UserCollection.addOne(username, pw, true);
        const anon = new AnonModel({
            realAccount: userId,
            anonAccount: anonUser._id,
        });
        await anon.save();
        return anon;
    }

    /**
     * Find an anon based on an user id, which is either the real or anon id
     * 
     * @param {string} id - the user id to be used for querying
     * @param {boolean} inAnon - true if id is of anon user, false otherwise
     * @returns {Promise<HydratedDocument<Anon>>} - return the anon
     */
    static async findAnon(id: string, inAnon:boolean): Promise<HydratedDocument<Anon>>{
        if (inAnon) {
            return await AnonModel.findOne({anonAccount: id});
        } else {
            return await AnonModel.findOne({realAccount: id});
        }
    }
}
export default AnonCollection;