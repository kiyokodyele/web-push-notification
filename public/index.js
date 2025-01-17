const check = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error('No Service Worker support!')
    }
    if (!('PushManager' in window)) {
        throw new Error('No Push API Support!')
    }
}
const registerServiceWorker = async () => {
    const swRegistration = await navigator.serviceWorker.register('service.js')
    return swRegistration
}
const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission()
    if (permission !== 'granted') {
        return false
    } else {
        return true
    }
}
const main = async () => {
    check()
    const permission = await requestNotificationPermission()
    if (permission) {
        const swRegistration = await registerServiceWorker()
    }
}
// main(); we will not call main in the beginning.