import { StorageService } from './storage.js';

export class GlobalSearchService {
  static search(query) {
    if (!query || query.trim().length === 0) {
      return {
        students: [],
        resources: [],
        events: [],
        opportunities: [],
        listings: [],
        totalCount: 0
      };
    }

    const q = query.trim().toLowerCase();

    const students = StorageService.get(StorageService.KEYS.STUDENTS, []);
    const resources = StorageService.get(StorageService.KEYS.RESOURCES, []);
    const events = StorageService.get(StorageService.KEYS.EVENTS, []);
    const opportunities = StorageService.get(StorageService.KEYS.OPPORTUNITIES, []);
    const listings = StorageService.get(StorageService.KEYS.LISTINGS, []);

    const matchedStudents = students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.branch.toLowerCase().includes(q) ||
      (s.skills && s.skills.some(sk => sk.toLowerCase().includes(q))) ||
      (s.interests && s.interests.some(int => int.toLowerCase().includes(q)))
    ).slice(0, 4);

    const matchedResources = resources.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedEvents = events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedOpportunities = opportunities.filter(o =>
      o.title.toLowerCase().includes(q) ||
      o.organization.toLowerCase().includes(q) ||
      o.type.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedListings = listings.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q)
    ).slice(0, 4);

    const totalCount =
      matchedStudents.length +
      matchedResources.length +
      matchedEvents.length +
      matchedOpportunities.length +
      matchedListings.length;

    return {
      students: matchedStudents,
      resources: matchedResources,
      events: matchedEvents,
      opportunities: matchedOpportunities,
      listings: matchedListings,
      totalCount
    };
  }
}
