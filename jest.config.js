module.exports = {
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.css$': require.resolve('identity-obj-proxy'),
      "axios": "axios/dist/node/axios.cjs"
    },
  };