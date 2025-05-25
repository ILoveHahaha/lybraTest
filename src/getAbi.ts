const fs = require('fs')
const axios = require('axios')
// const https = require('https')
const HttpsProxyAgent = require('https-proxy-agent')
require('dotenv').config({ path: '../.env' })

// const agent = new https.Agent({ keepAlive: true })
const agent = new HttpsProxyAgent('http://127.0.0.1:7890')

// TODO: 这里不知道合约的json会不会变更，后续如果发现会有变更注意做好版本检测
/**
 * @param {string} name 合约名字
 * @param {string} address 合约地址
 * @description 保存合约json
 * */
export const saveAbi = async (name: string, address: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios('https://api.etherscan.io/api', {
                params: {
                    module: 'contract',
                    action: 'getabi',
                    address,
                    apiKey: process.env.API_KEY
                },
                httpsAgent: agent,
                timeout: 10000 // 10秒超时
            })

            const abi = JSON.parse(res.data.result)
            fs.writeFileSync(`../abi/${name}.json`, JSON.stringify(abi, null, 2))

            resolve('success')
        } catch (e) {
            console.log('saveAbi error', e)
            reject(e)
        }
    })

}
