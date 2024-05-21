import { IAccountStatementStatement } from "./Financial";

export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  cpf: string;
  accountNumber: number;
  amount: number;
  accountStatement: [IAccountStatementStatement]
}
