import {saveAbi} from "./getAbi"
import {AbiList} from "./abiList"
import fs from 'fs'
import path from 'path'
import {ContractObj, FileObj} from "./types";
import {JsonRpcProvider, Wallet, Contract} from "ethers";
require('dotenv').config({ path: '../.env' })

const ABIPATH = '../abi'

// 注册器
export const provider = new JsonRpcProvider(process.env.RPC_URL)
// 钱包
// export const wallet = new Wallet(process.env.PRIVATE_KEY || '', provider)

// 判定是否没有json文件
export const isNonEmptyJsonFileSync = (folderPath: string, fileName: string): Boolean => {
    if (!fileName.endsWith('.json')) {
        return false
    }

    const filePath = path.join(folderPath, fileName)

    if (!fs.existsSync(filePath)) {
        return false
    }

    const stats = fs.statSync(filePath)
    return stats.isFile() && stats.size > 0
}

// 写入abi，有的话就不写入了
export const writeABi = () => {
    const promiseList: Array<Promise<unknown>> = []
    AbiList.forEach(value => {
        const result = isNonEmptyJsonFileSync(ABIPATH, value.key)
        if (!result) {
            promiseList.push(saveAbi(value.key, value.address))
        }
    })

    return Promise.all(promiseList)
}

// 生成合约
export const createContract = async () => {
    return new Promise((resolve, reject) => {
        writeABi().then(() => {
            // 文件对象
            const fileObj: FileObj = {}
            // 合约对象
            const contractObj: ContractObj = {}
            const files = fs.readdirSync(ABIPATH)

            files?.forEach((value) => {
                const path: string = `${ABIPATH}/${value}`
                const key = value.split('.')[0]
                const address = AbiList.find(val => val.key === key)
                fileObj[key] = JSON.parse(fs.readFileSync(path, 'utf-8'))
                if (address) {
                    contractObj[key] = new Contract(address?.address || '', fileObj[key], provider)
                }
            })

            resolve(contractObj)
        }).catch((e) => {
            console.log('写入abi失败', e)
            reject(e)
        })
    })
}
