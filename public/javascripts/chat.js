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

socket.on('contentUpdate', (message) => {
    const html = Mustache.render($msgsTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("ddd, hA")
    });
    $msgs.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMsg', (location) => {
    const html = Mustache.render($locationTemplate, {
        location: location.url,
        createdAt: moment(location.createdAt).format("ddd, hA")
    });
    $msgs.insertAdjacentHTML('beforeend', html);
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





