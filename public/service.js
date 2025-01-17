// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray

}

const saveSubscription = async subscription => {

  const SERVER_URL = 'http://127.0.0.1:4000/save-subscription'
  const response = await fetch(SERVER_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  })
  return response.json()
}


self.addEventListener('activate', async () => {
  console.log('Activated')
  // This will be called only once when the service worker is installed for first time.
  try {
    const applicationServerKey = urlB64ToUint8Array(
      'BMQ5kS-7WnoDfz4y0AGycNtL3L8rzdzaHYZSDls6U0AlKiRwoAApT5o_DKkypLMrtgLDghr3avOxdjkTehstf4s'
    )
    const options = {
      applicationServerKey,
      userVisibleOnly: true
    }
    const subscription = await self.registration.pushManager.subscribe(options)
    const response = await saveSubscription(subscription)
    console.log(JSON.stringify(subscription))
  } catch (err) {
    console.log('Error', err)
  }
})

self.addEventListener('push', function (event) {
  if (event.data) {
    console.log('Push event!! ', event.data.text())
    console.log(event.data.json);
    showLocalNotification('PH COVID-19 Tracker', event.data.text(), self.registration)
  } else {
    console.log('Push event but no data')
  }
})

const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body,actions: [
      {
        action: 'coffee-action',
        title: 'Coffee',
        icon: 'https://vignette.wikia.nocookie.net/fairytail/images/c/c3/Erza%27s_picture.png/revision/latest?cb=20190929085837'
      },
      {
        action: 'doughnut-action',
        title: 'Doughnut'
      },
      {
        action: 'gramophone-action',
        title: 'gramophone'
      },
      {
        action: 'atom-action',
        title: 'Atom'
      }
    ]
  };
  swRegistration.showNotification(title, options)
}


self.addEventListener('notificationclick', function(event) {
  if (!event.action) {
    // Was a normal notification click
    event.preventDefault(); // prevent the browser from focusing the Notification's tab
window.open('http://www.mozilla.org', '_blank');
    console.log('Notification Click.');
    return;
  }

  switch (event.action) {
    case 'coffee-action':
      console.log('User ❤️️\'s coffee.');
      event.notification.close();
event.waitUntil(
  clients.openWindow('https://google.com/')
);
      break;
    case 'doughnut-action':
      console.log('User ❤️️\'s doughnuts.');
      break;
    case 'gramophone-action':
      console.log('User ❤️️\'s music.');
      break;
    case 'atom-action':
      console.log('User ❤️️\'s science.');
      break;
    default:
      console.log(`Unknown action clicked: '${event.action}'`);
      break;
  }
});