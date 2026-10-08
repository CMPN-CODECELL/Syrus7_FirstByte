export const initialPosts = [
  {
    id: "post-1",
    authorName: "Aarav Sharma",
    authorBranch: "Computer Engineering, 2nd Year",
    type: "Achievement",
    timeAgo: "2 hours ago",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    content: "Thrilled to share that our team 'FirstByte' just submitted our prototype for Syrus 7.0 Hackathon (Problem Statement 04 — CampusOS)! 🚀 Huge shoutout to my teammates for pulling off this peer exchange and learning ecosystem. Let us know your feedback on the Connect & Skill Exchange modules!",
    tags: ["Syrus7", "FirstByte", "CampusOS", "Hackathon"],
    likes: 42,
    isLiked: false,
    isSaved: false,
    comments: [
      {
        id: "c-1",
        author: "Ananya Patel",
        text: "The UI looks super crisp! Loved how the resource sharing and skill exchange are organized.",
        timeAgo: "1 hour ago"
      },
      {
        id: "c-2",
        author: "Rohan Verma",
        text: "Kudos team FirstByte! Best of luck for the finals presentation! 🔥",
        timeAgo: "35 mins ago"
      }
    ]
  },
  {
    id: "post-2",
    authorName: "Priya Nair",
    authorBranch: "Data Science & AI, 4th Year",
    type: "Question",
    timeAgo: "4 hours ago",
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    content: "Question for anyone studying for end-sem Operating Systems: How are you approaching virtual memory and inverted page tables? I find Tanenbaum's explanation a bit dense compared to Peterson's notes. Anyone down for a group discussion in Library Hall 2 tomorrow at 4 PM?",
    tags: ["OperatingSystems", "StudyGroup", "LibraryMeet"],
    likes: 19,
    isLiked: false,
    isSaved: false,
    comments: [
      {
        id: "c-3",
        author: "Devansh Gupta",
        text: "Count me in! I also uploaded a 1-page cheatsheet in the Learn section that breaks down TLB miss vs Page fault step-by-step.",
        timeAgo: "3 hours ago"
      }
    ]
  },
  {
    id: "post-3",
    authorName: "Ananya Patel",
    authorBranch: "Design & Interaction Tech, 3rd Year",
    type: "Resource",
    timeAgo: "7 hours ago",
    timestamp: Date.now() - 7 * 60 * 60 * 1000,
    content: "Just uploaded a complete Figma Campus Design System UI Kit with accessible color tokens, WCAG AA contrasts, and student card components into the Learn tab. Free for all student club leads and project teams building portfolio apps!",
    tags: ["DesignSystem", "Figma", "UIUX", "FreeResource"],
    likes: 67,
    isLiked: false,
    isSaved: true,
    comments: [
      {
        id: "c-4",
        author: "Sneha Mukherjee",
        text: "This is a lifesaver for our project documentation presentation. Thank you Ananya!",
        timeAgo: "5 hours ago"
      }
    ]
  },
  {
    id: "post-4",
    authorName: "Rohan Verma",
    authorBranch: "Electronics & Communication, 3rd Year",
    type: "Opportunity",
    timeAgo: "12 hours ago",
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
    content: "The Campus Robotics Club is looking for 2 software recruits to help with telemetry streaming and ROS 2 nodes for the inter-college rover challenge. If you know Python, C++, or React for mission dashboards, check out the Opportunities section or message me directly!",
    tags: ["Robotics", "Recruitment", "ROS2", "Engineering"],
    likes: 31,
    isLiked: false,
    isSaved: false,
    comments: []
  },
  {
    id: "post-5",
    authorName: "Devansh Gupta",
    authorBranch: "Information Technology, 3rd Year",
    type: "Discussion",
    timeAgo: "1 day ago",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    content: "Hot take: Learning Git branches and clean commit hygiene in 1st year is 10x more important than cramming complex graph algorithms right away. The number of merge conflict disasters during 2nd year group projects is unbelievable. Thoughts?",
    tags: ["Git", "BestPractices", "StudentLife", "WebDev"],
    likes: 88,
    isLiked: false,
    isSaved: false,
    comments: [
      {
        id: "c-5",
        author: "Aarav Sharma",
        text: "100% agreed. Nothing hurts more than git push --force wiping someone's 3-day effort an hour before hackathon deadline.",
        timeAgo: "18 hours ago"
      },
      {
        id: "c-6",
        author: "Kabir Mehta",
        text: "Same applies to CAD versioning. 'final_v2_final_FINAL.sldprt' is a nightmare haha.",
        timeAgo: "16 hours ago"
      }
    ]
  }
];
