import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { LoadAccountByToken } from '../../../../../domain/usecases/load-account-by-token'
import { DbLoadAccountByToken } from '../../../../../data/usecases/load-accont-by-token/db-load-accont-by-token'
import { JwtAdapter } from '../../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
