export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/clean-node-api',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'IIe5ncPDlESIGXXavo12b'
}
