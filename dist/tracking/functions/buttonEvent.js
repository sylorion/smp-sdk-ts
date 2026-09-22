import { transmitEvent } from '../trackingBatch.js';
import { createSMPEvent } from './index.js'; // TODO move to the right place ...
export function trackButtonClick(elementId) {
    const button = document.getElementById(elementId);
    if (button) {
        button.addEventListener('click', () => {
            const buttonElement = {
                elementId: elementId,
                timestamp: new Date().toISOString(),
            };
            const event = createSMPEvent("click", buttonElement);
            transmitEvent(event);
        });
    }
}
