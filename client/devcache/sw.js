/*
  Service Worker for ISF Blood Donor
  - Handles push events and notification clicks
  - Uses Notification API to display messages
*/

self.addEventListener('install', (event) => {
    // Activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Take control of uncontrolled clients
    event.waitUntil(self.clients.claim());
});

// Display push notifications
self.addEventListener('push', (event) => {
    let data = {};
    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        try {
            data = { title: 'ISF Notification', body: event.data.text() };
        } catch (_) {
            data = { title: 'ISF Notification', body: 'You have a new update.' };
        }
    }

    const title = data.title || 'ISF Notification';
    const options = {
        body: data.body || 'You have a new update.',
        icon: '/assets/icons/icon-192.png',
        badge: '/assets/icons/icon-72.png',
        data: data.url ? { url: data.url } : {},
        vibrate: [200, 100, 200],
        actions: data.actions || [],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification?.data?.url || '/';
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    client.focus();
                    if (url && client.url !== url) client.navigate(url);
                    return;
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })
    );
});