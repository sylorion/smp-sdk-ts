// Types pour les engagements
// Enums
export var EngagementStatus;
(function (EngagementStatus) {
    EngagementStatus["ACTIVE"] = "active";
    EngagementStatus["ON_HOLD"] = "on_hold";
    EngagementStatus["COMPLETED"] = "completed";
    EngagementStatus["CANCELLED"] = "cancelled";
})(EngagementStatus || (EngagementStatus = {}));
export var EngagementPriority;
(function (EngagementPriority) {
    EngagementPriority["LOW"] = "low";
    EngagementPriority["MEDIUM"] = "medium";
    EngagementPriority["HIGH"] = "high";
    EngagementPriority["URGENT"] = "urgent";
})(EngagementPriority || (EngagementPriority = {}));
export var TimeSlotType;
(function (TimeSlotType) {
    TimeSlotType["TIMESHEET_ENTRY"] = "timesheet_entry";
    TimeSlotType["AVAILABILITY_SLOT"] = "availability_slot";
})(TimeSlotType || (TimeSlotType = {}));
export var TimeSlotStatus;
(function (TimeSlotStatus) {
    TimeSlotStatus["ACTIVE"] = "active";
    TimeSlotStatus["CANCELLED"] = "cancelled";
    TimeSlotStatus["COMPLETED"] = "completed";
    TimeSlotStatus["ON_HOLD"] = "on_hold";
})(TimeSlotStatus || (TimeSlotStatus = {}));
export var TimeSlotPriority;
(function (TimeSlotPriority) {
    TimeSlotPriority["LOW"] = "low";
    TimeSlotPriority["MEDIUM"] = "medium";
    TimeSlotPriority["HIGH"] = "high";
    TimeSlotPriority["URGENT"] = "urgent";
    TimeSlotPriority["CRITICAL"] = "critical";
})(TimeSlotPriority || (TimeSlotPriority = {}));
export var EngagementReportStatus;
(function (EngagementReportStatus) {
    EngagementReportStatus["DRAFT"] = "draft";
    EngagementReportStatus["SUBMITTED"] = "submitted";
    EngagementReportStatus["APPROVED"] = "approved";
    EngagementReportStatus["PAID"] = "paid";
    EngagementReportStatus["REJECTED"] = "rejected";
    EngagementReportStatus["CANCELLED"] = "cancelled";
})(EngagementReportStatus || (EngagementReportStatus = {}));
