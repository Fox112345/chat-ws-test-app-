const socket = io();


//Elements
const $msgForm = document.querySelector('#msg-form');
const $msgFormInput = document.querySelector('#input');
const $msgFormBtn = $msgForm.querySelector('#sbmitBtn');
const $locationBtn = document.querySelector('#local');
const $msgs = document.querySelector('#msgs');

//Templates
const $msgsTemplate = document.querySelector('#message-template').innerHTML;
const $locationTemplate = document.querySelector('#location-template').innerHTML;
const $usersTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true });
const autoscroll = () => {
    //new message el
    const $newMessage = $msgs.lastElementChild;


    //height the new msg
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHight = $newMessage.offsetHeight + newMessageMargin;


    //visible hight
    const visibleHeight = $msgs.offsetHeight;

    //height msgs container
    const containerHeight = $msgs.scrollHeight;

    //how far have i scroll
    const scrollOffset = $msgs.scrollTop + visibleHeight;

    if (containerHeight - newMessageHight <= scrollOffset) {
        $msgs.scrollTop = $msgs.scrollHeight
    }

    console.log(newMessageMargin)
};

socket.on('contentUpdate', (message) => {
    const html = Mustache.render($msgsTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("ddd, hA")
    });
    $msgs.insertAdjacentHTML('beforeend', html);
    autoscroll()
});

socket.on('locationMsg', (location) => {
    const html = Mustache.render($locationTemplate, {
        username: location.username,
        location: location.url,
        createdAt: moment(location.createdAt).format("ddd, hA")
    });
    $msgs.insertAdjacentHTML('beforeend', html);
    autoscroll()
});

$msgForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $msgFormBtn.setAttribute('disabled', 'disabled' );

    socket.emit('msg', $msgFormInput.value, (msg)=>{
        $msgFormBtn.removeAttribute('disabled');
        $msgFormInput.value = '';
        $msgFormInput.focus();

        console.log(msg)
    })
});

$locationBtn.addEventListener('click', ()=>{

    $locationBtn.setAttribute('disabled', 'disabled');

    if(!navigator.geolocation) return socket.emit('msg', 'geo unavailable');
    navigator.geolocation.getCurrentPosition((location)=>{
        socket.emit(
            'sendLocation',
            {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude
            },
            () => {
                $locationBtn.removeAttribute('disabled');
            })
    })
});


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/'
    }
});

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render($usersTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
    autoscroll()

});



