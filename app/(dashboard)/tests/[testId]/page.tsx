import TestClient from "./TestClient";
import DsaSetupClient from "./DsaSetupClient";

export default async function TestPage({ params }: { params: { testId: string } }) {
  // Awaiting the params is required in Next 15+ 
  const resolvedParams = await params;
  
  if (resolvedParams.testId === "dsa") {
    return <DsaSetupClient testId="dsa" />;
  }

  // Dummy data based on category
  const getTestData = (id: string) => {
    switch(id) {
      case "core":
        return {
          title: "Core CS Mock Test",
          questions: [
            { q: "What does ACID stand for in DBMS?", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Consistency, Integrity, Durability", "Atomicity, Concurrency, Integrity, Data", "None of the above"], correct: 0 },
            { q: "Which protocol operates at the Transport Layer?", options: ["IP", "HTTP", "TCP", "Ethernet"], correct: 2 },
            { q: "What is a Deadlock?", options: ["Process execution error", "A state where processes wait for each other infinitely", "Memory leak", "Hardware failure"], correct: 1 },
          ]
        };
      default:
        return {
          title: "General Aptitude Test",
          questions: [
            { q: "If A can do work in 10 days and B in 15 days, together they take?", options: ["5 days", "6 days", "12 days", "8 days"], correct: 1 },
            { q: "What is the probability of getting a sum of 7 with two dice?", options: ["1/6", "1/12", "1/3", "1/2"], correct: 0 },
            { q: "Find the odd one out: 3, 5, 11, 14, 17, 21", options: ["21", "17", "14", "3"], correct: 2 },
          ]
        };
    }
  };

  const testData = getTestData(resolvedParams.testId);

  return <TestClient testId={resolvedParams.testId} testData={testData} />;
}
