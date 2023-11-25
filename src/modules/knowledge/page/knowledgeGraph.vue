<!--
 * @Author: LJH
 * @Date: 2023-08-24 11:24:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-09-14 14:46:05
-->
<template>
  <div class="knowledgeGraph">
    <div class="graphDiv" >
        <div class="searchInput">
            <el-input v-model="basicInfo.searchName" @change="search" style="width:300px" @keydown.enter="search" placeholder="请搜索知识名称">
                <template #suffix>
                    <el-icon @click="search"><Search /></el-icon>
                </template>
            </el-input>
        </div>
        <div class="graphContent" :style="basicInfo.isKeydown?'cursor:pointer':'cursor:default'">
            <div id="threegraph" ></div>
        </div>
        <!-- <div class="graphBtn">
            <div @click="initDiv" class="graphBtnItem">
                <img src="../assets/init_icon.png" alt=""  class="initImg">
                <span>归位</span>
            </div>
            <div>
            
            </div>
       </div> -->
    </div>
    <div class="graphBasicInfo" v-loading="basicInfo.isLoading">
        <div class="graphInfo">
            <div class="knowledgeName">
                <img src="../assets/greenIcon.png" alt="">
                <span>{{ knowledgeDetail.name }}</span>
            </div>
            <div class="leftBorder">属性信息</div>
            <div class="infoDiv">
                <div class="infoItem">
                    <div class="infoLabel">专辑信息</div>
                    <div class="infoValue">{{  knowledgeDetail.albumName}}</div>
                </div>
                <div class="infoItem">
                    <div class="infoLabel">标签</div>
                    <div class="infoValue">
                        <el-button v-for="item in knowledgeDetail.labelList" :key="item.id" :type="basicInfo.tabId==item.id?'primary':'null'" @click="selectLabel(item.id)">{{ item.name }}</el-button>
                    </div>
                </div>
                <div class="infoItem">
                    <div class="infoLabel">描述</div>
                    <div class="infoValue">
                        {{  knowledgeDetail.description}}
                    </div>
                </div>
                <div class="infoItem">
                    <div class="infoLabel">知识ID</div>
                    <div class="infoValue">
                        {{  knowledgeDetail.code}}
                    </div>
                </div>
                <div class="infoItem">
                    <div class="infoLabel">知识专辑</div>
                    <div class="infoValue">
                        {{  knowledgeDetail.albumName}}
                    </div>
                </div>
            </div>
        <div class="leftBorder">详细内容</div>
        <div class="thumbnailImg" @click="goDetail">
            <img :src="knowledgeDetail.thumbnailUrl" v-if="knowledgeDetail.thumbnailUrl"/> 
            <el-empty description="暂无缩略图" v-else></el-empty>
        </div>
        </div>
    </div>
  </div>
</template>

