const users = [];

const addUser = ({id, username, room}) => {
    username = username.trim().toLocaleLowerCase();
    room = room.trim().toLocaleLowerCase();

    if (!username || !room) return { error: 'User Name and room are required' };

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    });

    if (existingUser) return { error: "User already exist"};

    const user = { id, username, room };
    users.push(user);

    return { user }

};

const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id );

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
};

const getUser = (id) => users.find(user => user.id === id);

const getUsersInRoom = (room) => users.filter( user => user.room === room );

module.exports = {
    addUser,
    removeUser,
    getUsersInRoom,
    getUser
};
