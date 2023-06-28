const User = require("../../../backend/endpoints/users/UserModel");
const UserSchema = require("../../../backend/endpoints/users/UserModel");
const runDB = require("../../../backend/utils/db")
const {getUser,createUser, updateUser,deleteUser} = require("../../../backend/endpoints/users/UserService")

beforeEach(async ()=>{await runDB()});

test("UserModel test 1", async()=>{
    
    await createUser({email:"juri@hdahf.de",password:"afafaf",firstName:"Juri",lastName:"Rehfeld",birthdate:22,isAdministrator:true});
    const user = await createUser({email:"juri2@hdahf.de",password:"afafaf",firstName:"dad",lastName:"add",birthdate:22,isAdministrator:true});
    await updateUser({id:user.id,email: "updatetEmail",firstName:"updatedName"});
})
