import { Invoice } from './InvoiceController.js';
import { Estimate } from './EstimateController.js';
import { SMPPayment } from './PaymentController.js';
import { Contract } from './ContractController.js';
import { Order } from './OrderController.js';
import { Transaction } from './Transactioncontroller.js';
import { Wallet } from './WalletController.js';
import { Withdrawal } from './WithdrawalController.js';
import { SecureTransfer } from './SecureTransferController.js';
export class AccountingDomain {
    constructor(client) {
        this.invoice = new Invoice(client);
        this.smpPayment = new SMPPayment(client);
        this.estimate = new Estimate(client);
        this.contract = new Contract(client);
        this.order = new Order(client);
        this.transaction = new Transaction(client);
        this.wallet = new Wallet(client);
        this.withdrawal = new Withdrawal(client);
        this.secureTransfer = new SecureTransfer(client);
    }
}
