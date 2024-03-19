import articlesHttp from "@/utils/articles";


export const add = (params) => {
    return articlesHttp.post('/articles/add', params)
}


export const list = (params) => {
    return articlesHttp.post('/articles/list', params)
}

export const updateState = (id) => {
    return articlesHttp.get('/articles/updateState?id='+id)
}
