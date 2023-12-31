import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useSession } from 'next-auth/react';

export async function getServerSideProps() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`);
        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }
        const events = await response.json();

        return {
            props: {
                events
            },
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                events: null
            },
        };
    }
}

function EventManagement({ events }) {
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

    const { data: session } = useSession();
    if (session) {
        if (session.session.user.isEventmanager) {
            events = events.filter(event => event.creatorID === session.session.user.id);
        }
    }
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const [eventSel, setEventSel] = useState();


    async function onDelete(eventid) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventid}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'DELETE',
        })
        router.push('/eventManagement');

    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete {eventSel?.title}?</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex", justifyContent: "right" }}>
                    <Button style={{ marginRight: "1rem" }} onClick={() => setShowModal(false)} size="sm" variant="dark">Cancel</Button>
                    <Button onClick={() => { onDelete(eventSel?.id); setShowModal(false); }} size="sm" variant="danger">Delete</Button>
                </Modal.Body>
            </Modal>
            <Card border="light" className="shadow-lg" style={{ width: '80%', color: 'rgb(0,0,0)', marginTop: '1rem' }}>
                <Card.Body>
                    <h4><b style={{ marginLeft: "2rem", paddingTop: "1rem" }}>Event management</b></h4>
                    <Link href="/createEvent">
                        <Button style={{ margin: "2rem" }} size="sm" variant="outline-secondary">
                            Create Event
                        </Button>
                    </Link>
                    <div style={{ position: "relative", maxWidth: "100%" }}>
                        <div
                            style={{ display: "flex", flexFlow: "row wrap", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", paddingBottom: "4rem", display: 'flex', justifyContent: 'center' }}>
                            {events.map((event, index) => (
                                <Card key={event.id} border="light" className="shadow-lg" style={{ fontSize: "0.8rem", width: '20%', color: 'rgb(0,0,0)', margin: '1rem' }}>
                                    <Card.Body>
                                        <img src={eventImages[index]} alt="Event" className="img img-responsive" />
                                        <p ><strong>Title:</strong></p>
                                        <p>{event.title}</p>
                                        <p ><strong>Location:</strong></p>
                                        <p>{event.location}</p>
                                        <p ><strong>Date:</strong></p>
                                        <p>{event.dateString}</p>
                                        <p ><strong>Price:</strong></p>
                                        <p>{event.price}</p>
                                        <p ><strong>Description:</strong></p>
                                        <p>{event.description}</p>
                                    </Card.Body>
                                    <div style={{ display: 'flex', justifyContent: 'right', padding: "0.5rem" }}>
                                        <Link href={`/updateEvent/${encodeURIComponent(event.id)}`}>
                                            <Button style={{ marginRight: "0.5rem" }} size="sm" variant="warning">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button onClick={() => { setShowModal(true); setEventSel(event); }} size="sm" variant="danger">
                                            Delete
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default EventManagement;


