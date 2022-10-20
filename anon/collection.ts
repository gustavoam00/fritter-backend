import type {HydratedDocument, Types} from 'mongoose';
import type {Anon} from './model';
import AnonModel from './model';
import type {User} from '../user/model';

class AnonCollection {
    static async createAnon(connectedUser: User): Promise<HydratedDocument<Anon>>{
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let username = ''
        for ( var i = 0; i < 10; i++ ) {
            username += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const anon = new AnonModel({
            username,
            connectedUser
        });
        await anon.save();
        return anon;
    }

    static async switchToAnon(): Promise<Boolean>{
        return true;
    }
}
export default AnonCollection;