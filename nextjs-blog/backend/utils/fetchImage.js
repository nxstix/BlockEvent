export default async function fetchImage(imageID) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/${imageID}`)
    const body = await response.json()
    return body.imageData ? `data:image/jpeg;base64,${body.imageData}` : null;
}