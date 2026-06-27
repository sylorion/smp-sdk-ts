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

export class AccountingDomain {
  public invoice: Invoice;
  public smpPayment: SMPPayment;
  public estimate: Estimate;
  public contract: Contract;
  public order: Order;
  public transaction: Transaction;
  public wallet: Wallet;
  public withdrawal: Withdrawal;
  public secureTransfer: SecureTransfer;

  constructor(client: APIClient) {
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
