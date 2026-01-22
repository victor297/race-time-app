export class PaystackResponseDTO {
  message: string;
  redirecturl: string;
  reference: string;
  status: "success" | "failed" | "cancelled" | string;
  trans: string;
  transaction: string;
  trxref: string;

  constructor(props: PaystackResponseDTO) {
    this.message = props.message;
    this.redirecturl = props.redirecturl;
    this.reference = props.reference;
    this.status = props.status;
    this.trans = props.trans;
    this.transaction = props.transaction;
    this.trxref = props.trxref;
  }

  static fromJson(json: any): PaystackResponseDTO {
    return new PaystackResponseDTO({
      message: json.message,
      redirecturl: json.redirecturl,
      reference: json.reference,
      status: json.status,
      trans: json.trans,
      transaction: json.transaction,
      trxref: json.trxref,
    });
  }
}
