import it from "element-ui/src/locale/lang/it";
import Cookie from "js-cookie";

export default {
    state: {
        isCollapse: false,//控制菜单展开还是收起

        tabsList: [
            {
                path: '/',
                name: 'home',
                label: '首页',
                icon: 's-home',
                url: 'Home/Home'
            }
        ],//面包屑
        menu: []
    },
    mutations: {
        //修改菜单展开收起的方法
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse
        },
        //更新面包屑数据
        selectMenu(state, val) {

            if (val.name !== 'home') {
                const index = state.tabsList.findIndex(item => item.name === val.name)
                console.log(val);

                if (index === -1) {
                    state.tabsList.push(val)

                    console.log(state.tabsList);
                }
            }
        },
        //删除指定tags数据
        closeTag(state, item) {
            console.log(item, '测试')
            const index = state.tabsList.findIndex(val => val.name === item.name)
            state.tabsList.splice(index, 1)
        },
        setMenu(state, val) {
            state.menu = val
            Cookie.set('menu', JSON.stringify(val))
        },
        //动态注册路由
        addMenu(state, router) {
            //判断缓存中是否有数据
            if (!Cookie.get('menu')) return

            const menu = JSON.parse(Cookie.get('menu'))


            state.menu = menu

            //组装动态路由的数据
            const menuArray = []
            menu.forEach(item => {
                if(item.children.length === 0){
                    delete item.children
                }

                if (item.children) {
                    console.log(item.children)
                    item.children = item.children.map(item => {
                        item.component = () => import(`../views/${item.url}`)
                        return item
                    })
                    menuArray.push(...item.children)
                } else{
                    item.component = () => import(`../views/${item.url}`)
                    menuArray.push(item)
                }
            })

            console.log(menuArray, 'menuArray')
            //路由动态添加
            menuArray.forEach(item => {
                router.addRoute('Main', item)
            })


        }
    }
}
