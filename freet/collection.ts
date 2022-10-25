import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import GroupCollection from '../group/collection';


class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @param {Types.ObjectId | undefined} - the froup this was freeted to if any
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, group:Types.ObjectId | undefined): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      group
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId');
  }

  /**
   * Get all the freets in the database that user has access to
   *
   * @param {string} userId - The user's id
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    let freets: Array<HydratedDocument<Freet>> = await FreetModel.find({group:undefined}).populate('authorId');
    const other_freets: Array<HydratedDocument<Freet>> = await FreetModel.find({group :{$ne: undefined }}).populate('authorId');
    for (const f of other_freets){
      const group = await GroupCollection.findGroup(f.group);
      if (group.owner.equals(userId) || group.members.includes(userId as string)){
        freets.push(f);
      }
    }
    return freets;
  }

  /**
   * Get all the freets in by given author that user has access to
   *
   * @param {string} userId - The user's id
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(userId: Types.ObjectId | string, username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    let freets: Array<HydratedDocument<Freet>> = await FreetModel.find({group:undefined, authorId: author._id}).populate('authorId');
    const other_freets: Array<HydratedDocument<Freet>> = await FreetModel.find({group :{$ne: undefined }, authorId: author._id}).populate('authorId');
    for (const f of other_freets){
      const group = await GroupCollection.findGroup(f.group);
      if (group.owner.equals(userId) || group.members.includes(userId as string)){
        freets.push(f);
      }
    }
    return freets;
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.content = content;
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }
}

export default FreetCollection;
