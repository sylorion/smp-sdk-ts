import { APIClient } from '../api/APIClient.js';
import { Invoice } from './accounting/InvoiceController.js';
import { SMPPayment } from './accounting/PaymentController.js';
import { Contract } from './accounting/ContractController.js';
import { Order } from './accounting/OrderController.js';
import { Transaction } from './accounting/Transactioncontroller.js';
import { Wallet } from './accounting/WalletController.js';
import { Withdrawal } from './accounting/WithdrawalController.js';
export declare class AccountingDomain {
    invoice: Invoice;
    sMPPayment: SMPPayment;
    contract: Contract;
    order: Order;
    transaction: Transaction;
    wallet: Wallet;
    withdrawal: Withdrawal;
    constructor(client: APIClient);
}
