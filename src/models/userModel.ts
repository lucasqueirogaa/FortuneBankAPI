import { Schema, model } from "mongoose";
import { IUser } from "../types/User";

const accountStatementSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    pixKeys: {
      type: [String],
      required: true,
    },
    accountStatement: {
      type: [accountStatementSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = model<IUser>("Users", schema);

export default UserModel;
