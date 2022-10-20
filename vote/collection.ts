import type {HydratedDocument, Types} from 'mongoose';
import type {Vote} from './model';
import VoteModel from './model';

class VoteCollection {
    static async vote(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string, up:Boolean): Promise<HydratedDocument<Vote>> {
        const vote = new VoteModel({
            authorId,
            freetId, 
            up
        });
        await vote.save();
        return vote;
    }

    static async deleteVote(voteId: Types.ObjectId | string): Promise<boolean> {
        const vote = await VoteModel.deleteOne({_id: voteId});
        return vote !== null;
    }

    static async findOne(voteId: Types.ObjectId | string): Promise<HydratedDocument<Vote>> {
        return VoteModel.findOne({_id: voteId}).populate('authorId');
    }

    //What is populate?
    static async allVotesforFreet(freetId: Types.ObjectId | string): Promise<Array<Vote>> {
        const all = await VoteModel.find({freetId: freetId});//.populate('up');
        return all;
    }
}

export default VoteCollection;