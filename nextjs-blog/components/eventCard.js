import React from 'react';
import Link from 'next/link';

function EventCard({ event }) {
  return (
    <div style={{ marginLeft: '2rem' }}>
      <Link href={`/events/${encodeURIComponent(event.id)}`}>
        {/* style inspiration from https://codepen.io/mrsahar/pen/jRjmdL */}
        <div className="shadow-lg" style={{ width: '13vw', height: '35vh', backgroundColor: '#FFF', boxShadow: '0px 0px 25px rgba(0, 0, 0, 0.1)', backgroundPosition: 'center', overflow: 'hidden', position: 'relative', margin: '10px auto', cursor: 'pointer', borderRadius: '10px' }}>
          <img style={{ objectFit: "cover", objectPosition: "center", height: "35vh", filter: "brightness(60%)" }} src={event.image} className="img img-responsive" />
          <div style={{ position: 'absolute', left: '15px', bottom: '65px', fontSize: '1.25rem', color: '#FFF', textShadow: '0px 0px 20px rgba(0, 0, 0, 0.5)', fontWeight: 'bold', transition: 'all linear 0.25s' }}>{event.title}</div>
          <div style={{ position: 'absolute', bottom: '30px', left: '15px', color: '#FFF', fontSize: '0.8rem', transition: 'all linear 0.25s' }}>{event.location},</div>
          <div style={{ position: 'absolute', bottom: '15px', left: '15px', color: '#FFF', fontSize: '0.8rem', transition: 'all linear 0.25s' }}>{event.dateString}</div>
        </div>
      </Link>
    </div>
  );
}

export default EventCard;
