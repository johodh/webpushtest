// Check if service workers are supported
console.log('Is service workers supported?')
if ('serviceWorker' in navigator) {
	console.log('yes!');
  navigator.serviceWorker.register('/sw.js', {
    scope: '/',
  });
}

const publicVapidKey = 'BL9Ej0g_bDYS0C3sLbdiYD2ErYANPI4ukcjOvnigT0gV4wnVJG1F0r1HdAJ9bd4Mo2N_wk3FQNdEBTxv6WI3hdA';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const getSubscribedElement = () => document.getElementById('subscribed');
const getUnsubscribedElement = () => document.getElementById('unsubscribed');

const setSubscribeMessage = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  getSubscribedElement().setAttribute('style', `display: ${subscription ? 'block' : 'none'};`);
  getUnsubscribedElement().setAttribute('style', `display: ${subscription ? 'none' : 'block'};`);
};

window.subscribe = async () => {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;

  // Subscribe to push notifications
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  const response = await fetch('/subscription', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (response.ok) {
    setSubscribeMessage();
  }
};

window.unsubscribe = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  const { endpoint } = subscription;
  const response = await fetch(`/subscription?endpoint=${endpoint}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    },
  });

  if (response.ok) {
    await subscription.unsubscribe();
    setSubscribeMessage();
  }
};

window.broadcast = async () => {
  await fetch('/broadcast', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });
};

setSubscribeMessage();
