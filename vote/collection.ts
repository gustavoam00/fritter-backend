import type {HydratedDocument, Types} from 'mongoose';
import type {Vote} from './model';
import VoteModel from './model';

class VoteCollection {
    /**
     * Create a new vote
     * 
     * @param {Types.ObjectId | string} authorId - the user _if of author
     * @param {Types.ObjectId | string} freetId - the _id of the freet this vote is attached to
     * @param {boolean} up - ture if its a upvote, false otehrwise
     * @returns {Promise<HydratedDocument<Vote>>} - the created vote
     */
    static async vote(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string, up:boolean): Promise<HydratedDocument<Vote>> {
        const vote = new VoteModel({
            authorId,
            freetId, 
            up
        });
        await vote.save();
        return vote;
    }

    /**
     * Delete a vote with given voteId
     * 
     * @param {Types.ObjectId | string} voteId - the _id of the vote
     * @returns {Promise<boolean>} - true if vote deleted, false otherwise
     */
    static async deleteVote(voteId: Types.ObjectId | string): Promise<boolean> {
        const vote = await VoteModel.deleteOne({_id: voteId});
        return vote !== null;
    }

    /**
     * Find a vote with given voteId
     * 
     * @param {Types.ObjectId | string} voteId - the _id of the vote being searched
     * @returns {Promise<HydratedDocument<Vote>>} - the vote found
     */
    static async findOne(voteId: Types.ObjectId | string): Promise<HydratedDocument<Vote>> {
        return VoteModel.findOne({_id: voteId});
    }

    /**
     *Find all voted for a freet with given freetId
     *
     * @param {Types.ObjectId | string} freetId - the _id of the freet
     * @returns {Promise<Array<Vote>>} - a list of all the votes for that freet
     */
    static async allVotesforFreet(freetId: Types.ObjectId | string): Promise<Array<Vote>> {
        const all = await VoteModel.find({freetId: freetId});
        return all;
    }
}

export default VoteCollection;