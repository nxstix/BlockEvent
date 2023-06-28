import React, { useState } from "react";
import EventCard from "./eventCard";

function EventList({ events }) {
    if(events){
    return (
        <div style={{ position: "relative", maxWidth: "100%" }}>
            <div
                style={{ display: "flex", flexFlow: "row nowrap", overflowX: "scroll", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", paddingBottom: "4rem" }}>
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );}else {
        return (
            <div>keine Events</div>
        )
    }
}

export default EventList;
