export default class FullNameDTO {
    constructor(user) {
      this.fullname = (user.firstName || "") + " " + (user.lastName || "");
    }
  }