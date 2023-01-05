import { DbLoadAccountByToken } from './db-load-accont-by-token'
import { Decrypter, LoadAccountByTokenRepository } from './load-accont-by-token-protocols'
import { mockDecrypt, mockLoadAccountByTokenRepository } from '@/data/test'
import { mockAccountModel, throwError } from '@/domain/test'

type SutTypes = {
  sut: DbLoadAccountByToken
  decryptStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decryptStub = mockDecrypt()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
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
    expect(httpResponse).toEqual(mockAccountModel())
  })

  test('Should throws if Decrypter throws', async () => {
    const { sut, decryptStub } = makeSut()
    jest.spyOn(decryptStub, 'decrypt').mockImplementationOnce(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throws if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
