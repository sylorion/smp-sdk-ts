import { APIClient } from '../../api/APIClient.js';
import { Invoice } from './InvoiceController.js';
import { Estimate } from './EstimateController.js';
import { SMPPayment } from './PaymentController.js';
import { Contract } from './ContractController.js';
import { Order } from './OrderController.js';
import { Transaction } from './Transactioncontroller.js';
import { Wallet } from './WalletController.js';
import { Withdrawal } from './WithdrawalController.js';
import { SecureTransfer } from './SecureTransferController.js';
export declare class AccountingDomain {
    invoice: Invoice;
    smpPayment: SMPPayment;
    estimate: Estimate;
    contract: Contract;
    order: Order;
    transaction: Transaction;
    wallet: Wallet;
    withdrawal: Withdrawal;
    secureTransfer: SecureTransfer;
    constructor(client: APIClient);
}