<script setup >
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
  toRefs
} from "vue";
import { get,previewFile} from "@/utils/api/requests";
import { useRouter,useRoute } from "vue-router";
import { ElMessage } from 'element-plus';
import ForceGraph3D from "3d-force-graph";
import SpriteText from 'three-spritetext'
import { defineComponent } from "vue";
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import {CSS2DRenderer,CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
// import blueIcon from "../assets/blueIcon.png"
// import greIcon from "../assets/greIcon.png"
// import rootImg from "../assets/rootImg.png"
// import highBlue from "../assets/highBlue.png"
// import highGreen from "../assets/highGreen.png"

import * as THREE from 'three'
let myGraph;

const basicInfo = reactive({
    graphList: [], 
    searchName: '',
    noRepeatList: [],
    linkList:[],
    detailId:null,
    tabId:null,
    distanceList: [1000,500,100],
    selectLabelId:null,
    labelKnowledgeList:[],
    isKeydown:false,
    isLoading: true
})
const basicData = {
    graphList: [],
    labelKnowledgeList:[],
}
const knowledgeDetail = reactive({
    name:'',
    fileType: '',
    id:null,
    albumName: '',
    description:'',
    code:'',
    labelList:[],
    thumbnailUrl: '',
    file:{

    }
})

const selectLabel = async(id)=>{
    if(id==basicInfo.tabId){
        basicInfo.tabId = null
        basicInfo.selectLabelId = null
        basicInfo.labelKnowledgeList = []
        myGraph.graphData().nodes.forEach(n => {
            n.color = colorList[n.colorIndex];
        })
    }else {
        basicInfo.tabId = id;
        basicInfo.selectLabelId = id+'_2'
        let res = await get('/web/knowledge/searchKnowledgeByLabel?labelId='+id,{})
        basicInfo.labelKnowledgeList = res.data||[];
        myGraph.graphData().nodes.forEach(n => {
            console.log(basicInfo.labelKnowledgeList.includes(n.id),'pppp')
            if (basicInfo.labelKnowledgeList.includes(n.trueId)) {
                n.color = colorList[n.colorIndex]
            }else {
                n.color = transparencyColorList[n.colorIndex]
            }
        })
    }
    myGraph.refresh();
}
const highlightNodes = new Set()
let colorList=["#90B1FF","#FCB342","#FF9494","#61DD71","#00F6DF","#F12BFF","#9B64FF","#F6E53D","#F8B34D","#A6F03A","#78D3F7","#46BEFF","#F9E87A"]
let transparencyColorList = ["#eff4ff","#fff4e3","#ffefef","#e8faea","#d9fefa","#fddfff","#f0e8ff","#fefbe2","#fef4e5","#f2fde2","#ebf9fe","#e4f6ff","#fef4e5"]
const randomColor = ()=>{
    const num = Math.round(Math.random() * (13))
    return colorList[num]||"#90B1FF"
}
// const search
const getnoRepeatList = (data)=>{
    const noRepeatList = [];
    const linksList = []
    data.map(item=>{
        if(!noRepeatList.includes(item.pid1)){
            noRepeatList.push(item.pid1)
            const num = Math.round(Math.random() * (12))
            const obj = {
                trueId: item.id,
                id: item.pid1,
                name: item.name,
                indexName:item.indexName?item.indexName:'',
                level: item.level,
                color:colorList[num],
                colorIndex: num
            }
            linksList.push(obj)
        }
    })
    return linksList;
}
const goDetail = ()=>{
    const url = window.location.origin + window.location.pathname + '#/previewPage?code=' + knowledgeDetail.fileCode+'&type='+knowledgeDetail.fileType
    window.open(url)
}
const getrelation = (data)=>{
    const relationList = []
    let onceId = null;
    let once = false;
    data.map(item=>{
        if(item.type==1&&!once){
            onceId = item.id
            once = true
        }
        if(item.pid2){
            relationList.push({
                ...item,
                source: item.pid2,
                target:item.pid1
            }) 
        }
       
    })
    if(onceId){
        basicInfo.detailId = onceId
    }
    return relationList
}
let zIndex = 0;
let onceStatus =false;

watchEffect(() => {
    const detailId = basicInfo.detailId;
    if(!detailId) return;
    else getKnowledgeDetail(detailId)
})
const search = ()=>{
    console.log('null')
    console.log(myGraph)
    if(!basicInfo.searchName){
        myGraph.graphData().nodes.forEach(n => {
            n.color = colorList[n.colorIndex]
        })
    }else {
        myGraph.graphData().nodes.forEach(n => {
            if (n.name.indexOf(basicInfo.searchName)==-1) {
                n.color = transparencyColorList[n.colorIndex]
            }else {
                n.color = colorList[n.colorIndex]
            }
        })
    }
    myGraph.refresh();
}
const getNodeList = (data)=>{
    const noRepeatList = getnoRepeatList(data)
    const links= getrelation(data)
    return {
        nodes: noRepeatList,
        links
    }
}
const initDiv = ()=>{
    basicInfo.tabId = null;
    basicInfo.labelKnowledgeList = [];
    init()
}
// 初始化地图
const init = ()=>{
    const list = [...basicInfo.graphList]//数据不能绑定在vue双向绑定上
    let chartOptions = getNodeList(list)
    const elm = document.getElementById("threegraph");
    const width = elm.offsetWidth;
    const height = elm.offsetHeight;
    myGraph = ForceGraph3D(
)(document.getElementById(`threegraph`)||document.createElement("div"))
    myGraph
    .width(width)
    .height(height)
    .graphData(chartOptions)
    .backgroundColor('white')
    .nodeColor(node =>node.color)
    .enableNavigationControls(false)
    .nodeResolution(12)
    .nodeRelSize(20)
    .nodeLabel((node)=>`<div class='node-label2'>${node.name}</div>`)
    .nodeThreeObject(node=>{
        let textId = node.id.split('_')
        let  type = textId[1]
    
        const sprite = new SpriteText(node.name.substring(0,2));
        sprite.material.depthWrite = true; // make sprite background transparent
        sprite.color = '#273A5B'
        sprite.textHeight = 8;
        const group = new THREE.Group()
        if(type==2){
            const item1 = new THREE.Mesh(
                // new THREE.BoxGeometry(16,22,12),
                new THREE.DodecahedronGeometry(16),
                new THREE.MeshLambertMaterial({
                    color: node.color,
                    transparent: true,
                    opacity:0.7,
                    refractionRatio:0.8
                })
            )
            group.add(sprite)
            group.add(item1)
        }else {
            const item2 = new THREE.Mesh(
                // new THREE.BoxGeometry(16,22,12),
                new THREE.SphereGeometry(14),
                new THREE.MeshLambertMaterial({
                    color: node.color,
                    transparent: true,
                    opacity:0.7,
                    refractionRatio:0.8
                })
            )
            group.add(sprite)
            group.add(item2)
        }
        return group
    })
    .nodeThreeObjectExtend(false)
    .linkOpacity(0.5)
    .linkLabel((node)=>`<div class='node-label2'>${node.indexName?node.indexName:''}</div>`)
    .linkThreeObject(link=>{
        let sprite = new SpriteText(`${link.indexName?link.indexName:''}`);
        // const sprite = new SpriteText(`${link.name.substring(0,4)}`);
          sprite.color = '#3B80FD';
          sprite.textHeight = 4;
          return sprite;
    })
    .linkPositionUpdate((sprite, { start, end }) => {
          let middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
            [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
          })));
          Object.assign(sprite.position, middlePos);
        }).linkThreeObjectExtend(true).linkWidth(1.5)
    .linkCurvature(0.6)
    // .linkDirectionalArrowLength(6)
    // .linkDirectionalArrowRelPos(1)
    .onNodeClick((node) => {//点击事件
        let textId = node.id.split('_')
        let trueId = textId[0]
        let type = textId[1]
        if(type==2) return;//专辑禁止点击
        if(!node) return;
        if(highlightNodes.has(node)){
            highlightNodes.clear()
            myGraph.graphData().nodes.forEach(n => {
                n.color = colorList[n.colorIndex]
            })
            node.color = colorList[node.colorIndex]
        }else {
            
            highlightNodes.add(node);
            myGraph.graphData().nodes.forEach(n => {
            if (n.id !== node.id) {
                n.color = transparencyColorList[n.colorIndex]
            }})
            basicInfo.isLoading = true;
            getKnowledgeDetail(trueId)
            node.color = colorList[node.colorIndex]
        }
        myGraph.refresh();
    })
    .d3Force('charge').strength((node)=>{
            return -1000
          })
    
    // const bloomPass = new UnrealBloomPass();
    // bloomPass.strength = 3;
    // bloomPass.radius = 1;
    // bloomPass.threshold = 0.1;
    // myGraph.postProcessingComposer().addPass(bloomPass)

    // myGraph.onEngineStop(async() =>{
    //     if(!onceStatus){
    //         await myGraph.zoomToFit(300)
    //         let timer = setTimeout(()=>{
    //             zIndex = Math.floor(myGraph.camera().position.z)
    //             console.log(zIndex)
    //             clearInterval(timer)
    //         },1000)
    //         onceStatus = true;
    //     }
    // });
    // document.getElementById("threegraph").addEventListener('wheel',function(){
    //   const z =  myGraph.camera().position.z
    //  if(z>zIndex&&zIndex!=0){
    //     myGraph.camera().position.z = zIndex
    //  }
    // })
    
    // myGraph.onBackgroundClick(node=>{
    //     console.log('back')
    // })
