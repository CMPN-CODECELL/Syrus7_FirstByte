import { StorageService } from './storage.js';

const DEMO_USERS = [
  {
    id: "student-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@campus.edu",
    college: "Campus Institute of Technology",
    branch: "Computer Engineering",
    year: "2nd Year",
    bio: "Passionate about full-stack development, Python systems, and AI/ML experiments. Building open-source developer tooling and hackathon projects.",
    skills: ["Python", "Web Development", "AI/ML", "React", "Docker"],
    interests: ["Hackathons", "Competitive Programming", "System Architecture", "Robotics"],
    resourcesCount: 14,
    eventsJoined: 6,
    connectionsCount: 38,
    status: "Active · Open to collab",
    role: "student"
  },
  {
    id: "student-2",
    name: "Ananya Patel",
    email: "ananya.patel@campus.edu",
    college: "Campus Institute of Technology",
    branch: "Design & Interaction Tech",
    year: "3rd Year",
    bio: "Product designer and design systems lead. Passionate about accessibility, Figma components, interaction design, and frontend prototyping.",
    skills: ["UI/UX Design", "Figma", "Design Systems", "Tailwind CSS", "User Research"],
    interests: ["Interaction Design", "Accessibility", "Design Sprints", "Typography"],
    resourcesCount: 9,
    eventsJoined: 11,
    connectionsCount: 52,
    status: "Active · Mentoring 1st years",
    role: "student"
  }
];

export class AuthService {
  static getCurrentUser() {
    let user = StorageService.get(StorageService.KEYS.CURRENT_USER);
    if (!user) {
      // Default to Aarav Sharma for immediate demo experience so judges don't face empty gates
      user = DEMO_USERS[0];
      StorageService.set(StorageService.KEYS.CURRENT_USER, user);
    }
    return user;
  }

  static isLoggedIn() {
    const user = StorageService.get(StorageService.KEYS.CURRENT_USER);
    return Boolean(user && user.email);
  }

  static login(email, password) {
    if (!email || !password) {
      return { success: false, message: "Please provide both email and password." };
    }
    
    // Check against students in storage
    const students = StorageService.get(StorageService.KEYS.STUDENTS, []);
    const matching = students.find(s => s.email.toLowerCase() === email.trim().toLowerCase());

    if (matching) {
      StorageService.set(StorageService.KEYS.CURRENT_USER, matching);
      return { success: true, user: matching };
    }

    // Allow any valid email during hackathon demo
    const newUser = {
      id: "student-" + Date.now(),
      name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      email: email.trim().toLowerCase(),
      college: "Campus Institute of Technology",
      branch: "Computer Science",
      year: "2nd Year",
      bio: "Student explorer at CampusOS.",
      skills: ["Problem Solving", "Web Dev"],
      interests: ["Peer Learning", "Hackathons"],
      resourcesCount: 0,
      eventsJoined: 0,
      connectionsCount: 0,
      status: "Active"
    };

    StorageService.set(StorageService.KEYS.CURRENT_USER, newUser);
    return { success: true, user: newUser };
  }

  static loginAsDemo(userId = "student-1") {
    const demo = DEMO_USERS.find(u => u.id === userId) || DEMO_USERS[0];
    StorageService.set(StorageService.KEYS.CURRENT_USER, demo);
    return demo;
  }

  static signup(data) {
    const { name, email, college, branch, year, password, skills, interests } = data;
    if (!name || !email || !college || !branch || !year || !password) {
      return { success: false, message: "All required fields must be completed." };
    }

    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    const newUser = {
      id: "student-" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      college: college.trim(),
      branch: branch.trim(),
      year: year.trim(),
      bio: "Excited to connect, learn, and collaborate on CampusOS!",
      skills: skills && skills.length ? skills : ["Problem Solving", "Collaboration"],
      interests: interests && interests.length ? interests : ["Peer Learning", "Tech Projects"],
      resourcesCount: 0,
      eventsJoined: 0,
      connectionsCount: 0,
      status: "New Student Member",
      role: "student"
    };

    // Save to students directory
    const students = StorageService.get(StorageService.KEYS.STUDENTS, []);
    students.unshift(newUser);
    StorageService.set(StorageService.KEYS.STUDENTS, students);

    // Set as current user
    StorageService.set(StorageService.KEYS.CURRENT_USER, newUser);
    return { success: true, user: newUser };
  }

  static updateProfile(updatedData) {
    const currentUser = this.getCurrentUser();
    const updated = { ...currentUser, ...updatedData };
    StorageService.set(StorageService.KEYS.CURRENT_USER, updated);

    // Update in students directory list as well
    const students = StorageService.get(StorageService.KEYS.STUDENTS, []);
    const idx = students.findIndex(s => s.id === updated.id);
    if (idx !== -1) {
      students[idx] = updated;
      StorageService.set(StorageService.KEYS.STUDENTS, students);
    }
    return updated;
  }

  static logout() {
    localStorage.removeItem(StorageService.KEYS.CURRENT_USER);
    window.location.href = "login.html";
  }

  static requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  }
}
