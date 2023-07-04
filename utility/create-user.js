const { User } = require("../schemas");

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

module.exports = { addToDatabase };