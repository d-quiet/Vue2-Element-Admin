// echarts 接口
import axios from 'axios'

export function getKunMing() {
    return axios({
        url: 'https://geo.datav.aliyun.com/areas_v3/bound/530100_full.json',
        method: 'get'
    })
}
