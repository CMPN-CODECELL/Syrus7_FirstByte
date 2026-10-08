export const initialResources = [
  {
    id: "res-1",
    title: "Data Structures & Algorithms Comprehensive Notes",
    subject: "Data Structures (CS-201)",
    category: "notes",
    uploadedBy: "Aarav Sharma",
    uploaderBranch: "Computer Engineering, 2nd Year",
    description: "Detailed handwritten & typed notes covering Trees, Balanced BSTs (AVL, Red-Black), Graphs (BFS, DFS, Dijkstra, Bellman-Ford), and Dynamic Programming patterns with step-by-step space-time complexity analysis.",
    type: "PDF",
    date: "Oct 2, 2026",
    downloads: 342,
    upvotes: 89,
    fileSize: "8.4 MB",
    downloadFileName: "DSA_Comprehensive_Notes_CS201.pdf",
    contentPreview: `# Data Structures & Algorithms — Quick Reference Summary
## 1. Graph Algorithms Master Sheet
* Breadth-First Search (BFS): Time O(V + E), Space O(V) - Shortest path in unweighted graphs.
* Dijkstra's Algorithm: Time O((V + E) log V) with min-heap priority queue. Note: Non-negative edge weights only.
* Floyd-Warshall: Time O(V^3), Space O(V^2) - All pairs shortest paths.
* Bellman-Ford: Detects negative weight cycles in O(V * E).

## 2. Dynamic Programming 5-Step Framework
1. Define the subproblem in plain English (e.g. dp[i][w] = max value using items 1..i and capacity w).
2. Write recurrence relation state transition.
3. Identify base cases and memoization bounds.
4. Determine computation order (bottom-up tabular vs top-down recursive with memo table).
5. Optimize space complexity from O(N*W) to O(W) using rolling array.`
  },
  {
    id: "res-2",
    title: "Operating Systems End-Term Previous Year Questions (2022-2025)",
    subject: "Operating Systems (CS-302)",
    category: "pyq",
    uploadedBy: "Priya Nair",
    uploaderBranch: "Data Science & AI, 4th Year",
    description: "Complete solved university end-semester examination papers from 2022 to 2025 with step-by-step solutions for Banker's Algorithm, Page Replacement (LRU, FIFO, Optimal), and Semaphore synchronization problems.",
    type: "PDF",
    date: "Sep 28, 2026",
    downloads: 512,
    upvotes: 142,
    fileSize: "5.1 MB",
    downloadFileName: "OS_PYQ_Solved_2022_2025.pdf",
    contentPreview: `# Operating Systems Solved Past Papers (2022–2025)
## Question 1: Banker's Deadlock Avoidance Algorithm
Given: 5 processes (P0-P4) and 3 resource types (A:10, B:5, C:7).
Step 1: Compute Need Matrix = Max - Allocation.
Step 2: Safe Sequence Verification:
Work vector initialized to Available = [3, 3, 2].
- P1 executes (Need <= Work): New Work = [5, 3, 2]
- P3 executes: New Work = [7, 4, 3]
- P4 executes: New Work = [7, 4, 5]
- P0 executes: New Work = [7, 5, 5]
- P2 executes: New Work = [10, 5, 7]
Result: Safe sequence exists: <P1, P3, P4, P0, P2>. No deadlock risk.`
  },
  {
    id: "res-3",
    title: "Computer Networks Protocol Architecture Cheatsheet",
    subject: "Computer Networks (IT-304)",
    category: "cheatsheet",
    uploadedBy: "Devansh Gupta",
    uploaderBranch: "Information Technology, 3rd Year",
    description: "One-page visual summary of OSI and TCP/IP 5-layer models, subnetting calculations (CIDR masks, network/broadcast IDs), TCP 3-way handshake, congestion control (Reno/Cubic), and DNS resolution flow.",
    type: "PDF",
    date: "Sep 24, 2026",
    downloads: 280,
    upvotes: 74,
    fileSize: "2.3 MB",
    downloadFileName: "Computer_Networks_Cheatsheet.pdf",
    contentPreview: `# Computer Networks Protocol Quick Reference
* Layer 7 (Application): HTTP/1.1 (pipelining), HTTP/2 (multiplexing), HTTP/3 (QUIC/UDP), DNS (port 53).
* Layer 4 (Transport): TCP (reliable, connection-oriented, flow & congestion control) vs UDP (datagram, low latency).
* TCP Handshake: SYN -> SYN-ACK -> ACK. Termination: FIN -> ACK -> FIN -> ACK.
* Subnetting Formula: Host bits = 32 - prefix. Usable hosts = 2^(32-prefix) - 2.`
  },
  {
    id: "res-4",
    title: "Engineering Mechanics: Statics & Dynamics Solved Problems",
    subject: "Applied Mechanics (ME-102)",
    category: "notes",
    uploadedBy: "Kabir Mehta",
    uploaderBranch: "Mechanical Engineering, 2nd Year",
    description: "Illustrated guide to free-body diagrams (FBD), truss analysis using Method of Joints & Method of Sections, friction on inclined planes, and moments of inertia with centroid calculations.",
    type: "PDF",
    date: "Sep 19, 2026",
    downloads: 198,
    upvotes: 46,
    fileSize: "6.8 MB",
    downloadFileName: "Engg_Mechanics_Statics_Notes.pdf",
    contentPreview: `# Engineering Mechanics: Statics Summary
## Method of Joints for Trusses
1. Verify determinant stability: m = 2j - 3 (where m=members, j=joints).
2. Solve entire support reactions using static equilibrium: sum Fx = 0, sum Fy = 0, sum M = 0.
3. Select a joint with no more than two unknown member forces.
4. Draw isolated FBD with forces pointing away from joint (assumed tension).
5. Positive sign indicates Tension; negative indicates Compression.`
  },
  {
    id: "res-5",
    title: "Full-Stack Web Development Starter Kit & Boilerplates",
    subject: "Web Technologies (CS-205)",
    category: "code",
    uploadedBy: "Aarav Sharma",
    uploaderBranch: "Computer Engineering, 2nd Year",
    description: "Modular production-ready starter templates for building web apps: includes clean vanilla JS patterns, REST API clients, localStorage persistence wrappers, and Tailwind CSS utilities.",
    type: "ZIP",
    date: "Sep 15, 2026",
    downloads: 410,
    upvotes: 115,
    fileSize: "3.2 MB",
    downloadFileName: "FullStack_Starter_Kit_CampusOS.zip",
    contentPreview: `// Reusable Storage Service snippet
export class LocalStorageService {
  static get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}`
  },
  {
    id: "res-6",
    title: "Machine Learning Mathematical Foundations: Linear Algebra & Probability",
    subject: "Mathematics for ML (AI-202)",
    category: "guide",
    uploadedBy: "Priya Nair",
    uploaderBranch: "Data Science & AI, 4th Year",
    description: "Intuitive proofs and geometric interpretations for Eigenvalues, Eigenvectors, Singular Value Decomposition (SVD), Principal Component Analysis (PCA), Gradient Descent calculus, and Bayes theorem.",
    type: "PDF",
    date: "Sep 10, 2026",
    downloads: 365,
    upvotes: 98,
    fileSize: "7.1 MB",
    downloadFileName: "Math_Foundations_for_ML.pdf",
    contentPreview: `# Mathematical Foundations of Machine Learning
## 1. Singular Value Decomposition (SVD)
Every real m x n matrix A can be factored as:
A = U * Sigma * V^T
- U (m x m): Orthogonal eigenvectors of A * A^T (left singular vectors)
- Sigma (m x n): Diagonal matrix containing singular values (square roots of eigenvalues)
- V^T (n x n): Transposed orthogonal eigenvectors of A^T * A (right singular vectors)
Application in PCA: Dimensionality reduction by truncating lowest singular values.`
  },
  {
    id: "res-7",
    title: "Microcontrollers & Embedded Systems Lab Manual & Code",
    subject: "Embedded Systems (EC-303)",
    category: "code",
    uploadedBy: "Rohan Verma",
    uploaderBranch: "Electronics & Communication, 3rd Year",
    description: "C/C++ programs and Proteus simulation files for Timer interrupts, PWM motor control, UART communication, I2C OLED display driver, and ADC sensor calibration on ATmega328P.",
    type: "ZIP",
    date: "Sep 05, 2026",
    downloads: 175,
    upvotes: 41,
    fileSize: "4.5 MB",
    downloadFileName: "Embedded_Lab_Manual_Code.zip",
    contentPreview: `// Timer0 Fast PWM Configuration on ATmega328P
#include <avr/io.h>

void pwm_init() {
    // Set Fast PWM mode with non-inverting output on OC0A (Pin 6)
    TCCR0A |= (1 << WGM01) | (1 << WGM00) | (1 << COM0A1);
    // Prescaler 64
    TCCR0B |= (1 << CS01) | (1 << CS00);
    DDRD |= (1 << DDD6); // Set PD6 as output
}

void set_duty_cycle(uint8_t duty) {
    OCR0A = duty; // 0 to 255
}`
  },
  {
    id: "res-8",
    title: "Database Management Systems (DBMS) SQL & Normalization Guide",
    subject: "Database Systems (CS-204)",
    category: "cheatsheet",
    uploadedBy: "Sneha Mukherjee",
    uploaderBranch: "Computer Engineering, 1st Year",
    description: "Complete cheat sheet for 1NF, 2NF, 3NF, BCNF decomposition, relational algebra operators, ACID transaction isolation levels, indexing (B+ Trees), and complex SQL join queries.",
    type: "PDF",
    date: "Sep 01, 2026",
    downloads: 295,
    upvotes: 68,
    fileSize: "3.7 MB",
    downloadFileName: "DBMS_SQL_Normalization_Guide.pdf",
    contentPreview: `# DBMS Normalization Cheat Sheet
- 1NF: Atomic values only. No repeating groups or nested arrays.
- 2NF: In 1NF + No partial dependencies (every non-prime attribute is fully functionally dependent on the entire primary key).
- 3NF: In 2NF + No transitive dependencies (no non-prime attribute depends on another non-prime attribute: X -> Y where X is not a superkey).
- BCNF: For every functional dependency X -> A, X must be a superkey.`
  }
];
