import { APIClient } from '../../api/APIClient.js';
import { Invoice } from './InvoiceController.js';
import { SMPPayment } from './PaymentController.js';
import { Contract } from './ContractController.js';
import { Order } from './OrderController.js';
import { Transaction } from './Transactioncontroller.js';
import { Wallet } from './WalletController.js';

export class AccountingDomain {
  public invoice: Invoice;
  public sMPPayment: SMPPayment;
  public contract: Contract;
  public order: Order;
  public transaction: Transaction;
  public wallet: Wallet;

  constructor(client: APIClient) {
    this.invoice = new Invoice(client);
    this.sMPPayment = new SMPPayment(client);
    this.contract = new Contract(client);
    this.order = new Order(client);
    this.transaction = new Transaction(client);
    this.wallet = new Wallet(client);
  }
}
