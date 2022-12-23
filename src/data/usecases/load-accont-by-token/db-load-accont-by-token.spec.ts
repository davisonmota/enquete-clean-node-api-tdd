import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-accont-by-token'

const makeDecryptStub = (): Decrypter => {
  class DecryptStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecryptStub()
}
interface SutTypes {
  sut: DbLoadAccountByToken
  decryptStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decryptStub = makeDecryptStub()
  const sut = new DbLoadAccountByToken(decryptStub)
  return {
    sut,
    decryptStub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Should calls Decrypt with correct values', async () => {
    const { sut, decryptStub } = makeSut()
    const decryptSpy = jest.spyOn(decryptStub, 'decrypt')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
