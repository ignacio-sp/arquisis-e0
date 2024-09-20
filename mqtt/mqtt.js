//require('dotenv').config();

const mqtt = require('mqtt');
const axios = require('axios');

const host = process.env.HOST;
const port= process.env.PORT;
const username= process.env.USER;
const password= process.env.PASSWORD;

const apiUrl = process.env.API_URL || "http://localhost:3000"

const url = `mqtt://${host}:${port}`

// MQTT configuration
console.log(username)
const options = {
  clean: true,
  connectTimeout: 4000,
  username: 'students',
  password: password,
}

const client  = mqtt.connect(url, options)

subscribeToTopic('fixtures/info');
subscribeToTopic('matchs/info');

client.on('connect', function (connack) {
    console.log('Connected :)')
})

client.on('reconnect', function () {
    console.log('Reconnecting...')
})


client.on('error', function (error) {
    console.log(error)
})

client.on('message', function (topic, payload, packet) {
    const message = payload.toString();
    const jsonMessage = JSON.parse(message);

    console.log("Enviando mensaje a api....., ")
    // console.log(`Topic: ${topic}, Message: ${jsonMessage}, QoS: ${packet.qos}`)

    axios.post(`${apiUrl}/fixtures`, { message: jsonMessage })
        .then(response => {
            console.log(`API response: ${response.status} ${response.data.message}`)
        })
        .catch(error => {
            console.error(`Error: ${error}`)
        });

})

function subscribeToTopic(topic) {
    console.log(`Subscribing to Topic: ${topic}`);
  
    client.subscribe(topic, { qos: 0 });
}
