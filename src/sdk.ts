import crypto from 'crypto'

const commonConfig = {
  Format: 'JSON',
  SignatureMethod: 'HMAC-SHA1',
  SignatureVersion: '1.0'
}

export interface Parameters {
  [name: string]: string
}

const sortParameterKeys: (
  parameters: Parameters
) => Parameters = parameters => {
  const response: Parameters = {}
  Object.keys(parameters)
    .sort((a, b) => (a < b ? -1 : 1))
    .forEach(key => {
      response[key] = parameters[key]
    })
  return response
}

const fixedEncodeURIComponent: (input: string) => string = input =>
  encodeURIComponent(input).replace(
    /[!'()*]/g,
    c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  )

type GetUrl = (
  accessKeyId: string,
  appSecret: string,
  action: string,
  parameters: Parameters,
  version: string
) => string

export const getUrl: GetUrl = (
  accessKeyId,
  appSecret,
  action,
  parameters: Parameters = {},
  version
) => {
  const params = sortParameterKeys(
    Object.assign({}, commonConfig, parameters, {
      Version: version,
      AccessKeyId: accessKeyId,
      Action: action,
      Timestamp: new Date().toISOString().replace(/\.\d{3}/, ''),
      SignatureNonce: Math.round(Math.random() * 10000)
    })
  )

  let headerString = ''
  Object.keys(params).forEach(
    key => (headerString += `${key}=${fixedEncodeURIComponent(params[key])}&`)
  )
  headerString = headerString.slice(0, -1)

  const stringToSign = `GET&%2F&${encodeURIComponent(headerString)}`
  const sign = crypto
    .createHmac('sha1', `${appSecret}&`)
    .update(stringToSign)
    .digest('base64')
  return `https://cdn.aliyuncs.com?Signature=${encodeURIComponent(
    sign
  )}&${headerString}`
}
