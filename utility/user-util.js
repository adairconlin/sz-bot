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
    console.log("creating user...");
    let userArr = [];
    const newUser = {
        username: user.username,
        discordId: user.id,
        pointsAmt: 3,
        pointsAvail: 3
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

/*
* Check if user exists
* If user exists, return user object
* If user does not exist, create user in database and return user object
*/
const addToDatabase = async (interaction, currentUser, int) => {
    const findUser = await User.find({ discordId: currentUser.id});
    let user;

    if(!findUser?.length) {
        if(!int) {
            int = 0;
        }

        const newUser = {
            username: currentUser.username,
            discordId: currentUser.id,
            pointsAmt: 3 + int,
            pointsAvail: 3 + int
        };

        await new User(newUser).save()
            .then(createdUser => {
                user = createdUser;
                interaction.channel.send(`Welcome to the Lemon Art Database, <@${currentUser.id}>! Here's 3 Points <3`);
            })
            .catch(err => { 
                user = null;
                console.log(err);
            });

    } else {
        user = findUser;
    }

    return user;
}

module.exports = { getUser, addToDatabase };