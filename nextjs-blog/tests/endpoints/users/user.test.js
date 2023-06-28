const UserSchema = require("../../../backend/endpoints/users/userModel")
const {updateEvent} = require("../../../backend/endpoints/events/eventService");
const runDB = require("../../../backend/utils/db")
test("UserModel test 1", async () => {
  const juri = await new UserSchema({ email: "juri@rehfeldweb.de", password: "hallo1234", firstName: "Juri", lastName: "Rehfeld", birthdate: 22, isAdministrator: true });
  await juri.save();
  const getjuri = await User.findById(juri.id);
  expect(juri.firstName).toBe(getjuri.firstName);
})

beforeEach(async ()=>{await runDB()});
test("updateEvent",async()=> {
  const event = await updateEvent({
    id : "6466305ba8afc939196a6a9b",
    maxPaxEvent: 1550,
    date: "2022-05-11T20:00:00.000Z",
    attendees: ["646605e1c69d7f7957e704aa","646605e1c69d7f7957e704aa"]
}
)
})