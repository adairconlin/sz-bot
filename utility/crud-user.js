const { User } = require("../schemas");

/*
* Check if user exists
* If user exists, return user object
* If user does not exist, create user in database and return user object
*/
const addToDatabase = async (interaction, currentUser, int) => {
    const findUser = await User.find({ discordId: currentUser.id});
    let user;
    if(!int) {
        int = 0;
    }

    if(!findUser?.length) {
        console.log("user was not found, and int is: " + int);
        const newUser = {
            username: currentUser.username,
            discordId: currentUser.id,
            pointsAmt: 3 + int,
            pointsAvail: 3 + int
        };

        await new User(newUser).save()
            .then(() => {
                user = true;
                interaction.channel.send(`Welcome to the Lemon Art Database, <@${currentUser.id}>! Here's 3 Points <3`);
            })
            .catch(err => { 
                user = null;
                console.log(err);
            });

    } else {
        if(int == 0) {
            console.log("user was found, and int is 0")
            user = findUser;
        } else {
            // give user specified points after verifying that they exist
            console.log("user was found, and int is: " + int);
            await User.updateOne( { discordId: currentUser.id },
                {
                    $inc: {
                        pointsAmt: int,
                        pointsAvail: int
                    }
                }
            )
        .then(() => { user = true; })
        .catch(err => { console.log(err); user = false; });
        }
    }

    return user;
}

module.exports = { addToDatabase };