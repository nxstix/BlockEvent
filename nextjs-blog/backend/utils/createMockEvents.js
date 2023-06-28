import mockEvents from '../../mockdata.json'
import { createEvent } from '../endpoints/events/eventService'


export async function createMockEvents() {
        await createEvent(mockEvents[0])
        await createEvent(mockEvents[1])
        await createEvent(mockEvents[2])
        await createEvent(mockEvents[3])
        await createEvent(mockEvents[4])
        await createEvent(mockEvents[5])
        await createEvent(mockEvents[6])
        await createEvent(mockEvents[7])
        await createEvent(mockEvents[8])
        await createEvent(mockEvents[9])
        await createEvent(mockEvents[10])
        await createEvent(mockEvents[11])
        await createEvent(mockEvents[12])
        await createEvent(mockEvents[13])
        await createEvent(mockEvents[14])
        await createEvent(mockEvents[15])
        await createEvent(mockEvents[16])
        await createEvent(mockEvents[17])
        await createEvent(mockEvents[18])
        await createEvent(mockEvents[19])
}

