const coordIncrem = 1.01;
const maxCoordVar = 3.00001;
const numOfUsers2Send = 10;


/**
 *
 * @param req
 * @param callback
 */
function matchUsers2Events(req, callback) {
    const interests = req.body.Interests;
    const latitDecUpper = req.body.latdec + maxCoordVar;
    const latitDecLower = req.body.latdec - maxCoordVar;
    const longitDecUpper = req.body.longdec + maxCoordVar;
    const longitDecLower = req.body.longdec - maxCoordVar;
    if (interests.length >= 1) {
        db.collection("Users").find({
            Interests: {$in: interests},
            Active: true,
            longdec: {$gte: (longitDecLower), $lte: (longitDecUpper)},
            latdec: {$gte: (latitDecLower), $lte: (latitDecUpper)},
        }, {
            projection: {
                Interests: true,
                longdec: true,
                latdec: true
            }
        }).toArray((err, result) => {
            if (err) {
                //return console.log(err);
            } else {
                callback(result);
            }
        });
    }
}

/**
 *
 * @param longDec
 * @param latDec
 * @param coordVar
 * @returns {boolean}
 */
function isInRange(longDec, latDec, coordVar) {
    return ((longDec <= longDec + coordVar) && (longDec >= longDec - coordVar) && (latDec <= latDec + coordVar) && (latDec >= latDec - coordVar));
}

/**
 *
 * @param arrayAllUsers
 * @param coordVar
 * @param arrayUsers
 */
function endRecursiveConditions(arrayAllUsers, coordVar, arrayUsers) {
    return arrayUsers.length >= numOfUsers2Send || arrayUsers.length >= arrayAllUsers.length || coordVar >= maxCoordVar;
}

/**
 * Recursive function which finds closest matching users to event location
 * @param arrayAllUsers
 * @param arrayUsers
 * @param coordVar
 */
function sortMatchedUsers(arrayAllUsers, coordVar, arrayUsers) {
    if (endRecursiveConditions(arrayAllUsers, coordVar, arrayUsers)) {
        return arrayUsers;
    } else {
        for (var i = 0; i < arrayAllUsers.length; i++) {
            var longDec = arrayAllUsers[parseInt(i, 10)].longdec;
            var latDec = arrayAllUsers[parseInt(i, 10)].latdec;
            if (isInRange(longDec, latDec, coordVar)) {
                if (!arrayUsers.includes(arrayAllUsers[parseInt(i, 10)])) {
                    arrayUsers.push(arrayAllUsers[parseInt(i, 10)]);
                }
            }
        }
    }
    coordVar = coordVar + coordIncrem;
    return sortMatchedUsers(arrayAllUsers, coordVar, arrayUsers);
}

module.exports = {
    sortMatchedUsers:sortMatchedUsers,
    matchUsers2Events:matchUsers2Events,
    coordIncrem :coordIncrem,
    maxCoordVar:maxCoordVar,
    numOfUsers2Send:numOfUsers2Send
};