import { AccountModel } from '../../../../domain/models/account'

export const map = (account: any): AccountModel => {
  return {
    id: account._id.toHexString(),
    name: account.name,
    email: account.email,
    password: account.password
  }
}
