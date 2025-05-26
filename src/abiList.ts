export enum AbiEnum {
    LYBRA = 'LYBRA',
    STETH = 'STETH',
    EUSD = 'EUSD'
}

// 合约配置
export const AbiList = [
    {
        key: AbiEnum.LYBRA,
        address: '0xa980d4c0C2E48d305b582AA439a3575e3de06f0E'
    },
    {
        key: AbiEnum.STETH,
        proxy_address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
        address: '0x17144556fd3424edc8fc8a4c940b2d04936d17eb'
    },
    {
        key: AbiEnum.EUSD,
        address: '0xdf3ac4f479375802a821f7b7b46cd7eb5e4262cc'
    }
]
