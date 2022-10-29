export interface Encrypter {
  encrypt: (values: string) => Promise<string>
}
