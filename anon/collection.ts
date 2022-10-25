import type {HydratedDocument, Types} from 'mongoose';
import type {Anon} from './model';
import AnonModel from './model';
import UserCollection from '../user/collection';

class AnonCollection {
    static async createAnon(userId: Types.ObjectId, pw: string): Promise<HydratedDocument<Anon>>{
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let username = ''
        for ( var i = 0; i < 10; i++ ) {
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

    static async findAnon(id: string, inAnon:boolean): Promise<HydratedDocument<Anon>>{
        if (inAnon){
            return AnonModel.findOne({anonAccount: id});
        } else{
            return AnonModel.findOne({realAccount: id});
        }
        
    }
}
export default AnonCollection;