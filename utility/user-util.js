const { User } = require("../schemas");

/*
* Returns a User object to be viewed or modified.
* If user does not exist, create a user. Then return that new User object.
*/
const getUser = async (user) => {
    const userObj = await User.find({discordId: user.id});
    if(!userObj.length) {
        return createUser(user);
    } else {
        return userObj;
    }
}

/*
* Creates User and returns User object.
*/
const createUser = async (user) => {
    let userArr = [];
    const newUser = {
        username: user.username,
        discordId: user.id,
        pointsAmt: 0,
        pointsAvail: 0
    };

    await new User(newUser).save()
        .then(createdUser => {
            userArr.push(createdUser);
        })
        .catch(err => { 
            console.log(err);
        });
    
    return userArr;
}

module.exports = { getUser };