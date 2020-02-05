const generateMsg = (username,text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
};

const generateLocationMsg = (username, location) => {
    return {
        username,
        url: location,
        createdAt: new Date().getTime()
    }
};


module.exports = {
    generateMsg,
    generateLocationMsg
};