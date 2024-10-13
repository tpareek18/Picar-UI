var server_port = 65432;
var server_addr = "192.168.50.181";

const forwardBtn = document.getElementById("Forward");
const backwardBtn = document.getElementById("Backward");
const leftBtn = document.getElementById("Left");
const rightBtn = document.getElementById("Right");
const stopBtn = document.getElementById("Stop");

function send_message_to_car(message) {
    const net = require('net');
    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        // 'connect' listener.
        console.log('connected to server!');
        // send the message
        client.write(`${message}`);
    });

    client.on('data', (message_from_car) => {
        message_from_car = message_from_car.toString();
        console.log("Message received from car: " + message_from_car);

        if ((message_from_car == "True") || (message_from_car == "False")) {
            document.getElementById("is_moving").innerHTML = message_from_car;
        } else if (!isNaN(parseFloat(message_from_car))) {
            document.getElementById("ultrasonic_distance").innerHTML = message_from_car;
        }
    });
}

// const net = require('net');
// const permaclient = net.createConnection({ port: server_port, host: server_addr }, () => {
//     // 'connect' listener.
//     console.log('connected to server!');
// });

// // get the data from the server
// permaclient.on('data', (message_from_car) => {
//     if(message_from_car.startsWith("is_moving: ")) {
//         new_value = message_from_car.split(" ")[1] // true or false
//         document.getElementById("is_moving").innerHTML = new_value;
//     }
//     else if(message_from_car.startsWith("ultrasonic: ")) {
//         new_value = message_from_car.split(" ")[1] // stringified float
//         document.getElementById("ultrasonic_data").innerHTML = new_value;
//     }
// });

// function client() {
//     const net = require('net');
//     var input = document.getElementById("myName").value;

//     const client = net.createConnection({ port: server_port, host: server_addr }, () => {
//         // 'connect' listener.
//         console.log('connected to server!');
//         // send the message
//         client.write(`${input}\r\n`);
//     });
    
//     // get the data from the server
//     client.on('ultrasonic_data', (ultrasonic_data) => {
//         document.getElementById("ultrasonic_distance").innerHTML = ultrasonic_data;
//         console.log(ultrasonic_data.toString());
//         client.end();
//         client.destroy();
//     });

//     client.on('is_moving_data', (is_moving_data) => {
//         document.getElementById("is_moving_data").innerHTML = is_moving_data;
//         console.log(is_moving_data.toString());
//         client.end();
//         client.destroy();
//     });

//     client.on('end', () => {
//         console.log('disconnected from server');
//     });
// }

// function greeting() {
//     var name = document.getElementById("myName").value;
//     document.getElementById("greet").innerHTML = "Hello " + name + " !";
//     // to_server(name);
//     client();
// }