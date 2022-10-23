import type {HydratedDocument, Types} from 'mongoose';
import type {Reaction} from './model';
import ReactionModel from './model';

class ReactionCollection {
    static async react(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string, emoji:String): Promise<HydratedDocument<Reaction>> {
        const vote = new ReactionModel({
            authorId,
            freetId, 
            emoji
        });
        await vote.save();
        return vote;
    }

    static async deleteReaction(reactionId: Types.ObjectId | string): Promise<boolean> {
        const reaction = await ReactionModel.deleteOne({_id: reactionId});
        return reaction !== null;
    }

    static async findOne(reactionId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
        return ReactionModel.findOne({_id: reactionId}).populate('authorId');
    }

    static async allReactionsforFreet(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Reaction>>> {
        const all = await ReactionModel.find({freetId: freetId});
        return all;
    }
}

export default ReactionCollection;