// 
}

const getGraphInfo = ()=>{
    get('/web/knowledge/atlas',{}).then(res=>{
        basicInfo.graphList = res.data;
        init()
    })
}
const getKnowledgeDetail = (id)=>{
    get("/web/knowledge/homePage/detail?id=" + id, {}).then((res) => {
        const data = res.data;
        Object.assign(knowledgeDetail,data)
        basicInfo.isLoading = false;
        getThumbnail(data.fileCode)
    })
}
const getThumbnail = (code)=>{
    previewFile(`/web/sys/file/preview/thumbnail/${code}`).then(res=>{
        let b = new Blob([res], {
			type: "application/vnd.ms-excel;charset=utf-8",
		});
		let url = URL.createObjectURL(b);
        knowledgeDetail.thumbnailUrl = url;
    }).catch(err=>{
        knowledgeDetail.thumbnailUrl = ''
    })
}

onMounted(()=>{
    nextTick(()=>{
        getGraphInfo()
         window.addEventListener('keydown',function(e){
            if(myGraph){
                if(e.keyCode!=32)return;
                if(basicInfo.isKeydown) return;
                basicInfo.isKeydown = true
                console.log(basicInfo.isKeydown,'pppp')
                myGraph.enableNavigationControls(true)
                myGraph.refresh()
            }
        })
        window.addEventListener('keyup',function(e){
            if(myGraph){
                if(e.keyCode!=32)return;
                if(!basicInfo.isKeydown)return;
                basicInfo.isKeydown = false;
                myGraph.enableNavigationControls(false)
                myGraph.refresh()
            }
        })
    })
})
</script>

