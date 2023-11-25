<!--
 * @Author: LJH
 * @Date: 2023-08-01 15:06:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-21 15:23:48
-->
<template>
  <div class="previewPage">
    <div class="fileDiv" v-if="basicInfo.type=='img'">
      <img class="imgDiv" :src="basicInfo.fileUrl"/>
    </div>
    <div class="textDiv" v-else-if="basicInfo.type=='txt'" id="text">
    </div>
    <div class="shibaiDiv" v-else-if="basicInfo.type=='pdf'" @scroll="scrolling">
      <div class="pdfDivREf"  >
		    <vue-pdf-embed 
            :source="basicInfo.fileUrl" 
            v-for="i in basicInfo.numLoadPages" 
            :key="i"  
            :page="i">
		    </vue-pdf-embed>
	    </div>
    </div>
    <div class="videoDiv" v-else-if="basicInfo.type=='video'">
      <video :src="basicInfo.fileUrl" controls width="400"></video>
      <!-- <el-empty description="该类型不支持预览" /> -->
    </div>
    <div class="audioDiv" v-else-if="basicInfo.type=='audio'">
      <audio :src="basicInfo.fileUrl" id="myAudio" controls></audio>
    </div>
    <div class="notsupportDiv" v-else-if="basicInfo.type=='nosupport'">
      <el-empty description="暂不支持预览" />
    </div>
    <el-dialog title="文件预览" :fullscreen="true" v-model="basicInfo.showDetail" @close="guanbi" append-to-body>
      <div class="fullScreenDialog">
        <div class="fileDiv" v-if="basicInfo.type=='img'">
        <img class="imgDiv" :src="basicInfo.fileUrl"/>
      </div>
      <div class="textDiv" v-else-if="basicInfo.type=='txt'" v-html="basicInfo.textHtml">
      </div>
      <div class="shibaiDiv" v-else-if="basicInfo.type=='pdf'" @scroll="scrolling">
        <div class="pdfDivREf"  >
          <vue-pdf-embed 
              :source="basicInfo.fileUrl" 
              v-for="i in basicInfo.numLoadPages" 
              :key="i"  
              :page="i">
          </vue-pdf-embed>
        </div>
      </div>
      <div class="videoDiv" v-else-if="basicInfo.type=='video'">
        <video :src="basicInfo.fileUrl" controls width="400"></video>
        <!-- <el-empty description="该类型不支持预览" /> -->
      </div>
      <div class="audioDiv" v-else-if="basicInfo.type=='audio'">
        <audio :src="basicInfo.fileUrl" id="myAudio" controls></audio>
      </div>
      <div class="notsupportDiv" v-else-if="basicInfo.type=='nosupport'">
        <el-empty description="暂不支持预览" />
      </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>

import VuePdfEmbed from 'vue-pdf-embed'
import { createLoadingTask } from "vue3-pdfjs";
import * as pdfjsLib from 'pdfjs-dist'
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
// import 'pdfjs-dist/web/pdf_viewer.css'
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  watchEffect,
  reactive,
  getCurrentInstance,
  nextTick,
  toRefs,watch
} from "vue";
import { saveAs } from "file-saver";
import { get,previewFile ,downloadget} from "@/utils/api/requests";
import { useRouter,useRoute } from "vue-router";
import { ElMessage } from 'element-plus';
const route = useRoute();
const state = reactive({
        source: '', // 预览pdf文件地址
        pageNum: 0, // 当前页面
        scale: 1, // 缩放比例
        numPages: 0, // 总页数
        pdfCtx: null // pdf对象
    })
const props = defineProps({
  query: {
    type: Object,
    default: {},
  },
  fullScreen:{
    type:Boolean,
    default:false
  },
  code: {
    type: String,
    default: ''
  }
});

