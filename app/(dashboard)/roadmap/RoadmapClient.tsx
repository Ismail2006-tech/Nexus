"use client";

import { useState } from "react";
import styles from "./roadmap.module.css";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

type TopicProgress = {
  topicId: string;
  completed: boolean;
};

export default function RoadmapClient({ 
  initialData, 
  initialProgress 
}: { 
  initialData: any[],
  initialProgress: TopicProgress[]
}) {
  const router = useRouter();
  const [progress, setProgress] = useState<Record<string, boolean>>(() => {
    const acc: Record<string, boolean> = {};
    initialProgress.forEach(p => {
      acc[p.topicId] = p.completed;
    });
    return acc;
  });

  const toggleTopic = async (topicId: string, topicName: string, stage: number) => {
    const isCompleted = !progress[topicId];
    
    // Optimistic update
    setProgress(prev => ({ ...prev, [topicId]: isCompleted }));

    try {
      await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          topicName,
          stage,
          completed: isCompleted
        }),
      });
      router.refresh(); // Refresh the page to update server components like Header/Sidebar if needed
    } catch (err) {
      // Revert on error
      setProgress(prev => ({ ...prev, [topicId]: !isCompleted }));
      console.error("Failed to update progress", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Placement Roadmap</h1>
        <p className={styles.subtitle}>Your structured path to becoming placement ready.</p>
      </div>

      <div className={styles.roadmapContainer}>
        {initialData.map((stageItem) => {
          const completedTopicsInStage = stageItem.topics.filter((t: any) => progress[t.id]).length;
          const totalTopicsInStage = stageItem.topics.length;
          const isStageCompleted = completedTopicsInStage === totalTopicsInStage;
          const isStageActive = completedTopicsInStage > 0 && !isStageCompleted;

          return (
            <div key={stageItem.stage} className={`card ${styles.stageCard}`}>
              <div 
                className={`${styles.stageMarker} ${isStageCompleted ? styles.completed : ''} ${isStageActive ? styles.active : ''}`}
              >
                {isStageCompleted ? <Check size={14} /> : <span style={{fontSize:'0.8rem'}}>{stageItem.stage}</span>}
              </div>

              <div className={styles.stageHeader}>
                <div>
                  <h2 className={styles.stageTitle}>Stage {stageItem.stage}: {stageItem.title}</h2>
                </div>
                <div className={styles.stageProgress}>
                  {completedTopicsInStage} / {totalTopicsInStage} completed
                </div>
              </div>

              <div className={styles.topicsGrid}>
                {stageItem.topics.map((topic: any) => (
                  <div 
                    key={topic.id}
                    className={`${styles.topicItem} ${progress[topic.id] ? styles.completed : ''}`}
                    onClick={() => toggleTopic(topic.id, topic.name, stageItem.stage)}
                  >
                    <div className={styles.checkIcon}>
                      <Check size={16} />
                    </div>
                    <span className={styles.topicName}>{topic.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
