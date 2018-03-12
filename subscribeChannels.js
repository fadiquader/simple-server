
var sockets = []

function subscribeChannels(client) {
    sockets.push(client.id)
    console.log('client.id: ',  client.id)
    // console.log('sockets: ', sockets)
    setInterval(function () {
        client.emit('updateTime', { time: Date.now()})
    }, 1000);

    client.on('disconnect', function () {
        const index = sockets.indexOf(client.id);
        sockets.splice(index, 1);
        console.log('client disconnect...', client.id)
    })


    client.on('error', function (err) {
        console.log('received error from client:', client.id)
        console.log(err)
    })
}

module.exports = subscribeChannels;