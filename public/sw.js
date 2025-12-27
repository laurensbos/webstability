// Service Worker for Push Notifications
// Webstability - Project Status Updates

const CACHE_NAME = 'webstability-v1'

// Install event
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...')
  event.waitUntil(self.clients.claim())
})

// Push event - when a push notification is received
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received:', event)
  
  let data = {
    title: 'Webstability',
    body: 'Je hebt een nieuwe update!',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'webstability-notification',
    data: {}
  }
  
  if (event.data) {
    try {
      const payload = event.data.json()
      data = { ...data, ...payload }
    } catch (e) {
      data.body = event.data.text()
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon || '/favicon.svg',
    badge: data.badge || '/favicon.svg',
    tag: data.tag || 'webstability-notification',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: data.actions || [
      { action: 'open', title: 'Bekijken' },
      { action: 'dismiss', title: 'Later' }
    ],
    requireInteraction: data.requireInteraction || false
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked:', event)
  
  event.notification.close()
  
  const data = event.notification.data || {}
  let targetUrl = '/'
  
  // Determine where to navigate based on notification type
  if (data.projectId) {
    targetUrl = `/status/${data.projectId}`
  } else if (data.url) {
    targetUrl = data.url
  }
  
  // Handle action buttons
  if (event.action === 'dismiss') {
    return // Just close the notification
  }
  
  // Open or focus the app
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(targetUrl)
            return client.focus()
          }
        }
        // If no window is open, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl)
        }
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Sync event:', event.tag)
  
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages())
  }
})

async function syncMessages() {
  // Sync any pending messages when back online
  console.log('[ServiceWorker] Syncing messages...')
}

// Message event - communication with the main app
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
