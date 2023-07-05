import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

function CreateEvent() {
    const { data: session } = useSession();
    const router = useRouter();
    const { register, handleSubmit, setValue } = useForm();
    let base64Image

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];

        // Read the file and encode it as Base64
        const reader = new FileReader();
        reader.onload = (event) => {
            base64Image = event.target.result.split(',')[1]; // Extract the base64 data
            setValue('image', base64Image);
        };
        reader.readAsDataURL(file);
        const fileName = file.name;
        const inputField = document.getElementById("image-input");
        inputField.value = fileName;
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = (event) => {
            base64Image = event.target.result.split(',')[1];
            setValue('image', base64Image);
        };
        reader.readAsDataURL(file);
        const fileName = file.name;
        const inputField = document.getElementById("image-input")
        inputField.value = fileName;
    };


    const onSubmit = async (data) => {
        const { title, description, location, date, price, maxPaxEvent, ipfs } = data;

        try {
            if (session) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        title,
                        description,
                        location,
                        date,
                        price: Number(price),
                        image: base64Image, // Use the base64 image data
                        maxPaxEvent: Number(maxPaxEvent),
                        ipfs,
                        creatorID: session.session.user.id
                    }),
                });
                router.push('/');
            }
        } catch (err) {
            console.error(err);
        }

    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '2rem' }}>
            <Card border="light" className="shadow-lg" style={{ width: '80%', color: 'rgb(0,0,0)', marginTop: '1rem' }}>
                <Card.Body>
                    <h4><b style={{ marginLeft: "2rem", paddingTop: "1rem" }}>Create Event</b></h4>
                    <Form className="mb-3" onSubmit={handleSubmit(onSubmit)} style={{ width: "95%", marginLeft: "2rem" }} >
                        <Form.Group>
                            <Form.Label style={{ marginTop: '0.9rem' }}>
                                Title:
                            </Form.Label>
                            <Form.Control type="text" {...register('title')} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{ marginTop: '0.9rem' }}>
                                Description:<br />
                            </Form.Label>
                            <Form.Control type="text" {...register('description')} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{ marginTop: '0.9rem' }}>
                                Location:
                            </Form.Label>
                            <Form.Control type="text" {...register('location')} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{ marginTop: '0.9rem' }}>
                                Date:
                            </Form.Label>
                            <Form.Control type="datetime-local" {...register('date')} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{ marginTop: '0.9rem' }}>
                                Price:
                            </Form.Label>
                            <Form.Control type="number" step="0.01" {...register('price')} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{ marginTop: '0.9rem' }}>
                                Max. Pax Event:
                            </Form.Label>
                            <Form.Control type="number" {...register('maxPaxEvent')} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{ marginTop: '0.9rem' }}>
                                ipfs data:
                            </Form.Label>
                            <Form.Control type="text" {...register('ipfs')} />
                        </Form.Group>
                        <Form.Group>
                            <div>
                                <label style={{ marginTop: '0.9rem' }} htmlFor="file-input">
                                    Select an image file:
                                </label>
                            </div>
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onChange={handleFileSelect}
                                style={{
                                    border: '2px dashed gray',
                                    padding: '1rem',
                                    margin: '1rem 0',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <div>
                                    <Form.Text className="mb-2" muted>
                                        Drag & drop image here or
                                    </Form.Text>
                                </div>
                                <input
                                    id="file-input"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                />
                                <div style={{ display: 'flex' }}>
                                    <Button variant="dark" size="sm" onClick={() => document.getElementById('file-input').click()} style={{ marginRight: '1rem' }}>
                                        Browse
                                    </Button>
                                    <input id="image-input" type="text" value="no file selected" readOnly style={{ width: '80%' }} />
                                </div>
                            </div>
                        </Form.Group>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link href="/eventManagement">
                                <Button size="sm" variant="danger">
                                    Cancel
                                </Button>
                            </Link>
                            <Button style={{ marginLeft: "0.7rem" }} type="submit" variant="dark" size="sm">Create event</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default CreateEvent;
