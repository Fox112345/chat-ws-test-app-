const generateMsg = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
};

const generateLocationMsg = (location) => {
    return {
        url: location,
        createdAt: new Date().getTime()
    }
};


module.exports = {
    generateMsg,
    generateLocationMsg
};