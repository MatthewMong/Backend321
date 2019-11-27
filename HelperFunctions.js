const coordIncrem = 1.01;
const maxCoordVar = 4.001;
const numOfUsers2Send = 10;


/**
 *
 * @param longDec: longDec of event
 * @param testlongDec: longDec of User to test if it is in range of event
 * @param latDec: latDec of event
 * @param testlatDec: latDec of User to test if it is in range of event
 * @param coordVar: allowable variablitity in long/latDec
 * @returns {boolean}
 */
function isInRange(longDec, testlongDec, latDec,testlatDec, coordVar) {
    return ((testlongDec <= longDec + coordVar) && (testlongDec >= longDec - coordVar) && (testlatDec <= latDec + coordVar) && (testlatDec >= latDec - coordVar));
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
function sortMatchedUsers(arrayAllUsers, coordVar, arrayUsers, longDec, latDec) {
    if (endRecursiveConditions(arrayAllUsers, coordVar, arrayUsers, numOfUsers2Send)) {
        return arrayUsers;
    } else {
        for (var i = 0; i < arrayAllUsers.length; i++) {
            var testlongDec = arrayAllUsers[parseInt(i, 10)].longdec;
            var testlatDec = arrayAllUsers[parseInt(i, 10)].latdec;
            if (isInRange(longDec, testlongDec, latDec, testlatDec, coordVar)) {
                if (!arrayUsers.includes(arrayAllUsers[parseInt(i, 10)])) {
                    arrayUsers.push(arrayAllUsers[parseInt(i, 10)]);
                }
            }
        }
    }
    coordVar = coordVar + coordIncrem;
    return sortMatchedUsers(arrayAllUsers, coordVar, arrayUsers, longDec, latDec);
}

module.exports = {
    sortMatchedUsers:sortMatchedUsers,
    matchUsers2Events:matchUsers2Events,
    coordIncrem :coordIncrem,
    maxCoordVar:maxCoordVar,
    numOfUsers2Send:numOfUsers2Send
};
