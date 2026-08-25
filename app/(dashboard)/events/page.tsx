import { db } from "@/lib/db";
import styles from "./events.module.css";
import { Calendar, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Placement Events | NEXUS",
};

export default async function EventsPage() {
  const events = await db.placementEvent.findMany({
    orderBy: { eventDate: 'asc' },
  });

  // Fallback demo data if DB is empty
  const displayEvents = events.length > 0 ? events : [
    {
      id: "evt1",
      companyName: "Google",
      eventType: "Online Assessment",
      eventDate: new Date("2026-08-25T10:00:00Z"),
      location: "Online",
      registrationStatus: "Open",
    },
    {
      id: "evt2",
      companyName: "Microsoft",
      eventType: "Pre-Placement Talk",
      eventDate: new Date("2026-08-28T14:00:00Z"),
      location: "Virtual",
      registrationStatus: "Open",
    },
    {
      id: "evt3",
      companyName: "Amazon",
      eventType: "Technical Interview",
      eventDate: new Date("2026-09-02T09:30:00Z"),
      location: "Campus Main Hall",
      registrationStatus: "Closed",
    }
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Placement Events</h1>
        <p className={styles.subtitle}>Track upcoming drives, talks, and assessments.</p>
      </div>

      <div className={styles.grid}>
        {displayEvents.map((evt) => (
          <div key={evt.id} className={`card ${styles.eventCard}`}>
            <div className={styles.eventInfo}>
              <span className={styles.eventType}>{evt.eventType}</span>
              <h3 className={styles.companyName}>{evt.companyName}</h3>
              
              <div className={styles.metaList}>
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  {formatDate(evt.eventDate)}
                </div>
                <div className={styles.metaItem}>
                  <Clock size={16} />
                  {formatTime(evt.eventDate)}
                </div>
                <div className={styles.metaItem}>
                  <MapPin size={16} />
                  {evt.location}
                </div>
              </div>
            </div>

            <div className={styles.actionSection}>
              <div className={`${styles.status} ${evt.registrationStatus === 'Open' ? styles.open : styles.closed}`}>
                Registration: {evt.registrationStatus}
              </div>
              <button 
                className="btn btn-primary" 
                disabled={evt.registrationStatus !== 'Open'}
                style={{width: '100%'}}
              >
                {evt.registrationStatus === 'Open' ? 'Register Now' : 'Closed'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
