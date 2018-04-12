var canvas = document.getElementById('main_canvas');
var ctx = canvas.getContext('2d');
var rect = canvas.getBoundingClientRect();
var downFlag = 0;
var drawTick;
var coordStack = [];

var randomColor = function() {
    return '#' + (function co(lor){   return (lor +=
        [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
    && (lor.length == 6) ?  lor : co(lor); })('');
};

var fillStyle = randomColor();

var draw = function(posX, posY, color) {
    ctx.fillStyle = color || fillStyle;
    ctx.beginPath();
    ctx.arc(posX, posY, 5, 0, 2 * Math.PI);
    ctx.fill();
};

socket.on('userDataList', function(users) {

    var onlineUsersWrapper = document.getElementById('online_users');
    var currentUserName = document.getElementById('user_name_value').innerText;
    var newUserChild;

    onlineUsersWrapper.innerHTML = '';

    for (var i in users) {

        if (!users[i].name)
            continue;

        newUserChild = document.createElement('li');
        newUserChild.innerHTML = users[i].name + (users[i].name == currentUserName ? ' <strong>(you)</strong>' : '') + '<span class="user-color" style="background-color: ' + users[i].color + ';"></span>';
        onlineUsersWrapper.append(newUserChild);

    }

});

socket.on('drawData', function(data) {

    data.forEach(function(i) {
        draw(i.x, i.y, i.color);
    });

});

var nameForm = document.getElementById('set_name_form');

nameForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var name = document.getElementById('set_name_input').value;
    socket.emit('setUserData', {
        name: name,
        color: fillStyle
    });
    document.getElementById('user_name_value').innerText = name;
    document.getElementById('user_name_wrapper').style.visibility = 'visible';
    canvas.style.visibility = 'visible';
});

var drawInterval = function(e) {
    var posX = e.pageX - rect.left;
    var posY = e.pageY - rect.top;
    draw(posX, posY);
    // coordStack.push({x: posX, y: posY});
    socket.emit('drawData', [{x: posX, y: posY, color: fillStyle}]);
};

var drawMoveInterval = function(e) {

    if (downFlag) {
        drawTick = setTimeout(drawInterval.bind(null, e), 0);
    }

};

var drawStop = function(e) {
    downFlag = 0;
    clearTimeout(drawTick);
    // socket.emit('drawData', coordStack);
    coordStack = [];
};

canvas.addEventListener('mousedown', function(e) {
    downFlag = 1;
    drawInterval(e);
});

canvas.addEventListener('mousemove', drawMoveInterval);
canvas.addEventListener('mouseup', drawStop);