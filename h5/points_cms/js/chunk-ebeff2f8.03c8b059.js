(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ebeff2f8","chunk-6e8ec1f9"],{"059a":function(t,e,a){},1313:function(t,e,a){"use strict";var i=a("059a"),l=a.n(i);l.a},"1cbf":function(t,e,a){},"20c0":function(t,e,a){},3355:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"info-item",class:{isBlock:t.block}},[a("label",[t._v(t._s(t.label))]),a("span",[t._t("default")],2)])},l=[],n={name:"info-item",props:{label:String,block:Boolean}},s=n,o=(a("1313"),a("2877")),r=Object(o["a"])(s,i,l,!1,null,"20dab72e",null);e["a"]=r.exports},"4c73":function(t,e,a){},"65f8":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"rule-detail"},[a("el-new-card",[a("template",{slot:"header"},[t._v(t._s(t.$route.meta.name))]),a("h5",{attrs:{title:"sub-title"}},[t._v("业务规则信息")]),a("info-block",[a("info-item",{attrs:{label:"规则ID："}},[t._v(t._s(t.info.ruleId))]),a("info-item",{attrs:{label:"规则名称："}},[t._v(t._s(t.info.ruleName))]),a("info-item",{attrs:{label:"应用活动数："}},[t._v(t._s(t.info.num))]),a("info-item",{attrs:{label:"规则说明："}},[t._v(t._s(t.info.desc))])],1),a("el-divider"),a("h5",{staticClass:"sub-title"},[t._v("用户行为列表")]),a("el-form",{ref:"searchForm",attrs:{inline:"",size:"small",model:t.searchForm}},[a("el-form-item",{attrs:{prop:"activity"}},[a("el-input",{attrs:{placeholder:"请输入活动名称"},model:{value:t.searchForm.activity,callback:function(e){t.$set(t.searchForm,"activity",e)},expression:"searchForm.activity"}})],1),a("el-form-item",{attrs:{prop:"dept"}},[a("el-select",{attrs:{placeholder:"请部门/异业合作企业"},model:{value:t.searchForm.dept,callback:function(e){t.$set(t.searchForm,"dept",e)},expression:"searchForm.dept"}},[a("el-option",{attrs:{label:"全部",value:1}}),a("el-option",{attrs:{label:"各业务部门名称",value:2}}),a("el-option",{attrs:{label:"各异业合作企业名称",value:3}})],1)],1),a("el-form-item",{attrs:{prop:"actType"}},[a("el-select",{attrs:{placeholder:"请选择活动类型"},model:{value:t.searchForm.actType,callback:function(e){t.$set(t.searchForm,"actType",e)},expression:"searchForm.actType"}},[a("el-option",{attrs:{label:"全部",value:1}}),a("el-option",{attrs:{label:"常规",value:2}}),a("el-option",{attrs:{label:"节点",value:3}})],1)],1),a("el-form-item",{attrs:{prop:"actSts"}},[a("el-select",{attrs:{placeholder:"请选择活动状态"},model:{value:t.searchForm.actSts,callback:function(e){t.$set(t.searchForm,"actSts",e)},expression:"searchForm.actSts"}},[a("el-option",{attrs:{label:"全部",value:1}}),a("el-option",{attrs:{label:"申请中",value:2}}),a("el-option",{attrs:{label:"已通过",value:3}}),a("el-option",{attrs:{label:"已开始",value:4}}),a("el-option",{attrs:{label:"已暂停",value:5}}),a("el-option",{attrs:{label:"已重启",value:6}}),a("el-option",{attrs:{label:"未通过",value:7}}),a("el-option",{attrs:{label:"已取消",value:8}}),a("el-option",{attrs:{label:"已编辑",value:9}}),a("el-option",{attrs:{label:"已结束",value:10}})],1)],1),a("el-form-item",[a("el-button",{attrs:{plain:"",type:"primary",icon:"el-icon-search"},on:{click:t.onSearch}},[t._v("查询")]),a("el-button",{attrs:{plain:"",icon:"el-icon-refresh-right"},on:{click:t.onReset}},[t._v("重置")])],1)],1),a("el-new-table",{ref:"table",attrs:{apiName:t.apiName}},[a("el-table-column",{attrs:{prop:"behavior",label:"用户行为",align:"center",width:"120px"}}),a("el-table-column",{attrs:{prop:"status",label:"规则状态",align:"center",width:"120px"}}),a("el-table-column",{attrs:{prop:"activity",label:"活动名称"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-link",{attrs:{type:"primary"},on:{click:function(a){return t.popupActIntro(e.row.actId)}}},[t._v(t._s(e.row.activity))])]}}])}),a("el-table-column",{attrs:{prop:"dept",label:"部门/企业名称",align:"center",width:"120px"}}),a("el-table-column",{attrs:{prop:"actType",label:"活动类型",align:"center",width:"120px"}}),a("el-table-column",{attrs:{prop:"actSts",label:"活动状态",align:"center",width:"120px"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{style:t._f("fmtActStatusColor")(e.row.actSts)},[t._v(t._s(t._f("fmtActStatus")(e.row.actSts)))])]}}])}),a("el-table-column",{attrs:{prop:"startTime",label:"开始时间",align:"center",width:"150px"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(t._f("fmtDateTime")(e.row.startTime))+" ")]}}])}),a("el-table-column",{attrs:{prop:"endTime",label:"结束时间",align:"center",width:"150px"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(t._f("fmtDateTime")(e.row.endTime))+" ")]}}])})],1)],2),a("popup-act-intro",{attrs:{visible:t.actIntroVisible,aid:t.selectedAId},on:{"update:visible":function(e){t.actIntroVisible=e}}})],1)},l=[],n=a("b1f8"),s=a("c78e"),o=a("fb55"),r=a("3355"),c=a("89b5"),u={name:"rule-detail",components:{ElNewCard:n["a"],ElNewTable:s["a"],InfoBlock:o["a"],InfoItem:r["a"],PopupActIntro:c["default"]},data:function(){return{apiName:"serviceGetRulesDetail",info:{ruleId:"",ruleName:"",num:"",desc:""},searchForm:{activity:"",dept:"",actType:"",actSts:""},list:[],listIndex:0,isLoading:!1,selectedAId:"",actIntroVisible:!1}},methods:{onSearch:function(){this.$refs.table.reset()},onReset:function(){this.$refs.searchForm.resetFields()},popupActIntro:function(t){this.selectedAId=t,this.actIntroVisible=!0}}},p=u,f=a("2877"),b=Object(f["a"])(p,i,l,!1,null,"f68a326a",null);e["default"]=b.exports},"89b5":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"popup-activity-intro",attrs:{title:"活动简介",visible:t.show,"destroy-on-close":""},on:{"update:visible":function(e){t.show=e},closed:t.onClose}},[a("info-block",[a("info-item",{attrs:{label:"活动名称："}},[t._v("活动1"),a("span",{staticClass:"status-point",staticStyle:{color:"#19be6b"}},[a("i",{staticStyle:{background:"#19be6b"}}),t._v("已开始")])]),a("info-item",{attrs:{label:"所属部门："}},[t._v("CF部")]),a("info-item",{attrs:{label:"积分账户："}},[t._v("CF部积分账户"),a("span",{staticClass:"status-point",staticStyle:{color:"#19be6b"}},[a("i",{staticStyle:{background:"#19be6b"}}),t._v("正常")])]),a("info-item",{attrs:{label:"担当："}},[t._v("担当1")])],1),a("info-block",[a("info-item",{attrs:{label:"业务归属："}},[t._v("客户业务")]),a("info-item",{attrs:{label:"活动模式："}},[t._v("线上")]),a("info-item",{attrs:{label:"活动类型："}},[t._v("常规")]),a("info-item",{attrs:{label:"平台："}},[t._v("App、小程序、H5")]),a("info-item",{attrs:{label:"开始时间："}},[t._v("2019-04-15 12:00")]),a("info-item",{attrs:{label:"结束时间："}},[t._v("2019-04-15 12:00")]),a("info-item",{attrs:{label:"累计活动天数："}},[t._v("28")])],1),a("info-block",[a("info-item",{attrs:{label:"申请人："}},[t._v("担当1")]),a("info-item",{attrs:{label:"申请时间："}},[t._v("2019-04-15 12:00")]),a("info-item",{attrs:{label:"审批时间："}},[t._v("2019-04-15 12:00")])],1),a("info-block",[a("info-item",{attrs:{label:"活动简介："}},[t._v("abc")])],1),a("div",{staticClass:"btns-box"},[a("el-button",{attrs:{size:"small",plain:"",icon:"el-icon-reading"},on:{click:function(e){return t.toActDetail(1)}}},[t._v("查看详情")])],1),a("el-divider"),a("div",{staticClass:"dialog-footer"},[a("el-button",{attrs:{size:"small",plain:""},on:{click:function(e){t.show=!1}}},[t._v("关 闭")])],1)],1)},l=[],n=(a("a9e3"),a("fb55")),s=a("3355"),o={name:"popup-activity-intro",model:{prop:"visible",event:"change"},components:{InfoBlock:n["a"],InfoItem:s["a"]},props:{visible:Boolean,aid:[Number,String]},data:function(){return{show:!1,loading:!1}},watch:{visible:function(t){this.show=t}},methods:{onClose:function(){this.$emit("update:visible",this.show)},toActDetail:function(t){this.$router.push({path:"/activityMgmt/actDetail",query:{id:t}})}}},r=o,c=(a("c5d5"),a("2877")),u=Object(c["a"])(r,i,l,!1,null,"31f2f93c",null);e["default"]=u.exports},"941f":function(t,e,a){"use strict";var i=a("df4c"),l=a.n(i);l.a},b1f8:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-card",{staticClass:"el-new-card",attrs:{shadow:"never"}},[t.$slots.header?a("div",{staticClass:"el-new-card-header",attrs:{slot:"header"},slot:"header"},[t._t("header")],2):t._e(),a("div",{staticClass:"el-new-card-body"},[t._t("default")],2)])},l=[],n={name:"el-new-card"},s=n,o=(a("ffb4"),a("2877")),r=Object(o["a"])(s,i,l,!1,null,"64b26a91",null);e["a"]=r.exports},c5d5:function(t,e,a){"use strict";var i=a("20c0"),l=a.n(i);l.a},c78e:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"pagination-table",class:"table-"+t.size},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.tableLoading,expression:"tableLoading"}],staticStyle:{width:"100%"},attrs:{data:t.list,stripe:"",size:t.size}},[a("el-table-column",{attrs:{label:"序号",align:"center",type:"index",index:t.dataIndex}}),t._t("default")],2),a("div",{staticClass:"pagination-table-pgn"},[a("el-pagination",{attrs:{background:"",layout:"prev, pager, next, sizes","page-sizes":[10,20,50],"page-size":t.pageSize,"current-page":t.pageNum,total:t.total},on:{"size-change":t.onSizeChange,"current-change":t.onCurrentChange}})],1)],1)},l=[],n=(a("a9e3"),a("d3b7"),{name:"pagination-table",props:{apiName:String,data:Object,options:Object,sucFn:Function,errFn:Function,beforeRender:Function,type:{type:String,default:"page"},size:{type:String,default:"medium"}},data:function(){return{tableLoading:!1,list:[],pageNum:1,pageSize:10,total:0}},watch:{$route:function(t,e){t.matched.length<=2&&e.matched.length>2?this.getPageList():this.changePathHash("replace")}},created:function(){var t=this.$route.query;this.pageNum=Number(t.pageNum||1),this.pageSize=Number(t.pageSize||10),this.getPageList(),this.changePathHash("replace")},methods:{getPageList:function(){var t=this;this.tableLoading=!0,this.$http[this.apiName](Object.assign({},{pageNum:this.pageNum,pageSize:this.pageSize},this.data),this.options).then((function(e){t.pageNum=e.pageNum,t.pageSize=e.pageSize,t.total=e.total,t.list=t.beforeRender?t.beforeRender(e.list):e.list,t.sucFn&&t.sucFn(t.list)})).catch((function(e){t.errFn(e)})).finally((function(){t.tableLoading=!1}))},onCurrentChange:function(t){this.pageNum=t,this.getPageList(),this.changePathHash()},onSizeChange:function(t){this.pageSize=t,this.reset()},reset:function(){this.onCurrentChange(1)},changePathHash:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"push";if("popup"!==this.type){var e=this.$route.query;this.pageNum===Number(e.pageNum)&&this.pageSize===Number(e.pageSize)||this.$router[t]({path:this.$route.path,query:Object.assign({},this.$route.query,{pageNum:this.pageNum,pageSize:this.pageSize})})}},dataIndex:function(t){return(this.pageNum-1)*this.pageSize+t+1}}}),s=n,o=(a("ec24"),a("2877")),r=Object(o["a"])(s,i,l,!1,null,"5bb51c52",null);e["a"]=r.exports},df4c:function(t,e,a){},ec24:function(t,e,a){"use strict";var i=a("1cbf"),l=a.n(i);l.a},fb55:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"info-block"},[t._t("default")],2)},l=[],n={name:"info-block"},s=n,o=(a("941f"),a("2877")),r=Object(o["a"])(s,i,l,!1,null,"343a3291",null);e["a"]=r.exports},ffb4:function(t,e,a){"use strict";var i=a("4c73"),l=a.n(i);l.a}}]);
//# sourceMappingURL=chunk-ebeff2f8.03c8b059.js.map