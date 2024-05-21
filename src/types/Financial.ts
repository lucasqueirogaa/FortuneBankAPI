export interface IDepositBody {
  name: string;
  accountNumber: number;
  cpf: string;
  amount: number;
}

export interface IWithdrawBody {
  name: string;
  accountNumber: number;
  cpf: string;
  withdrawValue: number;
  password: string;
}

export interface IAccountStatementStatement {
  type: string;
  value: number;
  date: string;
}
