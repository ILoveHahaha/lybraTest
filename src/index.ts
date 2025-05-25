import {createContract, wallet} from "./service";
import {AbiEnum, AbiList} from "./abiList";
require('dotenv').config({ path: '../.env' })

const { ethers } = require("ethers")
const fs = require("fs")

// 读取 ABI
// const lybraAbi = JSON.parse(fs.readFileSync("./abi/Lybra.json"))
// const erc20Abi = JSON.parse(fs.readFileSync("./abi/stETH.json"))
//
// const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
//
// const lybraContract = new ethers.Contract(process.env.LYBRA_ADDRESS, lybraAbi, provider)
// const stethContract = new ethers.Contract(process.env.STETH_ADDRESS, erc20Abi, provider)

// 上次检查到的余额
let lastBalance = ethers.BigNumber.from("0")

async function checkBalanceAndExecute() {
    createContract().then(async (res) => {
        const LYBRA_ADDRESS = AbiList.find(value => value.key === AbiEnum.STETH)
        const balance = await res[AbiEnum.STETH].balanceOf(LYBRA_ADDRESS?.address)

        if (balance.gt(lastBalance)) {
            console.log("🎯 检测到 stETH 增加，触发套利逻辑")
            lastBalance = balance

            // 调用套利合约
            const arbitrageContract = new ethers.Contract(
                process.env.ARBITRAGE_CONTRACT_ADDRESS,
                ["function executeArbitrage() external"], // 简化版 ABI
                wallet
            )

            const tx = await arbitrageContract.executeArbitrage()
            console.log(`✅ 已发起套利交易: ${tx.hash}`)
        } else {
            console.log("⏳ 无变化，当前余额: ", balance.toString())
        }
    }).catch(e => {
        console.log('createContract', e)
    })
}

setInterval(checkBalanceAndExecute, 15000) // 每 15 秒轮询
