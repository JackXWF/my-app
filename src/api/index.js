import http from "../utils/request";

//请求首页数据


export const getData = (data) =>{
    //返回promise对象
    return http.post('/user/login',data)
}

export const login = (data) =>{
    //返回promise对象
    return http.post('/user/login',data)
}

export const test = () =>{
    return http.get('/user/test')
}

export const getStudentList = (data) =>{
    return http.post('/student/list',data)
}

export const addStudent = (data) =>{
    return http.post('/student/add',data)
}

export const updateStudent = (data) =>{
    return http.post('/student/update',data)
}

export const removeStudent = (stuNumber) =>{
    return http.delete('/student/removeStudent/'+stuNumber)
}

export const exportBcgl = (query) =>{
    return http.get('/student//export/'+query)
}
