import { APIClient } from '../api/APIClient.js';
import { Invoice } from './accounting/InvoiceController.js';
import { SMPPayment } from './accounting/PaymentController.js';
import { Contract } from './accounting/ContractController.js';
import { Order } from './accounting/OrderController.js';
import { Transaction } from './accounting/Transactioncontroller.js';
import { Wallet } from './accounting/WalletController.js';

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
