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
