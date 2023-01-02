import { DbLoadAccountByToken } from './db-load-accont-by-token'
import { AccountModel, Decrypter, LoadAccountByTokenRepository } from './load-accont-by-token-protocols'

const makeDecrypt = (): Decrypter => {
  class DecryptStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecryptStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_mail@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

type SutTypes = {
  sut: DbLoadAccountByToken
  decryptStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decryptStub = makeDecrypt()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decryptStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decryptStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Should calls Decrypt with correct values', async () => {
    const { sut, decryptStub } = makeSut()
    const decryptSpy = jest.spyOn(decryptStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should returns null if Decrypter returns null', async () => {
    const { sut, decryptStub } = makeSut()
    jest.spyOn(decryptStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.load('any_token', 'any_role')
    expect(httpResponse).toBeNull()
  })

  test('Should calls LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should returns null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.load('any_token', 'any_role')
    expect(httpResponse).toBeNull()
  })

  test('Should returns an account on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.load('any_token', 'any_role')
    expect(httpResponse).toEqual(makeFakeAccount())
  })

  test('Should throws if Decrypter throws', async () => {
    const { sut, decryptStub } = makeSut()
    jest.spyOn(decryptStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throws if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
