// ==============================
// BILLING & INVOICING
// ==============================
export * from './billing.js';
// ==============================
// CONTRACT
// ==============================
export var ContractStatus;
(function (ContractStatus) {
    ContractStatus["PENDING"] = "pending";
    ContractStatus["PROVIDER_SIGNED"] = "provider_signed";
    ContractStatus["CLIENT_SIGNED"] = "client_signed";
    ContractStatus["ACTIVE"] = "active";
    ContractStatus["REJECTED"] = "rejected";
})(ContractStatus || (ContractStatus = {}));
export var SignerRole;
(function (SignerRole) {
    SignerRole["CLIENT"] = "client";
    SignerRole["PROVIDER"] = "provider";
})(SignerRole || (SignerRole = {}));
export var SignatureType;
(function (SignatureType) {
    SignatureType["DRAW"] = "draw";
    SignatureType["TYPE"] = "type";
    SignatureType["UPLOAD"] = "upload";
    SignatureType["HASH"] = "hash";
    SignatureType["IMAGE"] = "image";
    SignatureType["DIGITAL"] = "digital";
})(SignatureType || (SignatureType = {}));
export var ContractStyleTheme;
(function (ContractStyleTheme) {
    ContractStyleTheme["CLASSIC"] = "classic";
    ContractStyleTheme["MODERN"] = "modern";
    ContractStyleTheme["MINIMAL"] = "minimal";
    ContractStyleTheme["CORPORATE"] = "corporate";
})(ContractStyleTheme || (ContractStyleTheme = {}));
// ==============================
// ESTIMATE
// ==============================
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
export * from './Wallet.js';
export * from './subscription.js';