<style lang="scss" scoped>
    .knowledgeGraph {
        width: 100%;
        height: 100%;
        overflow:hidden;
        display:flex;
         .searchInput {
            display: flex;
            align-items: center;
            margin-bottom:10px;
            .opeBtn {
                margin-left: 6px;
                font-size: 12px;
                color:#3B80FD;
                cursor: pointer;
            }
            :deep(.el-input__wrapper) {
            border-radius: 20px !important;
            
            }
        }
        .graphDiv {
            width: 70%;
            height: 100%;
            background:rgba(31, 37, 47, 0.08);
            position:relative;
            .searchInput {
                background:white;
                height: 50px;
                display:flex;
                align-items: center;
                padding-left: 20px;
            }
            .graphContent {
                margin: 20px;
                width: calc(100% - 40px);
                height: calc(100% - 50px);
                #threegraph {
                    width: 100%; 
                    height: 100%;
                }
            }
            .graphBtn {
                background:white;
                width: 235px;
                height: 40px;
                border: 1px solid rgba(151, 151, 151, 0.6);
                border-radius:2px;
                position: absolute;
                bottom: 20px;
                right: 40px;
                cursor:pointer;
                .initImg {
                    margin: 6px;
                    cursor:pointer;
                }
                .graphBtnItem {
                    display:flex;
                    align-items: center;
                    // border-right: 1px solid rgba(151, 151, 151, 0.6);
                }
            }
        }
        .graphBasicInfo {
            width: 30%;
            height: 100%;
            border-left: 1px solid #E1E4E8;
            overflow-y:auto ;
        }
        .graphInfo {
            width:100%;
            background:white;
            padding: 16px;
            .knowledgeName {
                border-bottom: rgba(225, 228, 232, 1);
                color:rgba(33, 37, 45, 1);
                font-weight: bold;
                display:flex;
                align-items: center;
                img {
                    width: 32px;
                    height: 32px;
                    margin-right: 10px;
                }
                span {
                    flex:1;
                     overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .infoDiv {
                width: 100%;
                box-sizing: border-box;
                border-top: 1px solid rgba(31, 37, 47, 0.08);
                border-left: 1px solid rgba(31, 37, 47, 0.08);
                .infoItem {
                    display:flex;
                    font-size: 14px;
                    .infoLabel {
                        width: 120px;
                        font-weight: 600;
                        padding: 12px;
                        border-bottom: 1px solid rgba(31, 37, 47, 0.08);
                        border-right: 1px solid rgba(31, 37, 47, 0.08);
                        background:rgba(31, 37, 47, 0.08);
                    }
                    .infoValue {
                        flex:1;
                        padding: 12px;
                        border-bottom: 1px solid rgba(31, 37, 47, 0.08);
                        border-right: 1px solid rgba(31, 37, 47, 0.08);
                        word-break: break-all;
                    }
                }
            }
            .leftBorder {
                color:rgba(33, 37, 45, 1);
                border-left: 2px solid rgba(59, 128, 253, 1);
                padding-left: 10px;
                font-weight: bold;
                height: 20px;
                line-height: 20px;
                margin: 20px 0 16px;
            }
            .thumbnailImg {
                cursor: pointer;
                background: rgba(108, 121, 143, 0.08);
                padding:16px;
                // color:rgba(59, 128, 253, 1) ;
            }
        }
    }
</style>
<style>
.node-label {
      font-size: 10px;
      padding: 1px 4px;
      border-radius: 4px;
      /* background-color: rgba(0,0,0,0.5); */
      user-select: none;
    }
    .node-label2 {
        color:#273A5B;
    }
</style>