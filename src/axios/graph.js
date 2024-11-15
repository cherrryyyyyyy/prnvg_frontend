import Axios from 'axios'
const instance1 = Axios.create({
	baseURL: '/gra'
})


export const GraphConstruct = (data) => instance1.post('/graphconstruct', { data })
export const SubGraphConstruct = (data) => instance1.post('/subgraphconstruct', { data })