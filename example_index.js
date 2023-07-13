//exact copy of full example code from (https://medium.com/izettle-engineering/beginners-guide-to-web-push-notifications-using-service-workers-cb3474a17679)
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 4000
app.get('/', (req, res) => res.send('Hello World!'))
const dummyDb = { subscription: null } //dummy in memory store
const saveToDatabase = async subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription
}
// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
  const subscription = req.body
  await saveToDatabase(subscription) //Method to save the subscription to Database
  res.json({ message: 'success' })
})
// const vapidKeys = {
//   publicKey:
//     'BH_O_LgJDgJaUqDZYoVaCA9njw0wHpmRbVr4nSUHoCTVBe0S9L3qQ2lc2FUl7hnjijzLAOao30zC2RbPFoL_lPA',
//   privateKey: 'TujGnDRKBOFpqiu7LngL8pf16Tn76ipft4hg9sw3770',
// }
const vapidKeys = webpush.generateVAPIDKeys()

//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:purwanto1337@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
  webpush.sendNotification(subscription, dataToSend)
}

//route to test send notification
app.get('/send-notification', (req, res) => {

  if (req.query.interval) {
    const interval = +req.query.interval // i.e. 120.000 // send every 2 minute
    setInterval(() => {
      const subscription = dummyDb.subscription //get subscription from your databse here.
      const message = 'Hello World'
      sendNotification(subscription, message)
      console.log('=>> sending message from interval ', interval)
      res.json({})
    }, interval)
    return
  }

  const subscription = dummyDb.subscription //get subscription from your databse here.
  const message = 'Hello World'
  sendNotification(subscription, message)
  console.log('=>> sending message once')
  res.json({ message: 'message sent' })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
