import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-accont-by-token'
describe('DbLoadAccountByToken UseCase', () => {
  test('Should calls Decrypt with correct values', async () => {
    class DecryptStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return await new Promise(resolve => resolve('any_value'))
      }
    }
    const decryptStub = new DecryptStub()
    const decryptSpy = jest.spyOn(decryptStub, 'decrypt')
    const sut = new DbLoadAccountByToken(decryptStub)
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
