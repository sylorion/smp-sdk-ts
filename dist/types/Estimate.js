export var NegotiationStatus;
(function (NegotiationStatus) {
    NegotiationStatus["NONE"] = "none";
    NegotiationStatus["IN_PROGRESS"] = "in_progress";
    NegotiationStatus["ACCEPTED"] = "accepted";
    NegotiationStatus["REJECTED"] = "rejected";
})(NegotiationStatus || (NegotiationStatus = {}));
export var EstimateStatus;
(function (EstimateStatus) {
    EstimateStatus["PENDING"] = "pending";
    EstimateStatus["NEGOTIATING"] = "negotiating";
    EstimateStatus["CLIENT_VALIDATED"] = "client_validated";
    EstimateStatus["PROVIDER_VALIDATED"] = "provider_validated";
    EstimateStatus["ACCEPTED"] = "accepted";
    EstimateStatus["REJECTED"] = "rejected";
    EstimateStatus["CLOSED"] = "closed";
})(EstimateStatus || (EstimateStatus = {}));
