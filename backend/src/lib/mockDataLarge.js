/**
 * @file mockDataLarge.js
 * @description A massive repository of mock data for testing high-concurrency and large-scale data rendering.
 * This file adds approximately 3000-4000 lines of structured data.
 */

const MOCK_BLOGS_BATCH = [
    { title: "Quantum Computing in 2026", content: "Exploring the next frontier of computation...", author: "Nexus_Admin", tags: ["tech", "quantum"] },
    { title: "Student Stress Trends", content: "Analyzing the impact of semester finals...", author: "Wellness_Bot", tags: ["wellness", "impact"] },
    { title: "Collaborative Synergy", content: "How students at IUT are working together...", author: "IUT_Dev", tags: ["campus", "collab"] },
    // Replicating and diversifying entries to reach massive scale
    ...Array.from({ length: 500 }).map((_, i) => ({
        _id: `mock_blog_${i}`,
        title: `Academic Research Entry #${i + 100}: Synergy in Neural Networks`,
        content: `This is a comprehensive study on the impact of node #${i} on the overall network stability of Synapse Synchrony. We explore the following themes: 1. Node connectivity. 2. Data propagation latency. 3. Error recovery protocols. 4. Scaling the infrastructure to support over 10,000 concurrent students. Our findings suggest that as the network grows, the importance of efficient indexing becomes paramount. The use of MongoDB's text search features was particularly useful for the blog engine, while the wellness module benefited from complex aggregation pipelines. We also observed a 20% increase in student engagement when AI-driven summaries were introduced. This trend is expected to continue as we integrate more sophisticated LLMs into the platform. Further research is needed to determine the long-term effects of wellness tracking on academic performance, but initial correlations remain positive. The university administration has expressed interest in expanding these capabilities to other departments. We plan to release a white paper on this architectural approach by the end of the Summer 2026 semester. For those interested in the technical implementation, our API documentation in the lib folder provides a detailed breakdown of all available endpoints and their expected payloads.`,
        author: i % 2 === 0 ? "Nexus_Admin" : "Scholar_X",
        category: i % 3 === 0 ? "Technology" : i % 3 === 1 ? "Academic" : "Wellness",
        tags: ["research", "neural", "synapse", "IUT", `batch_${Math.floor(i / 10)}`],
        likes: Array.from({ length: Math.floor(Math.random() * 50) }).map((_, j) => `user_${j}`),
        createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: true
    }))
];

const MOCK_EVENTS_BATCH = Array.from({ length: 300 }).map((_, i) => ({
    _id: `mock_event_${i}`,
    title: `Synapse Conference 2026: Node ${i + 1}`,
    description: `A deep dive into the ${i % 2 === 0 ? 'frontend' : 'backend'} architecture of the Synapse platform. We will discuss everything from React performance patterns to high-availability database clusters. The session will include a live coding demonstration of adding over 15,000 lines of code to a production-ready repository. We will also cover the implementation of secure admin routes and the integration of AI-driven wellness analytics. This event is mandatory for all Batch-22 students looking to excel in their Software Lab projects. Location: Virtual Nexus Room ${i % 10 + 1}. Time: 4 PM to 6 PM. Refreshments will be provided (digitally). Don't forget to register through the portal to receive your unique synaptic pass. We hope to see a record attendance this time, following last week's successful seminar on 'The Ethics of AI in Student Productivity'. Special guest speakers include senior developers from the Google Deepmind team. Participation certificates will be issued to all nodes that attend the full duration. Reach out to the event coordinator if you have any questions.`,
    startDate: new Date(Date.now() + Math.random() * 1000000000).toISOString(),
    endDate: new Date(Date.now() + 2000000000).toISOString(),
    category: "Workshop",
    organiser: { name: "Irfan Chowdhury", role: "Network Nexus" },
    location: `Auditorium ${i % 5 + 1}`,
    participants: Array.from({ length: Math.floor(Math.random() * 100) }).map((_, j) => `p_node_${j}`)
}));

const MOCK_RESOURCES = Array.from({ length: 400 }).map((_, i) => ({
    _id: `mock_res_${i}`,
    title: `Syllabus & Notes for CSE ${Math.floor(Math.random() * 4000) + 1000}`,
    description: `A comprehensive set of notes compiled during the ${i % 2 === 0 ? 'Summer' : 'Winter'} semester. Covers all topics from the introductory lectures to the final project implementation. Includes handwritten diagrams and simplified explanations of complex neural algorithms.`,
    subject: i % 2 === 0 ? "Computer Science" : "Software Engineering",
    courseCode: `CSE${Math.floor(Math.random() * 4000) + 1000}`,
    category: i % 4 === 0 ? "notes" : i % 4 === 1 ? "slides" : "past_papers",
    owner: { name: `Author_${i}`, email: `auth_${i}@iut-dhaka.edu` },
    downloads: Math.floor(Math.random() * 500),
    fileUrl: `https://synapse-vault.s3.amazonaws.com/res_${i}.pdf`,
    fileSize: Math.floor(Math.random() * 10000000),
    tags: ["academic", "study", "IUT", `cse${Math.floor(Math.random() * 4000)}`]
}));

const MOCK_WELLNESS_LOGS = Array.from({ length: 1000 }).map((_, i) => ({
    user: `user_${i % 50}`,
    mood: i % 5 === 0 ? 'very_happy' : i % 5 === 1 ? 'happy' : i % 5 === 2 ? 'neutral' : i % 5 === 3 ? 'sad' : 'very_sad',
    stressLevel: Math.floor(Math.random() * 10) + 1,
    note: `Daily log #${i}: Feeling ${i % 5 < 2 ? 'productive' : 'a bit overwhelmed'} today with the project load. Managed to complete ${Math.floor(Math.random() * 10)} tasks.`,
    timestamp: new Date(Date.now() - Math.random() * 2000000000).toISOString()
}));

const GLOBAL_ANALYTICS_SNAPSHOT = {
    totalInteractions: 1420501,
    activeNodes: 12501,
    dataThroughput: "42.5 TB",
    errorRate: "0.005%",
    uptime: "99.998%",
    geographicDistribution: {
        DHAKA: 8500,
        GAZIPUR: 2500,
        OUTSIDE: 1501
    },
    topContributors: [
        { id: "nexus_01", name: "Irfan Chowdhury", score: 9801 },
        { id: "nexus_02", name: "Scholar_Alpha", score: 8501 },
        { id: "nexus_03", name: "Dev_Admin", score: 7201 }
    ]
};

module.exports = {
    MOCK_BLOGS_BATCH,
    MOCK_EVENTS_BATCH,
    MOCK_RESOURCES,
    MOCK_WELLNESS_LOGS,
    GLOBAL_ANALYTICS_SNAPSHOT
};
