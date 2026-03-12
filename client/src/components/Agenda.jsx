/* ==========================================================
 * Agenda Component
 * 
 * Displays the 3-hour workshop agenda in a visually 
 * appealing timeline format with session details.
 * ========================================================== */

import React from 'react';

const agendaItems = [
  {
    id: 1,
    time: '10:00 – 11:00 AM',
    title: 'Introduction to Cloud Native Architecture & Azure Fundamentals',
    description:
      'Understand the principles of cloud-native design, explore Azure\'s core services, and learn how modern applications are built for the cloud from the ground up.',
    topics: ['Cloud Computing Basics', 'Azure Portal & Services', 'IaaS vs PaaS vs SaaS', 'Azure Resource Groups'],
    icon: '☁️',
  },
  {
    id: 2,
    time: '11:00 – 12:00 PM',
    title: 'Fundamentals of UI Design, Security & App Deployment Basics',
    description:
      'Dive into modern UI design principles, understand Azure security best practices, and learn the fundamentals of deploying applications to the cloud.',
    topics: ['UI/UX Design Principles', 'Azure Security Center', 'Azure App Service', 'Deployment Strategies'],
    icon: '🛡️',
  },
  {
    id: 3,
    time: '12:00 – 01:00 PM',
    title: 'UI Development, App Deployment & End-to-End Monitoring',
    description:
      'Build a complete UI, deploy it to Azure App Service, and set up comprehensive monitoring with Azure Monitor and Application Insights.',
    topics: ['React Development', 'CI/CD Pipelines', 'Azure Monitor', 'Application Insights'],
    icon: '🚀',
  },
];

function Agenda() {
  return (
    <section id="agenda" className="agenda">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <span className="section-tag">Workshop Agenda</span>
          <h2 className="section-title">What You'll Learn</h2>
          <p className="section-desc">
            A structured 3-hour deep dive into cloud-native development with Microsoft Azure.
          </p>
        </div>

        {/* Timeline */}
        <div className="agenda__timeline">
          {agendaItems.map((item) => (
            <div key={item.id} className="agenda__item">
              {/* Timeline connector */}
              <div className="agenda__connector">
                <div className="agenda__dot">
                  <span>{item.icon}</span>
                </div>
                {item.id < agendaItems.length && <div className="agenda__line" />}
              </div>

              {/* Session card */}
              <div className="agenda__card">
                <div className="agenda__time">
                  <span>Session {item.id}</span>
                  <strong>{item.time}</strong>
                </div>
                <h3 className="agenda__title">{item.title}</h3>
                <p className="agenda__desc">{item.description}</p>

                {/* Topic pills */}
                <div className="agenda__topics">
                  {item.topics.map((topic) => (
                    <span key={topic} className="agenda__topic">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Agenda;
