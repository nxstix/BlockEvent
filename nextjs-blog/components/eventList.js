import React, { useState, useEffect } from "react";
import EventCard from "./eventCard";

async function fetchImage(eventID) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/${eventID}`)
    const body = await response.json()
    return body.imageData ? `data:image/jpeg;base64,${body.imageData}` : null;
}

function EventList({ events }) {
    const [eventImages, setEventImages] = useState([]);

    useEffect(() => {
        const fetchEventImages = async () => {
            const imagePromises = events.map(event => fetchImage(event.image));
            const imageSources = await Promise.all(imagePromises);
            setEventImages(imageSources);
        };

        fetchEventImages();
    }, [events]);

    if (events) {
        return (
            <div style={{ position: "relative", maxWidth: "100%" }}>
                <div
                    style={{ display: "flex", flexFlow: "row nowrap", overflowX: "scroll", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", paddingBottom: "4rem" }}>
                    {events.map((event, index) => (
                        <EventCard key={event.id} event={event} image={eventImages[index]} />
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div>keine Events</div>
        )
    }
}

export default EventList;
