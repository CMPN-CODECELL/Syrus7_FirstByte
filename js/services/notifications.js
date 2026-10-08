import { StorageService } from './storage.js';

export class NotificationService {
  static getAll() {
    return StorageService.get(StorageService.KEYS.NOTIFICATIONS, []);
  }

  static getUnreadCount() {
    const list = this.getAll();
    return list.filter(n => !n.read).length;
  }

  static markAsRead(id) {
    const list = this.getAll();
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      StorageService.set(StorageService.KEYS.NOTIFICATIONS, list);
    }
  }

  static markAllAsRead() {
    const list = this.getAll();
    list.forEach(n => { n.read = true; });
    StorageService.set(StorageService.KEYS.NOTIFICATIONS, list);
  }

  static clearAll() {
    StorageService.set(StorageService.KEYS.NOTIFICATIONS, []);
  }

  static addNotification({ type = "general", title, message, link = "#" }) {
    const list = this.getAll();
    const newNotif = {
      id: "notif-" + Date.now(),
      type,
      title,
      message,
      timestamp: Date.now(),
      timeAgo: "Just now",
      read: false,
      link
    };
    list.unshift(newNotif);
    StorageService.set(StorageService.KEYS.NOTIFICATIONS, list);
    return newNotif;
  }
}
