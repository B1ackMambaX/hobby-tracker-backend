export default class UserDto {
    name;
    email;
    id;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.name = model.name;
    }
}