import dormitoryHttp from "@/utils/dormitory";


export const dormitoryList = () => {
    return dormitoryHttp.get('/building/getAllDormitory')
}


export const buildList = () => {
    return dormitoryHttp.get('/building/getBuildList')
}

export const queryList = (params) => {
    return dormitoryHttp.post('/building/getQueryBuildList', params)
}


export const add = (params) => {
    return dormitoryHttp.post('/building/addBuild', params)
}

export const update = (params) => {
    return dormitoryHttp.post('/building/update', params)
}

export const deleteBuild = (buildId) => {
    return dormitoryHttp.get('/building/delete?buildId=' + buildId)
}

export const insertSurvey = (params) => {
    return dormitoryHttp.post('/survey/insertSurvey', params)
}


export const allocation = () => {
    return dormitoryHttp.get('/survey/test')
}


