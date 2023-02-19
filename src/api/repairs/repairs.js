import repairsHttp from "@/utils/repairs";

export const addOrders = (params) => {
    return repairsHttp.post('/repairs/addOrder', params)
}

export const orderList = (params) => {
    return repairsHttp.post('/repairs/list', params)
}

export const employeeList = () => {
    return repairsHttp.get('repairs/employee/list')
}

export const sendEmployee = (params) => {
    return repairsHttp.post('repairs/sendEmployee',params)
}

export const deleteOrder = (id) => {
    return repairsHttp.delete('repairs/delete/'+id)
}

