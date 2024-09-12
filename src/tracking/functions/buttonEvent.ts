import { transmitEvent } from "../trackingBatch.js";
import { ButtonClickCapturedEvent } from "./../types/SMPServicesEventType.js";

// export function trackButtonClick(elementId: string) {
//   const button = document.getElementById(elementId);
//   if (button) {
//     button.addEventListener('click', () => {
//       const event: ButtonClickCapturedEvent = {
//         type: "button_click",
//         elementId: elementId,
//         timestamp: new Date().toISOString(),
//         page: window.location.href, 
//       };
//       transmitEvent(event);
//     });
//   }
// }
