import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
// 全局封装组件
export default {
    install(Vue) {
        Vue.component('PageTools', PageTools)
        Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
        Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    }
}