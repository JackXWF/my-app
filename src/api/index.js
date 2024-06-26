import http from "../utils/request";

//请求首页数据


export const getData = (data) => {
    //返回promise对象
    return http.post('/user/login', data)
}

export const login = (data) => {
    //返回promise对象
    return http.post('/user/login', data)
}

export const test = () => {
    return http.get('/user/test')
}

export const getStudentList = (data) => {
    return http.post('/student/list', data)
}

export const addStudent = (data) => {
    return http.post('/student/add', data)
}

export const updateStudent = (data) => {
    return http.post('/student/update', data)
}

export const removeStudent = (stuNumber) => {
    return http.delete('/student/removeStudent/' + stuNumber)
}

export const exportBcgl = (query) => {
    return http.get('/student//export/' + query)
}

export const addUser = (params) => {
    return http.post('/user/add', params)
}

export const updatePwd = (params) => {
    return http.post('/user/updatePass', params)
}

export const homeData = () => {
    return http.get('/user/homeData')
}


export const exportStudent = () => {
    return http.get('/student/export')
}


export const importStudent = (params) => {
    return http.post('/student/import', params)
}

export const userList = (params) => {
    return http.post('/user/list', params)
}

export const enable = (id) => {
    return http.get('/user/enable/' + id)
}


export const disable = (id) => {
    return http.get('/user/disable/' + id)
}

export const setOnePass = (params) => {
    return http.post('/user/updatePassOne', params)
}

export const sendCode = (email, username, flag) => {
    return http.get('/user/sendEmailCode?email=' + email + "&username=" + username + "&flag=" + flag)
}

export const findPass = (params) => {
    return http.post('/user/findPass', params)
}
