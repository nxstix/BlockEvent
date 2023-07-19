import mockEvents from '../../mockdata.json'
import { createEvent } from '../endpoints/events/eventService'


export async function createMockEvents() {
        try {
                for (let i = 0; i < mockEvents.length; i++) {
                        await createEvent(mockEvents[i]);
                }
        } catch (error) {
                console.error('Error occurred while creating mock events:', error);
        }
}

