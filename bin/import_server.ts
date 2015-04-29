import tls = require('tls')

const options = {
    key: process.env.IMPORT_SERVER_KEY,
    cert: process.env.IMPORT_SERVER_CERT,
    ca: [process.env.IMPORT_CLIENT_CERT],
    requestCert: true,
    rejectUnauthorized: true
}

let server = tls.createServer(options, function(socket)
{
    console.log('server connected',
        socket.authorized ? 'authorized' : 'unauthorized');
    socket.write("welcome!\n");
    socket.setEncoding('utf8');
    socket.pipe(socket);
})

server.listen(process.env.IMPORT_PORT, function(){
    console.log('server bound');
})
