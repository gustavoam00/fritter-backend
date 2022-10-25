import type {HydratedDocument, Types} from 'mongoose';
import type {Group} from './model';
import GroupModel from './model';
import type {User} from '../user/model';

class GroupCollection {
    /**
     * Creates a group
     * 
     * @param {Types.ObjectId | string} owner - the owner of the group, which is the user that is logged in 
     * @param {string} name - the name for the group
     * @returns {Promise<HydratedDocument<Group>>} - the group
     */
    static async createGroup(owner: Types.ObjectId | string, name: string): Promise<HydratedDocument<Group>>{
        let members: string[] = []
        const group = new GroupModel({
            owner, 
            members: members, 
            name
        });
        await group.save();
        return group;
    }

    /**
     * Find and returns all groups created by an user
     * 
     * @param {Types.ObjectId | string} owner - the user that owns the groups
     * @returns {Promise<Array<Group>>} - the array of groups
     */
    static async findallGroupsofUser(owner: Types.ObjectId | string): Promise<Array<Group>>{
        return GroupModel.find({owner});
    }

    /**
     * Find a group with given group id
     * 
     * @param {Types.ObjectId | string} groupId - the id to be queried
     * @returns {Promise<HydratedDocument<Group>>} - the group found
     */
    static async findGroup(groupId: Types.ObjectId | string): Promise<HydratedDocument<Group>> {
        return GroupModel.findOne({_id: groupId});
    }

    /**
     * Find a group with given groupName as name
     * 
     * @param {Types.ObjectId | string} owner - the owner of the group
     * @param {string} name - the name of the group
     * @returns {Promise<HydratedDocument<Group>>} - the group found
     */
    static async findGroupByName(owner: Types.ObjectId | string, name: string): Promise<HydratedDocument<Group>>{
        return GroupModel.findOne({owner, name});
    }

    /**
     * Delete a group wiht given groupId as _id
     * 
     * @param {Types.ObjectId | string} groupId - the group id 
     * @returns {Promise<boolean>} - true if the group has been deleted, false otherwise
     */
    static async deleteGroup(groupId: Types.ObjectId | string): Promise<boolean> {
        const group = await GroupModel.deleteOne({_id: groupId});
        return group !== null;
    }
    
    /**
     * Add user 'member' to the group as a member
     * 
     * @param {Types.ObjectId | string} groupId - _id of group that is being updated
     * @param {Types.ObjectId | string} member - the user id of the new member
     * @returns {HydratedDocument<Group>} - the updated group
     */
    static async addMember(groupId: Types.ObjectId | string, member: Types.ObjectId | string): Promise<HydratedDocument<Group>>{
        const group = await GroupModel.findOne({_id: groupId});
        group.members.push(member as String);
        await group.save();
        return group;
    }
    
    /**
     * Removes user 'member' from the group
     * 
     * @param {Types.ObjectId | string} groupId - _id of group that is being updated
     * @param {Types.ObjectId | string} member - the user id of the member
     * @returns {HydratedDocument<Group>} - the updated group
     */
    static async removeMember(groupId: Types.ObjectId | string, member: Types.ObjectId | string): Promise<HydratedDocument<Group>>{
        const group = await GroupModel.findOne({_id: groupId});
        const index = group.members.indexOf(member as String, 0);
        if (index > -1) {
            group.members.splice(index, 1);
        }
        await group.save();
        return group;
    }

    /**
     * Change the name of the group
     * 
     * @param {Types.ObjectId | string} groupId - _id of group
     * @param {string} newName -  the new name to be changed
     * @returns {Promise<HydratedDocument<Group>>} - the updated group
     */
    static async changeName(groupId: Types.ObjectId | string, newName: string): Promise<HydratedDocument<Group>>{
        const group = await GroupModel.findOne({_id: groupId});
        group.name = newName;
        await group.save();
        return group;
    }
    
}
export default GroupCollection;