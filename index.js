const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push')
const app = express()
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())
const port = 4000

//app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.static('public'))

var dummyDb = []; //dummy in memory store

const saveToDatabase = async subscription => {
    // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
    // Here you should be writing your db logic to save it.
    dummyDb.push( {'subscription': subscription} )
    //console.log(dummyDb);
}

// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
    const subscription = req.body
    await saveToDatabase(subscription) //Method to save the subscription to Database
    res.json({
        message: 'success'
    })
    
})

const vapidKeys = {
    publicKey: process.env.PUBLIC_VAPID_KEY,
    privateKey: process.env.PRIVATE_VAPID_KEY,
}

//setting our previously generated VAPID keys
webpush.setVapidDetails(
    'mailto:kiyokodyele@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
    webpush.sendNotification(subscription, dataToSend)
  }

//route to test send notification
app.get('/send-notification', (req, res) => {
    const subscription = dummyDb //get subscription from your databse here.
    const message = req.query.m
    console.log(req.query.m)
    //console.log(subscription)
    //subscription.forEach( sendNotificationLog(subscription, message) )
    //console.log(subscription[0])
    for (let i=0; i<subscription.length; i++) {
        sendNotification(subscription[i].subscription, message)
    }
    res.json({
        message: 'message sent'
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))