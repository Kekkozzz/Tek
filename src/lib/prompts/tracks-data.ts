import type { TechTrack } from "@/types";

// ══════════════════════════════════════════════════
// Track-specific data for AI prompt generation
// ══════════════════════════════════════════════════

export interface TrackPromptData {
    /** Role description for the interviewer prompt */
    roleDescription: string;
    /** Valid topic names for report evaluation, grouped by category */
    topics: Record<string, string[]>;
    /** Evaluation criteria specific to this track */
    evaluationCriteria: string[];
}

export const TRACK_PROMPT_DATA: Record<TechTrack, TrackPromptData> = {
    frontend: {
        roleDescription: "Frontend Developer",
        topics: {
            React: ["Hooks", "State Management", "Component Patterns", "Performance", "Context API", "Server Components"],
            JavaScript: ["Closures", "Promises & Async", "Prototypes", "ES6+", "Event Loop", "Type Coercion"],
            "Next.js": ["App Router", "Server Actions", "Middleware", "SSR/SSG/ISR", "API Routes", "Caching"],
            TypeScript: ["Generics", "Type Guards", "Utility Types", "Interfaces vs Types", "Mapped Types", "Decorators"],
            CSS: ["Flexbox", "Grid", "Responsive Design", "Animations", "Tailwind", "CSS-in-JS"],
            Testing: ["Unit Testing", "React Testing Library", "E2E (Playwright)", "Mocking", "Test Patterns"],
            Angular: ["Components", "Services & DI", "RxJS", "Routing", "Forms", "Change Detection"],
            Vue: ["Composition API", "Reactivity", "Vuex/Pinia", "Vue Router", "Directives", "Lifecycle"],
        },
        evaluationCriteria: [
            "Correttezza tecnica delle risposte",
            "Qualità del codice: leggibilità, best practices, performance",
            "Capacità di ragionamento e problem solving",
            "Chiarezza nella comunicazione",
            "Conoscenza del framework/libreria scelto",
            "Comprensione dei pattern frontend moderni",
        ],
    },

    backend: {
        roleDescription: "Backend Developer",
        topics: {
            "Java/Spring": ["Spring Boot", "JPA/Hibernate", "Dependency Injection", "REST API", "Security", "Testing"],
            "Node.js": ["Express/Fastify", "Event Loop", "Streams", "Middleware", "Error Handling", "Clustering"],
            "Python/Django": ["Django ORM", "Views & URLs", "Middleware", "REST Framework", "Celery", "Testing"],
            "C#/.NET": ["ASP.NET Core", "Entity Framework", "Dependency Injection", "LINQ", "Middleware", "Testing"],
            Go: ["Goroutines", "Channels", "Interfaces", "HTTP Server", "Error Handling", "Concurrency"],
            "API Design": ["REST", "GraphQL", "gRPC", "WebSocket", "Versioning", "Documentation"],
            Database: ["SQL", "Indexing", "Transactions", "ORM Patterns", "Migration", "Query Optimization"],
            Architecture: ["Microservizi", "Event-Driven", "CQRS", "Clean Architecture", "Design Patterns", "SOLID"],
        },
        evaluationCriteria: [
            "Correttezza tecnica delle risposte",
            "Qualità del codice: struttura, error handling, security",
            "Comprensione dell'architettura backend",
            "Capacità di progettare API scalabili",
            "Conoscenza dei pattern di persistenza dati",
            "Gestione della concorrenza e performance",
        ],
    },

    mobile: {
        roleDescription: "Mobile Developer",
        topics: {
            "Swift/iOS": ["UIKit", "SwiftUI", "Core Data", "Networking", "Concurrency", "App Lifecycle"],
            "Kotlin/Android": ["Activity/Fragment", "Jetpack Compose", "ViewModel", "Room", "Coroutines", "Navigation"],
            Flutter: ["Widgets", "State Management", "Navigation", "Platform Channels", "Animations", "Testing"],
            "React Native": ["Components", "Navigation", "Native Modules", "Performance", "State Management", "Bridges"],
            General: ["App Architecture", "Offline-First", "Push Notifications", "App Store Guidelines", "CI/CD Mobile", "Testing"],
        },
        evaluationCriteria: [
            "Correttezza tecnica delle risposte",
            "Conoscenza del ciclo di vita dell'app",
            "Gestione dello stato e della navigazione",
            "Performance e ottimizzazione mobile",
            "Comprensione delle guideline della piattaforma",
            "Capacità di gestire scenari offline",
        ],
    },

    devops: {
        roleDescription: "DevOps / Cloud Engineer",
        topics: {
            Docker: ["Dockerfile", "Multi-stage Build", "Volumes", "Networking", "Docker Compose", "Best Practices"],
            Kubernetes: ["Pods", "Services", "Deployments", "ConfigMaps/Secrets", "Ingress", "Helm"],
            AWS: ["EC2", "S3", "Lambda", "RDS", "IAM", "CloudFormation"],
            Terraform: ["Providers", "Modules", "State Management", "Variables", "Outputs", "Best Practices"],
            "CI/CD": ["Pipeline Design", "GitHub Actions", "Testing in CI", "Deployment Strategies", "Rollback", "Monitoring"],
            Linux: ["File System", "Processi", "Networking", "Scripting", "Permissions", "Systemd"],
        },
        evaluationCriteria: [
            "Comprensione dell'infrastruttura cloud",
            "Capacità di progettare pipeline CI/CD",
            "Conoscenza della containerizzazione",
            "Gestione della sicurezza e degli accessi",
            "Comprensione del monitoring e logging",
            "Capacità di automatizzare processi",
        ],
    },

    "data-ml": {
        roleDescription: "Data Engineer / ML Engineer",
        topics: {
            Python: ["NumPy", "Pandas", "Scikit-learn", "Data Cleaning", "Feature Engineering", "Visualization"],
            "Machine Learning": ["Supervised Learning", "Unsupervised Learning", "Neural Networks", "Model Evaluation", "Overfitting", "Cross-Validation"],
            "Deep Learning": ["CNN", "RNN/LSTM", "Transformers", "Transfer Learning", "GANs", "Optimization"],
            SQL: ["Query Optimization", "Window Functions", "CTEs", "Joins Avanzati", "Subqueries", "Indexing"],
            "Big Data": ["Apache Spark", "MapReduce", "Data Pipelines", "Streaming", "Partitioning", "Data Lake"],
            Statistics: ["Probabilità", "Distribuzioni", "Hypothesis Testing", "Regressione", "Bayesian", "A/B Testing"],
        },
        evaluationCriteria: [
            "Correttezza tecnica delle risposte",
            "Capacità di manipolare e analizzare dati",
            "Comprensione degli algoritmi di ML",
            "Conoscenza delle best practices di data engineering",
            "Capacità di ottimizzare query e pipeline",
            "Chiarezza nella spiegazione dei risultati",
        ],
    },

    database: {
        roleDescription: "Database Engineer / DBA",
        topics: {
            SQL: ["SELECT Avanzate", "Joins", "Subqueries", "Window Functions", "CTEs", "Stored Procedures"],
            "Database Design": ["Normalizzazione", "ER Diagrams", "Indexing", "Partitioning", "Sharding", "Replication"],
            PostgreSQL: ["JSONB", "Full-Text Search", "Extensions", "MVCC", "Vacuum", "Performance Tuning"],
            MongoDB: ["Aggregation Pipeline", "Schema Design", "Indexing", "Replica Sets", "Sharding", "Transactions"],
            Redis: ["Data Types", "Persistence", "Pub/Sub", "Caching Patterns", "Clustering", "Lua Scripting"],
            "Teoria DB": ["ACID", "CAP Theorem", "Isolation Levels", "Deadlock", "Query Planner", "B-Tree"],
        },
        evaluationCriteria: [
            "Correttezza delle query e dell'approccio",
            "Comprensione della normalizzazione e del design",
            "Capacità di ottimizzare le performance",
            "Conoscenza delle strategie di scaling",
            "Gestione della consistenza e delle transazioni",
            "Scelta appropriata della tecnologia",
        ],
    },

    cybersecurity: {
        roleDescription: "Cybersecurity Specialist",
        topics: {
            "Web Security": ["OWASP Top 10", "XSS", "SQL Injection", "CSRF", "Authentication", "Authorization"],
            Networking: ["TCP/IP", "DNS", "Firewall", "VPN", "TLS/SSL", "Protocolli"],
            "Linux Security": ["Permissions", "SELinux", "IPTables", "SSH", "Audit Logging", "Hardening"],
            Cryptography: ["Hashing", "Encryption", "Digital Signatures", "PKI", "Key Management", "TLS"],
            "Penetration Testing": ["Reconnaissance", "Vulnerability Scanning", "Exploitation", "Privilege Escalation", "Reporting", "Tools"],
            "Incident Response": ["Detection", "Containment", "Eradication", "Recovery", "Forensics", "SIEM"],
        },
        evaluationCriteria: [
            "Comprensione delle vulnerabilità comuni",
            "Capacità di identificare e mitigare rischi",
            "Conoscenza dei protocolli di sicurezza",
            "Approccio alla difesa in profondità",
            "Comprensione della crittografia",
            "Capacità di analisi degli incidenti",
        ],
    },

    dsa: {
        roleDescription: "Software Engineer (Algoritmi & Strutture Dati)",
        topics: {
            "Strutture Dati": ["Array", "Linked List", "Stack & Queue", "Hash Map", "Tree", "Graph", "Heap"],
            Algoritmi: ["Sorting", "Searching", "Recursion", "Divide & Conquer", "Greedy", "Backtracking"],
            "Dynamic Programming": ["Memoization", "Tabulation", "Subset Problems", "String DP", "Knapsack", "LCS/LIS"],
            Grafi: ["BFS", "DFS", "Dijkstra", "Topological Sort", "Minimum Spanning Tree", "Union-Find"],
            "Complessità": ["Big O", "Time Complexity", "Space Complexity", "Amortized Analysis", "Trade-offs"],
            "Problem Solving": ["Two Pointers", "Sliding Window", "Binary Search", "Prefix Sum", "Monotonic Stack", "Bit Manipulation"],
        },
        evaluationCriteria: [
            "Correttezza della soluzione",
            "Analisi della complessità temporale e spaziale",
            "Qualità del codice e leggibilità",
            "Approccio al problem solving",
            "Gestione dei casi limite",
            "Capacità di ottimizzare la soluzione",
        ],
    },

    "system-design": {
        roleDescription: "System Architect / Senior Engineer",
        topics: {
            Scalabilità: ["Load Balancing", "Horizontal Scaling", "Caching", "CDN", "Database Scaling", "Partitioning"],
            "Distributed Systems": ["CAP Theorem", "Consistency Models", "Consensus", "Replication", "Fault Tolerance", "Event Sourcing"],
            "Messaging": ["Message Queues", "Pub/Sub", "Kafka", "RabbitMQ", "Event-Driven", "CQRS"],
            "Data Storage": ["SQL vs NoSQL", "Data Modeling", "Indexing", "Sharding", "Replication", "Data Lake"],
            "API Design": ["REST", "GraphQL", "gRPC", "WebSocket", "Rate Limiting", "API Gateway"],
            Infrastructure: ["Cloud Architecture", "Microservizi", "Serverless", "Container Orchestration", "Service Mesh", "Monitoring"],
        },
        evaluationCriteria: [
            "Capacità di identificare i requisiti del sistema",
            "Comprensione dei trade-off architetturali",
            "Conoscenza dei pattern di scalabilità",
            "Capacità di stimare capacità e performance",
            "Gestione della consistenza e affidabilità",
            "Chiarezza nella comunicazione del design",
        ],
    },

    "low-level": {
        roleDescription: "Systems Programmer / Low-Level Developer",
        topics: {
            C: ["Pointers", "Memory Management", "Structs", "File I/O", "Preprocessor", "Linking"],
            "C++": ["OOP", "Templates", "STL", "Smart Pointers", "Move Semantics", "RAII"],
            Rust: ["Ownership", "Borrowing", "Lifetimes", "Traits", "Enums & Pattern Matching", "Concurrency"],
            "Sistemi Operativi": ["Processi", "Thread", "Scheduling", "Virtual Memory", "File System", "Syscalls"],
            "Architettura HW": ["CPU Pipeline", "Cache", "Memory Hierarchy", "I/O", "Instruction Set", "Interrupts"],
            Networking: ["Socket Programming", "TCP/UDP", "HTTP", "DNS", "Protocolli", "Concurrency Models"],
        },
        evaluationCriteria: [
            "Comprensione della gestione della memoria",
            "Correttezza e sicurezza del codice",
            "Conoscenza dell'architettura dei sistemi",
            "Capacità di ragionare a basso livello",
            "Gestione della concorrenza",
            "Performance e ottimizzazione",
        ],
    },
};