const basicInfo = reactive({
  isPdf:false,
  url:'',
  numLoadPages:1,
  numPages: 1,
  loadError:false,
  type: 'pdf',
  code:'',
  imgList: ['png','jpg'],
  imgUrl:"",
  pdfUrl:'',
  text: '',
  showDetail:false,
  textHtml:''
})
const typeObj = reactive({
  'png':'img',
  'jpeg':'img',
  'jpg':'img',
  'docx':'pdf',
  'pdf':'pdf',
  'doc':'pdf',
  '文本':'txt',
  'txt':'txt',
  'gif':'img',
  'zip':'nosupport',
  'video':'video',
  'rtf':'nosupport',
  'spl':'nosupport',
  'rar':'nosupport',
  'mp3':'audio',
  'xls':'nosupport',
  'xlsx':'nosupport',
  'pptx':'nosupport',
  'ppt':'nosupport',
  'mp4':'video',
  "webm":"video"
})
const myPdfRef = ref(null)
const previewText = (res)=>{
  let fileStream = res;
      // 创建一个FileReader对象
      let reader = new FileReader();
      // 定义FileReader的onload事件处理程序，用于在文件读取完成后展示文本内容
      reader.onload = function(e) {
        // 读取结果保存在e.target.result中
        let text = e.target.result;
        nextTick(()=>{
          let textElement = document.getElementById('text');
          textElement.innerHTML = text;
          basicInfo.textHtml = text;
        })
        // 将文本内容展示在页面上
      };
      // 开始读取文件流
      reader.readAsText(fileStream);
}
const emit = defineEmits(["changeFullStatus"]);
const guanbi = ()=>{
  basicInfo.showDetail = false;
  console.log('啊，没有改变吗？？？？')
  console.log(basicInfo.showDetail)
  emit("changeFullStatus",false)
}
const previewPdf = (res)=>{
  nextTick(()=>{
        let b = new Blob([res], {
          type: "application/pdf",
          });
          // 根据传入的参数b创建一个指向该参数对象的URL
        let url = URL.createObjectURL(b);
        basicInfo.fileUrl = url
        basicInfo.type = 'pdf'
        const loadingTask = createLoadingTask(url)
          loadingTask.promise.then(pdf => {
            basicInfo.numPages = pdf.numPages
            basicInfo.numLoadPages = pdf.numPages>4 ?4:pdf.numPages
          }).catch(err => {
            console.log(err,'err信息')
            ElMessage.error('解析失败')
          })
      })
}
// const imgUrl = ref(null)
const getPreviewContent = async()=>{
  const res = await previewFile(`/web/sys/file/preview/${basicInfo.code}`,{})
  handleFile(res)
}
const handleFile = (res)=> {
  if(basicInfo.type=='txt'){
    previewText(res)
  }else if(basicInfo.type=='pdf'){
    previewPdf(res)
  }else if(basicInfo.type==''){
  }else {
    let b = new Blob([res], {
			type: "application/vnd.ms-excel;charset=utf-8",
		});
		let url = URL.createObjectURL(b);
    basicInfo.fileUrl = url
  }
}
const getKnowledgeInfo = () => {
      const aa =props.query?props.query: route.query
      const {url,file_name} = aa;
      const code = aa.code;
      const fileType = aa.fileType;
      if(code&&fileType){
        basicInfo.code = code;
        basicInfo.type = typeObj[fileType]?typeObj[fileType]:'nosupport'
        if(basicInfo.type!='nosupport'){
          getPreviewContent()
        }
      }else if(url){
        const completeUrl = window.location.href
        const urlArray = completeUrl.split("url=")
        const trueUrl = urlArray[1]
        if(file_name){
          const fileType = file_name.split('.')[1]
          basicInfo.type = typeObj[fileType]
          previewByUrl(trueUrl)
        }else {
          basicInfo.type = 'nosupport'
          console.log('33')
          // ElMessage.info("缺少必要参数，不支持预览")
        }
      }else {
        basicInfo.type = 'nosupport'
        console.log('33')
        // ElMessage.info("缺少必要参数，不支持预览")
      }
}
const previewByUrl = async (url)=>{
  const res = await previewFile(`/web/sys/file/previewByUrl/${encodeURIComponent(encodeURIComponent(url))}`,{})
  handleFile(res)
}
const scrolling = (e) => {
  if (basicInfo.numLoadPages >= basicInfo.numPages) {
      return
  }
  if (basicInfo.numLoadPages + 4 > basicInfo.numPages) {
      basicInfo.numLoadPages = basicInfo.numPages
      return
  }
    const clientHeight = e.target.clientHeight
    const scrollHeight = e.target.scrollHeight
    const scrollTop = e.target.scrollTop
     
    if (scrollTop + clientHeight >= scrollHeight) {
      basicInfo.numLoadPages += 4
    } else {
    }
  }
const renderPdf = (num = 1) => {
  state.pdfCtx.getPage(num).then(page => {
      const canvas = document.getElementById(`pdfCanvas-${num}`)
      const ctx = canvas.getContext('2d')
      const viewport = page.getViewport(1.6)
      canvas.height = viewport.height
      canvas.width = viewport.width
      page.render({
          canvasContext: ctx,
          viewport: viewport
      })
      if (num < state.numPages) {
          renderPdf(num + 1)
      }
  })
}
watchEffect(() => {
  // console.log(props.code,'KKKKK')
  // console.log(props.query,'???')
 
});
watchEffect(()=>{
  console.log(props.fullScreen,'fullScreen')
  props.fullScreen?basicInfo.showDetail = true:basicInfo.showDetail = false;
  if(props.fullScreen){
    
  }
})
watch(()=>props.code,(newValue,oldValue)=>{
  console.log(props.code,'ppppppp')
  console.log(newValue,'00000000')
  // console.log(newValue,'ppppppp')
  // console.log(props.query,'??????')
	 if(props.code){
    getKnowledgeInfo()
  }
})
onMounted(()=>{
  const queryKeyArray = Object.keys(route.query)
  if(!(queryKeyArray.length==1&&queryKeyArray[0]=='id')&&queryKeyArray.length!=0){
    getKnowledgeInfo()
  }
  if(props.query.code||props.query.url){
    console.log('codecodecode')
    getKnowledgeInfo()
  }
})
</script>

<style lang="scss" scoped> 
.previewPage {
  width: 100%;
  height: 100%;
  overflow:hidden;
  text-align: left;
  box-sizing: border-box;
  display:flex;
  align-items: center;
  justify-content: center;
  .fileDiv {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow:auto;
    .imgDiv {
      
    }
  }
  .pdfDiv {
    width: 100%;
    height: 100%;
    overflow-y:auto;
  }
  .textDiv {
    width: 100%;
    height: 100%;
    overflow-y:auto ;
  }
  .shibaiDiv {
    width: 100%;
    height: 100%;
 
    font-size: 20px;
     overflow-y:auto;
  }
  .videoDiv {
    height: 100%;
    display:flex;
    align-items: center;
    justify-content: center;
    overflow-y:auto;
  }
}
.fullScreenDialog {
  height: 100%;
  padding: 30px;
  // width: 100vw;
  // height: 100vh;
}
</style>