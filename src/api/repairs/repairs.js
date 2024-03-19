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


export const complete = (params) => {
    return repairsHttp.post('repairs/complete',params)
}

export const employeeTree = () => {
    return repairsHttp.get('repairs/employee/tree')
}


export const typeCharts = (flag) => {
    return repairsHttp.get('repairs/charts?flag='+flag)
}
