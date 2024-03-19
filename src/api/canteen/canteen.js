import canteenHttp from "@/utils/canteen";
import http from "@/utils/request";


export const employeeList = (params) => {
    return canteenHttp.post('/employee/list', params)
}

export const add = (params) => {
    return canteenHttp.post('/employee/add', params)
}

export const update = (params) => {
    return canteenHttp.post('/employee/update', params)
}

export const removeEmployee = (stuNumber) => {
    return canteenHttp.delete('/employee/removeEmployee/' + stuNumber)
}

export const addDishType = (params) => {
    return canteenHttp.post('/dish/type', params)
}

export const dishTypeList = (params) => {
    return canteenHttp.post('/dish/typeList', params)
}

export const dishTypeLists = () => {
    return canteenHttp.post('/dish/typeLists')
}

export const updateDishType = (params) => {
    return canteenHttp.post('/dish/updateType', params)
}

export const deleteDishType = (typeId) => {
    return canteenHttp.delete('/dish/deleteType/'+ typeId)
}


export const addDish = (params) => {
    return canteenHttp.post('/dish/addDish', params)
}


export const dishList = (params) => {
    return canteenHttp.post('/dish/dishList', params)
}

export const updateDish = (params) => {
    return canteenHttp.post('/dish/updateDish', params)
}


export const removeDish = (dishNumber) => {
    return canteenHttp.delete('/dish/removeDish/' + dishNumber)
}


export const importEmp = (file) => {
    return canteenHttp.post('/employee/import', file)
}


export const exportEmp = () => {
    return canteenHttp.get('/employee/export')
}
