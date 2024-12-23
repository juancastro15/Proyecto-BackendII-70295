import { usersModel } from "../models/users.model";

export default class UserManager {
  constructor() {
    // console.log("Eureka! users from mongodb");
  }

  getAllUsers(limit) {
    if (limit) {
      return usersModel.find().limit(limit);
    }
    return usersModel.find();
  }

  addUser(user) {
    return usersModel.create({
      ...user,
    });
  }

  getUserByEmail(email) {
    return usersModel.findOne({ email: email });
  }
}