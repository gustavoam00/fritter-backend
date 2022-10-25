import type {HydratedDocument, Types} from 'mongoose';
import type {Reaction} from './model';
import ReactionModel from './model';

class ReactionCollection {
    /**
     * Create a new reaction for a freet
     * 
     * @param {Types.ObjectId | string} authorId - the _id of user posting reaction
     * @param {Types.ObjectId | string} freetId - the _id of freet that this is attached to
     * @param {string} emoji - the type of the reaction
     * @returns {Promise<HydratedDocument<Reaction>>} - the newly created reaction
     */
    static async react(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string, emoji:string): Promise<HydratedDocument<Reaction>> {
        const vote = new ReactionModel({
            authorId,
            freetId, 
            emoji
        });
        await vote.save();
        return vote;
    }

    /**
     * Delete a reaction with given reactionId
     * 
     * @param {Types.ObjectId | string} reactionId - the _id of the reaction
     * @returns {Promise<boolean>}  - true if reaciton rdeleted, false otherwise
     */
    static async deleteReaction(reactionId: Types.ObjectId | string): Promise<boolean> {
        const reaction = await ReactionModel.deleteOne({_id: reactionId});
        return reaction !== null;
    }

    /**
     * Find a reaciton with given reactionId
     * 
     * @param {Types.ObjectId | string} reactionId - the _id of the reaction
     * @returns {Promise<HydratedDocument<Reaction>>} - the reaction found 
     */
    static async findOne(reactionId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
        return ReactionModel.findOne({_id: reactionId});
    }

    /**
     * Find all the reaction for a freet with given freetId
     * 
     * @param {Types.ObjectId | string} freetId - the _id of the freet
     * @returns {Promise<Array<HydratedDocument<Reaction>>} - the lsit of reaction attached to the freet
     */
    static async allReactionsforFreet(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Reaction>>> {
        const all = await ReactionModel.find({freetId: freetId});
        return all;
    }
}

export default ReactionCollection;
