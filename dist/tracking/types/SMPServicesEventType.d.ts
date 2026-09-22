export type EventType = "click" | "view" | "purchase" | "scroll" | "form_submit" | "hover" | "section_time_spent" | "inactivity" | "abandon_form_event" | "submission_form_event" | "submit_form_event";
export type FormField = {
    fieldName: string;
    filledValue?: string;
    isCompleted: boolean;
    isInError: boolean;
    error?: string;
};
export type FormAbandonmentEvent = {
    formId: string;
    fields: FormField[];
};
export type FormSubmissionEvent = {
    formId: string;
    fields: FormField[];
};
export type FormEvent = FormAbandonmentEvent | FormSubmissionEvent;
export type ScrollCapturedEvent = {
    depth?: number;
    timestamp: string;
    duration?: number;
    metadata?: any;
};
export type ViewCapturedEvent = {
    depth?: number;
    timestamp: string;
    duration?: number;
    metadata?: any;
};
export type ButtonClickCapturedEvent = {
    elementId: string;
    timestamp: string;
};
export type SectionTimeSpentCapturedEvent = {
    sectionId: string;
    timeSpent: number;
    timestamp: string;
};
export type InactivityCapturedEvent = {
    timestamp: string;
    duration: number;
};
export type MouseCapturedEvent = {
    position: {
        x: number;
        y: number;
    };
    timestamp: string;
};
export type RatingCapturedEvent = {
    serviceId: string;
    rating: number;
};
export type PurchaseHCapturedEvent = {
    serviceId: string;
    category: string;
    price: number;
    purchaseDate: string;
};
export type LocationCapturedEvent = {
    location: string;
    coordinates?: {
        lon: number;
        lat: number;
    };
};
export type UserAttributes = {
    age?: number;
    gender?: string;
    currentPreferences?: string[];
};
export type UserHistoryCapturedEvent = {
    purchases?: PurchaseHCapturedEvent[];
    locations?: LocationCapturedEvent[];
    ratings?: RatingCapturedEvent[];
};
export type UserContextCapturedEvent = {
    userId?: string;
    attributes?: UserAttributes;
    historyEvents?: UserHistoryCapturedEvent;
};
export type SessionCapturedEvent = {
    sessionId: string;
    startTime: string;
    endTime?: string;
    totalDuration?: number;
};
export type PageContextCapturedEvent = {
    url: string;
    title: string;
    referrer?: string;
};
export interface DeviceInfoCapturedEvent {
    userAgent?: string;
    browserName?: string;
    browserVersion?: string;
    platform?: string;
    deviceType?: 'mobile' | 'desktop' | 'tablet' | 'unknown';
    screenResolution?: string;
    viewportSize?: string;
    devicePixelRatio?: number;
    cookiesEnabled?: boolean;
    localStorageEnabled?: boolean;
    sessionStorageEnabled?: boolean;
    indexedDBEnabled?: boolean;
    serviceWorkerEnabled?: boolean;
    hardwareConcurrency?: number | 'unknown';
    memory?: number | 'unknown';
    networkType?: string;
    downlinkSpeed?: number | 'unknown';
    rtt?: number | 'unknown';
    mediaDevices?: {
        audioInputSupported: boolean;
        videoInputSupported: boolean;
        microphones: string[];
        cameras: string[];
    };
    geolocationSupported?: boolean;
    webGLSupported?: boolean;
    webRTCSupported?: boolean;
    webAudioSupported?: boolean;
    language?: string;
    timezone?: string;
    brands?: string;
    mobile?: boolean;
    architecture?: string;
    model?: string;
    bitness?: string;
    uaFullVersion?: string;
}
export type NetworkInfoCapturedEvent = {
    ip: string;
    connectionType: "wifi" | "cellular" | "ethernet";
    bandwidth?: {
        up: number;
        down: number;
    };
};
export type ContextCapturedEvent = {
    user: UserContextCapturedEvent;
    session: SessionCapturedEvent;
    page: PageContextCapturedEvent;
    device?: DeviceInfoCapturedEvent;
    network?: NetworkInfoCapturedEvent;
};
export type SMPEvent = {
    type: EventType;
    timestamp: string;
    event: CapturedEvent;
    context: ContextCapturedEvent;
    metadata?: any;
};
export type VideoEvent = {
    elementId: string;
    action: 'play' | 'pause' | 'end' | 'seek';
    timestamp: string;
    metadata?: any;
};
export type CapturedEvent = ScrollCapturedEvent | ButtonClickCapturedEvent | SectionTimeSpentCapturedEvent | InactivityCapturedEvent | VideoEvent | MouseCapturedEvent | FormEvent;
