import { initialStudents } from '../../data/students.js';
import { initialResources } from '../../data/resources.js';
import { initialEvents } from '../../data/events.js';
import { initialOpportunities } from '../../data/opportunities.js';
import { initialListings } from '../../data/listings.js';
import { initialSkills } from '../../data/skills.js';
import { initialPosts } from '../../data/posts.js';

const STORAGE_KEYS = {
  STUDENTS: 'campusos_students',
  RESOURCES: 'campusos_resources',
  EVENTS: 'campusos_events',
  OPPORTUNITIES: 'campusos_opportunities',
  LISTINGS: 'campusos_listings',
  SKILLS: 'campusos_skills',
  POSTS: 'campusos_posts',
  CURRENT_USER: 'campusos_current_user',
  CONNECTIONS: 'campusos_connections', // map of studentId -> 'connected' | 'requested'
  SAVED_ITEMS: 'campusos_saved_items', // array of { id, type }
  NOTIFICATIONS: 'campusos_notifications',
  THEME: 'campusos_theme',
};

const initialNotifications = [
  {
    id: "notif-1",
    type: "connection",
    title: "New Connection Request",
    message: "Sneha Mukherjee (Computer Engg, 1st Year) sent you a connection request.",
    timestamp: Date.now() - 35 * 60 * 1000,
    timeAgo: "35 mins ago",
    read: false,
    link: "students.html"
  },
  {
    id: "notif-2",
    type: "event",
    title: "Event Registration Confirmed",
    message: "You are registered for Syrus 7.0 Hackathon — Campus Edition! Venue: Innovation Lab.",
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    timeAgo: "3 hours ago",
    read: false,
    link: "events.html"
  },
  {
    id: "notif-3",
    type: "resource",
    title: "Resource Upvoted",
    message: "Your 'Data Structures & Algorithms Comprehensive Notes' received 12 new upvotes.",
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    timeAgo: "8 hours ago",
    read: true,
    link: "learn.html"
  },
  {
    id: "notif-4",
    type: "skill",
    title: "Skill Exchange Inquiry",
    message: "Rohan Verma wants to exchange Python assistance for Arduino sensor guidance.",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    timeAgo: "1 day ago",
    read: true,
    link: "skills.html"
  }
];

export class StorageService {
  static init() {
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      this.set(STORAGE_KEYS.STUDENTS, initialStudents);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
      this.set(STORAGE_KEYS.RESOURCES, initialResources);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      this.set(STORAGE_KEYS.EVENTS, initialEvents);
    }
    if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
      this.set(STORAGE_KEYS.OPPORTUNITIES, initialOpportunities);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
      this.set(STORAGE_KEYS.LISTINGS, initialListings);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SKILLS)) {
      this.set(STORAGE_KEYS.SKILLS, initialSkills);
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      this.set(STORAGE_KEYS.POSTS, initialPosts);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      this.set(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONNECTIONS)) {
      this.set(STORAGE_KEYS.CONNECTIONS, {
        "student-2": "connected",
        "student-4": "connected",
        "student-3": "requested"
      });
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_ITEMS)) {
      this.set(STORAGE_KEYS.SAVED_ITEMS, ["res-1", "opp-1", "list-1", "post-3"]);
    }
  }

  static get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn("Storage error reading " + key, e);
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('campusos_storage_change', { detail: { key, value } }));
    } catch (e) {
      console.warn("Storage error writing " + key, e);
    }
  }

  static resetToDefaults() {
    localStorage.clear();
    this.init();
    window.location.reload();
  }

  static get KEYS() {
    return STORAGE_KEYS;
  }
}

// Run auto-init on load
StorageService.init();
