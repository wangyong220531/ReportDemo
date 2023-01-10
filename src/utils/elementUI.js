import Vue from "vue"
import { Card, Tabs, TabPane, Message, Collapse, CollapseItem, Popconfirm, Button, Select, Option, Input, Tree, Dialog, Footer, Tag } from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

Vue.use(Card)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Popconfirm)
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Tree)
Vue.use(Dialog)
Vue.use(Footer)
Vue.use(Tag)

Vue.prototype.$message = Message
