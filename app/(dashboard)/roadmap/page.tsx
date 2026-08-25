import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import RoadmapClient from "./RoadmapClient";

export const metadata = {
  title: "Placement Roadmap | NEXUS",
};

const ROADMAP_DATA = [
  {
    stage: 1,
    title: "Fundamentals",
    topics: [
      { id: "f1", name: "Programming Basics" },
      { id: "f2", name: "OOP Concepts" },
      { id: "f3", name: "Basic Problem Solving" },
      { id: "f4", name: "Time Complexity" },
    ],
  },
  {
    stage: 2,
    title: "Data Structures & Algorithms",
    topics: [
      { id: "dsa1", name: "Arrays & Strings" },
      { id: "dsa2", name: "Linked Lists" },
      { id: "dsa3", name: "Stacks & Queues" },
      { id: "dsa4", name: "Trees & BST" },
      { id: "dsa5", name: "Graphs" },
      { id: "dsa6", name: "Sorting & Searching" },
      { id: "dsa7", name: "Dynamic Programming" },
      { id: "dsa8", name: "Greedy Algorithms" },
    ],
  },
  {
    stage: 3,
    title: "Core CS Subjects",
    topics: [
      { id: "cs1", name: "DBMS Concepts" },
      { id: "cs2", name: "SQL Queries" },
      { id: "cs3", name: "Operating Systems" },
      { id: "cs4", name: "Computer Networks" },
      { id: "cs5", name: "System Design Basics" },
    ],
  },
  {
    stage: 4,
    title: "Aptitude & Reasoning",
    topics: [
      { id: "apt1", name: "Quantitative Aptitude" },
      { id: "apt2", name: "Logical Reasoning" },
      { id: "apt3", name: "Verbal Ability" },
      { id: "apt4", name: "Data Interpretation" },
    ],
  },
  {
    stage: 5,
    title: "Interview Preparation",
    topics: [
      { id: "int1", name: "Technical Interviews" },
      { id: "int2", name: "HR Interviews" },
      { id: "int3", name: "Communication Skills" },
      { id: "int4", name: "Resume Building" },
      { id: "int5", name: "Portfolio & Projects" },
    ],
  },
  {
    stage: 6,
    title: "Placement Ready",
    topics: [
      { id: "pr1", name: "Company Specific Prep" },
      { id: "pr2", name: "Mock Interviews" },
      { id: "pr3", name: "Offer Negotiation" },
    ],
  },
];

export default async function RoadmapPage() {
  const session = await auth();
  
  if (!session?.user?.id) return null;

  const progress = await db.topicProgress.findMany({
    where: { userId: session.user.id },
  });

  return (
    <RoadmapClient initialData={ROADMAP_DATA} initialProgress={progress} />
  );
}
