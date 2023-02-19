import repairsHttp from "@/utils/repairs";

export const addOrders = (params) => {
    return repairsHttp.post('/repairs/addOrder', params)
}

export const orderList = (params) => {
    return repairsHttp.post('/repairs/list', params)
}
