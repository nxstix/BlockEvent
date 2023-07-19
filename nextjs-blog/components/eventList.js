import React, { useState, useEffect } from "react";
import EventCard from "./eventCard";

function EventList({ events }) {
    const [eventImages, setEventImages] = useState([]);

    useEffect(() => {
        const fetchEventImages = async () => {
            const imagePromises = events.map(async (event) => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/${event.image}`)
                const body = await response.json()
                return body
            });
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
