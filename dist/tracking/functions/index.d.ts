import { EventType, UserContextCapturedEvent, ContextCapturedEvent, NetworkInfoCapturedEvent, PageContextCapturedEvent, SessionCapturedEvent, SMPEvent, CapturedEvent } from './../types/SMPServicesEventType.js';
export declare function getUserContextCapturedEvent(): UserContextCapturedEvent;
export declare function getSessionCapturedEvent(): SessionCapturedEvent;
export declare function getPageContextCapturedEvent(): PageContextCapturedEvent;
export declare function getNetworkInfoCapturedEvent(): NetworkInfoCapturedEvent;
export declare function getContextCapturedEvent(): ContextCapturedEvent;
export declare function createSMPEvent(type: EventType, event: CapturedEvent): SMPEvent;
