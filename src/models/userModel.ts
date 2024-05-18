import { Schema, model } from "mongoose";
import { IUser } from "../types/User";

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
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    pixKeys: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = model<IUser>("Users", schema);

export default UserModel;
