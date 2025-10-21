export { serviceMutations } from "./catalog/serviceMutation.js";
export { assetMutations } from "./catalog/assetMutations.js";
export { serviceAssetMutations } from "./catalog/serviceAssetMutations.js";
export { assetMediaMutations } from "./catalog/assetMediaMutations.js";
export { serviceMediaMutations } from "./catalog/serviceMediaMutation.js";
export { organizationMutations } from "./organization/organizationMutation.js";
export { organizationMediaMutations } from "./organization/organizationMediaMutations.js";
export { userOrganizationMutations } from "./organization/userOrganization.js";
export { placeMutations } from "./location/placeMutation.js";
export { mailingMutations } from "./notification/mailingMutations.js";
export { profileMutations } from "./user-space/profileMutation.js";
export { walletMutations } from "./wallet/walletMutations.js";
export { waitingListMutations } from "./authentication/waitingListMutations.js";
export { engagementMutations } from "./engagement/engagementMutations.js";
export { timeSlotMutations } from "./timeSlot/timeSlotMutations.js";

// Import named exports and re-export as named exports for compatibility
import { bookingMutations } from "./command/bookingMutations.js";
export { bookingMutations };
import { bookingConfigurationMutations } from "./command/bookingConfigurationMutations.js";
export { bookingConfigurationMutations };
import { contractMutations } from "./contract/contractMutations.js";
export { contractMutations };
import { mediaMutations } from "./document/mediaMutation.js";
export { mediaMutations };
import { paymentMutations } from "./accounting/paymentMutations.js";
export { paymentMutations };
import { transactionMutations } from "./accounting/transactionMutations.js";
export { transactionMutations };

// Import default export for invoiceMutations
import invoiceMutations from "./accounting/invoiceMutations.js";
export { invoiceMutations };
