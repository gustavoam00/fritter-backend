import type {HydratedDocument, Types} from 'mongoose';
import type {Group} from './model';
import GroupModel from './model';
import type {User} from '../user/model';

class GroupCollection {
    static async createGroup(owner: Types.ObjectId | string, name: string, members:Set<User>): Promise<HydratedDocument<Group>>{
        const group = new GroupModel({
            owner, 
            members, 
            name
        });
        await group.save();
        return group;
    }

    static async findallGroupsofUser(owner: Types.ObjectId | string):Promise<Array<Group>>{
        return GroupModel.find({owner});
    }

    static async findGroup(groupId: Types.ObjectId | string): Promise<HydratedDocument<Group>> {
        return GroupModel.findOne({_id: groupId});
    }

    static async findGroupByName(owner: Types.ObjectId | string, name: string):Promise<HydratedDocument<Group>>{
        return GroupModel.findOne({owner, name});
    }

    static async deleteGroup(groupId: Types.ObjectId | string): Promise<boolean> {
        const group = await GroupModel.deleteOne({_id: groupId});
        return group !== null;
    }

    static async addMember(groupId: Types.ObjectId | string, member: User): Promise<boolean>{
        const group = await GroupModel.findOne({_id: groupId});
        group.members.add(member);
        return group !== null;
    }
    
    static async removeMember(groupId: Types.ObjectId | string, member: User): Promise<boolean>{
        const group = await GroupModel.findOne({_id: groupId});
        group.members.delete(member);
        return group !== null;
    }

    static async changeName(groupId: Types.ObjectId | string, newName: string): Promise<boolean>{
        const group = await GroupModel.findOne({_id: groupId});
        group.name = newName;
        return group !== null;
    }
    
}
export default GroupCollection;