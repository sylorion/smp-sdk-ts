// Types pour le système de booking et de commande
export var EstimateRequestStatus;
(function (EstimateRequestStatus) {
    EstimateRequestStatus["PENDING"] = "PENDING";
    EstimateRequestStatus["REVIEWING"] = "REVIEWING";
    EstimateRequestStatus["QUOTED"] = "QUOTED";
    EstimateRequestStatus["ACCEPTED"] = "ACCEPTED";
    EstimateRequestStatus["REJECTED"] = "REJECTED";
    EstimateRequestStatus["EXPIRED"] = "EXPIRED";
})(EstimateRequestStatus || (EstimateRequestStatus = {}));
export var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["CANCELED"] = "CANCELED";
})(BookingStatus || (BookingStatus = {}));
export var SlotStatus;
(function (SlotStatus) {
    SlotStatus["AVAILABLE"] = "AVAILABLE";
    SlotStatus["BOOKED"] = "BOOKED";
    SlotStatus["UNAVAILABLE"] = "UNAVAILABLE";
    SlotStatus["PAST"] = "PAST";
})(SlotStatus || (SlotStatus = {}));
export var BookingMode;
(function (BookingMode) {
    BookingMode["TIME_SLOT"] = "TIME_SLOT";
    BookingMode["DATE_RANGE"] = "DATE_RANGE";
    BookingMode["CONTINUOUS"] = "CONTINUOUS"; // NOUVEAU
})(BookingMode || (BookingMode = {}));
export var ServiceType;
(function (ServiceType) {
    ServiceType["HOURLY"] = "HOURLY";
    ServiceType["DAILY"] = "DAILY";
    ServiceType["WEEKLY"] = "WEEKLY";
    ServiceType["MONTHLY"] = "MONTHLY";
    ServiceType["CUSTOM"] = "CUSTOM";
})(ServiceType || (ServiceType = {}));
export var AvailabilityStatus;
(function (AvailabilityStatus) {
    AvailabilityStatus["ACTIVE"] = "ACTIVE";
    AvailabilityStatus["CANCELLED"] = "CANCELLED";
})(AvailabilityStatus || (AvailabilityStatus = {}));
