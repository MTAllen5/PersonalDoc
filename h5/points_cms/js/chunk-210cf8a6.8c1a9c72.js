(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-210cf8a6"],{"4c73":function(e,t,r){},"55d6":function(e,t,r){"use strict";var i=r("d723"),n=r.n(i);n.a},6219:function(e,t,r){"use strict";var i=r("a124"),n=r.n(i);n.a},"64ce":function(e,t,r){},7008:function(e,t,r){"use strict";var i=r("64ce"),n=r.n(i);n.a},a124:function(e,t,r){},a434:function(e,t,r){"use strict";var i=r("23e7"),n=r("23cb"),a=r("a691"),o=r("50c4"),l=r("7b0b"),s=r("65f0"),c=r("8418"),u=r("1dde"),m=r("ae40"),p=u("splice"),d=m("splice",{ACCESSORS:!0,0:0,1:2}),f=Math.max,g=Math.min,b=9007199254740991,h="Maximum allowed length exceeded";i({target:"Array",proto:!0,forced:!p||!d},{splice:function(e,t){var r,i,u,m,p,d,v=l(this),x=o(v.length),_=n(e,x),y=arguments.length;if(0===y?r=i=0:1===y?(r=0,i=x-_):(r=y-2,i=g(f(a(t),0),x-_)),x+r-i>b)throw TypeError(h);for(u=s(v,i),m=0;m<i;m++)p=_+m,p in v&&c(u,m,v[p]);if(u.length=i,r<i){for(m=_;m<x-i;m++)p=m+i,d=m+r,p in v?v[d]=v[p]:delete v[d];for(m=x;m>x-i+r;m--)delete v[m-1]}else if(r>i)for(m=x-i;m>_;m--)p=m+i-1,d=m+r-1,p in v?v[d]=v[p]:delete v[d];for(m=0;m<r;m++)v[m+_]=arguments[m+2];return v.length=x-i+r,u}})},b1f8:function(e,t,r){"use strict";var i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("el-card",{staticClass:"el-new-card",attrs:{shadow:"never"}},[e.$slots.header?r("div",{staticClass:"el-new-card-header",attrs:{slot:"header"},slot:"header"},[e._t("header")],2):e._e(),r("div",{staticClass:"el-new-card-body"},[e._t("default")],2)])},n=[],a={name:"el-new-card"},o=a,l=(r("ffb4"),r("2877")),s=Object(l["a"])(o,i,n,!1,null,"64b26a91",null);t["a"]=s.exports},b653:function(e,t,r){"use strict";var i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("span",{staticClass:"sts-icon",class:e._f("fmtStatusColor")(e.status),style:{marginLeft:e.point?"20px":0}},[e.point&&void 0!==e.status?r("i"):e._e(),e._v(e._s(e._f("fmtStatus")(e.status))+" ")])},n=[],a=(r("a9e3"),{2:"申请中",3:"已编辑",4:"未通过",5:"已取消"}),o={name:"acct-appl-sts-icon",props:{status:[Number,String],point:Boolean},filters:{fmtStatus:function(e){return void 0===e?"":a[e]?a[e]:"未知"},fmtStatusColor:function(e){arguments.length>1&&void 0!==arguments[1]&&arguments[1];switch(a[e]){case"申请中":case"已编辑":return"color-orange";case"未通过":return"color-red";case"已取消":return"color-black";default:return"color-black"}}}},l=o,s=(r("55d6"),r("2877")),c=Object(s["a"])(l,i,n,!1,null,"8086844c",null);t["a"]=c.exports},bdb7:function(e,t,r){"use strict";r.r(t);var i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"edit-account-appliaction"},[r("el-new-card",{directives:[{name:"loading",rawName:"v-loading",value:e.isLoading,expression:"isLoading"}]},[r("template",{slot:"header"},[r("div",{staticClass:"flex-vertical-center"},[e._v(" "+e._s(e.$route.meta.name)+" "),r("span",{staticClass:"desc"},[r("i",[e._v("*")]),e._v(" 为必填项")]),e.isEditPage?r("acct-appl-sts-icon",{attrs:{status:e.form.status,point:""}}):e._e()],1)]),r("el-form",{directives:[{name:"loading",rawName:"v-loading.lock",value:e.isSubmiting,expression:"isSubmiting",modifiers:{lock:!0}}],ref:"form",attrs:{"element-loading-text":"提交中...","label-width":"180px","inline-message":"",model:e.form,rules:0===e.form.type?e.rules1:e.rules2,"hide-required-asterisk":!1}},[r("h5",{staticClass:"sub-title"},[e._v("基本信息")]),r("el-form-item",{attrs:{label:"类型:",prop:"type"}},[r("el-radio-group",{model:{value:e.form.type,callback:function(t){e.$set(e.form,"type",t)},expression:"form.type"}},[r("el-radio",{attrs:{label:0}},[e._v("GTMC业务部门")]),r("el-radio",{attrs:{label:1}},[e._v("异业合作企业")])],1)],1),r("el-form-item",{attrs:{label:"积分账户名称:",prop:"account"}},[r("el-input",{attrs:{placeholder:"请输入积分账户名称"},model:{value:e.form.account,callback:function(t){e.$set(e.form,"account",t)},expression:"form.account"}})],1),r("div",{directives:[{name:"show",rawName:"v-show",value:0===e.form.type,expression:"form.type === 0"}]},[r("el-form-item",{attrs:{label:"选择部门:",prop:"deptId"}},[r("el-select",{attrs:{placeholder:"请选择部门",loading:e.deptLoading},on:{"visible-change":e.getDeptList},model:{value:e.form.deptId,callback:function(t){e.$set(e.form,"deptId",t)},expression:"form.deptId"}},e._l(e.deptOptions,(function(e){return r("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1)],1),r("el-form-item",{attrs:{label:"员工号:",prop:"employeeId"}},[r("el-input",{attrs:{placeholder:"请输入积分账户名称"},model:{value:e.form.employeeId,callback:function(t){e.$set(e.form,"employeeId",t)},expression:"form.employeeId"}})],1),r("el-form-item",{attrs:{label:"姓名:"}},[e._v(e._s(e.form.empContact))]),r("el-form-item",{attrs:{label:"手机号:"}},[e._v(e._s(e.form.empMobile))]),r("el-form-item",{attrs:{label:"邮箱:"}},[e._v(e._s(e.form.empEmail))])],1),r("div",{directives:[{name:"show",rawName:"v-show",value:1===e.form.type,expression:"form.type === 1"}]},[r("el-form-item",{attrs:{label:"所属:",prop:"ownership"}},[r("el-select",{attrs:{placeholder:"请选择所属关系"},model:{value:e.form.ownership,callback:function(t){e.$set(e.form,"ownership",t)},expression:"form.ownership"}},e._l(e.ownershipOptions,(function(e){return r("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1)],1),r("el-form-item",{attrs:{label:"企业名称:",prop:"entName"}},[r("el-input",{attrs:{placeholder:"请输入企业名称"},model:{value:e.form.entName,callback:function(t){e.$set(e.form,"entName",t)},expression:"form.entName"}})],1),r("el-form-item",{attrs:{label:"联系人姓名:",prop:"contact"}},[r("el-input",{attrs:{placeholder:"请输入联系人姓名"},model:{value:e.form.contact,callback:function(t){e.$set(e.form,"contact",t)},expression:"form.contact"}})],1),r("el-form-item",{attrs:{label:"手机号:",prop:"mobile"}},[r("el-input",{attrs:{placeholder:"请输入联系人手机号"},model:{value:e.form.mobile,callback:function(t){e.$set(e.form,"mobile",t)},expression:"form.mobile"}})],1),r("el-form-item",{attrs:{label:"邮箱:",prop:"email"}},[r("el-input",{attrs:{placeholder:"请输入联系人邮箱"},model:{value:e.form.email,callback:function(t){e.$set(e.form,"email",t)},expression:"form.email"}})],1)],1),r("el-divider"),r("h5",{staticClass:"sub-title"},[e._v("额度配置")]),r("el-form-item",{attrs:{label:"预算费用（元）:",prop:"budget"}},[r("el-input",{attrs:{placeholder:"请输入账户预算金额，单位：元"},model:{value:e.form.budget,callback:function(t){e.$set(e.form,"budget",t)},expression:"form.budget"}})],1),r("el-form-item",{attrs:{label:"预算额度:",prop:"budgetAmount"}},[r("el-input",{attrs:{placeholder:"请输入账户预算额度"},model:{value:e.form.budgetAmount,callback:function(t){e.$set(e.form,"budgetAmount",t)},expression:"form.budgetAmount"}})],1),r("el-form-item",{attrs:{label:"预算额度警戒线（%）:",prop:"budgetAmountLine"}},[r("el-input",{attrs:{placeholder:"请输入账户预算额度警戒值"},model:{value:e.form.budgetAmountLine,callback:function(t){e.$set(e.form,"budgetAmountLine",e._n(t))},expression:"form.budgetAmountLine"}})],1),r("el-form-item",{attrs:{label:"备用金（元）:",prop:"imprest"}},[r("el-input",{attrs:{placeholder:"请输入账户备用金额，单位：元"},model:{value:e.form.imprest,callback:function(t){e.$set(e.form,"imprest",t)},expression:"form.imprest"}})],1),r("el-form-item",{attrs:{label:"备用额度:",prop:"imprestAmount"}},[r("el-input",{attrs:{placeholder:"请输入账户备用额度"},model:{value:e.form.imprestAmount,callback:function(t){e.$set(e.form,"imprestAmount",t)},expression:"form.imprestAmount"}})],1),r("el-form-item",{attrs:{label:"备用额度警戒线（%）:",prop:"imprestAmountLine"}},[r("el-input",{attrs:{placeholder:"请输入账户备用额度警戒线"},model:{value:e.form.imprestAmountLine,callback:function(t){e.$set(e.form,"imprestAmountLine",e._n(t))},expression:"form.imprestAmountLine"}})],1),r("el-divider"),r("h5",{staticClass:"sub-title"},[e._v("附件上传")]),r("attachment",{attrs:{list:e.form.attachment},on:{"update:list":function(t){return e.$set(e.form,"attachment",t)}}}),r("el-divider"),r("el-form-item",[r("el-button",{on:{click:e.onCancel}},[e._v("取 消")]),r("el-button",{attrs:{type:"primary",disabled:!e.canSubmited},on:{click:e.onVerily}},[e._v(e._s(e.isEditPage?"保 存":"提 交"))])],1)],1)],2)],1)},n=[],a=(r("d81d"),r("b0c0"),r("d3b7"),r("ac1f"),r("5319"),r("5530")),o=r("b1f8"),l=r("f509"),s=r("b653"),c={name:"edit-account-application",components:{ElNewCard:o["a"],Attachment:l["a"],AcctApplStsIcon:s["a"]},data:function(){var e=this,t=function(t,r,i){e.canSubmited=!1,e.acctDupCheck(r).then((function(e){i()})).catch((function(e){i(new Error(e.message))})).finally((function(){e.canSubmited=!0}))},r=function(t,r,i){e.canSubmited=!1,e.searchEmployee(r).then((function(t){e.form.empContact=t.name,e.form.empMobile=t.mobile,e.form.empEmail=t.email,i()})).catch((function(t){e.form.empContact="",e.form.empMobile="",e.form.empEmail="",i(new Error(t.message))})).finally((function(){e.canSubmited=!0}))},i=function(t,r,i){e.canSubmited=!1,e.enterDupCheck(r).then((function(e){i()})).catch((function(e){i(new Error(e.message))})).finally((function(){e.canSubmited=!0}))},n={type:[{required:!0,message:"请选择账户类型",trigger:"change"}],account:[{required:!0,max:50,message:"请填写积分账户名称，长度不能超出50个汉字",trigger:"blur"},{validator:t,trigger:"blur"}],budget:[{required:!0,pattern:/^\d{1,15}$/,message:"请填写整数数字，长度不能超出15个数字",trigger:"blur"}],budgetAmount:[{required:!0,pattern:/^\d{1,15}$/,message:"请填写整数数字，长度不能超出15个数字",trigger:"blur"}],budgetAmountLine:[{required:!0,type:"number",min:0,max:100,message:"请填写0~100的整数数字",trigger:"blur"}],imprest:[{required:!0,pattern:/^\d{1,15}$/,message:"请填写整数数字，长度不能超出15个数字",trigger:"blur"}],imprestAmount:[{required:!0,pattern:/^\d{1,15}$/,message:"请填写整数数字，长度不能超出15个数字",trigger:"blur"}],imprestAmountLine:[{required:!0,type:"number",min:0,max:100,message:"请填写0~100的整数数字",trigger:"blur"}]};return{isEditPage:!1,ownershipOptions:[{label:"GTMC",value:"GTMC"}],deptOptions:[],form:{type:0,account:"",deptId:"",employeeId:"",empContact:"",empMobile:"",empEmail:"",ownership:"",entName:"",contact:"",mobile:"",email:"",budget:"",budgetAmount:"",budgetAmountLine:"",imprest:"",imprestAmount:"",imprestAmountLine:"",attachment:[]},rules1:Object.assign({},n,{deptId:[{required:!0,message:"请选择部门",trigger:"change"}],employeeId:[{required:!0,message:"请填写员工号",trigger:"blur"},{validator:r,trigger:"blur"}]}),rules2:Object.assign({},n,{ownership:[{required:!0,message:"请选择所属关系",trigger:"change"}],entName:[{required:!0,max:50,message:"请填写企业名称，长度不能超过50个汉字",trigger:"blur"},{validator:i,trigger:"blur"}],contact:[{required:!0,max:10,message:"请填写联系人姓名，长度不能超过10个汉字",trigger:"blur"}],mobile:[{required:!0,message:"请填写手机号，长度不能超过11个数字",trigger:"blur"},{pattern:/^1[3456789]\d{9}$/,message:"手机号格式错误",trigger:"blur"}],email:[{required:!0,max:50,message:"请填写邮箱，长度不能超过50个字符",trigger:"blur"},{pattern:/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+[a-zA-Z0-9]{2,}$/,message:"邮箱格式错误",trigger:"blur"}]}),canSubmited:!0,deptLoading:!1,isSubmiting:!1,isLoading:!1}},created:function(){this.$route.query.id&&(this.isEditPage=!0,this.getApplInfoById())},methods:{acctDupCheck:function(e){return this.$http.serviceCheckAcctDup({name:e})},getDeptList:function(e){var t=this;e&&this.deptOptions.length<=0&&(this.deptLoading=!0,this.$http.serviceGetDeptList().then((function(e){t.deptOptions=e.map((function(e){return{value:e.id,label:e.name}}))})).catch((function(){t.deptOptions=[]})).finally((function(){t.deptLoading=!1})))},searchEmployee:function(e){return this.$http.serviceSearchEmployee({id:e})},enterDupCheck:function(e){return this.$http.serviceCheckEnterDup({name:e})},getShipList:function(e){var t=this;e&&this.ownershipOptions.length<=0&&(this.deptLoading=!0,this.$http.serviceGetDeptList().then((function(e){t.ownershipOptions=e.map((function(e){return{value:e.id,label:e.name}}))})).catch((function(){t.ownershipOptions=[]})).finally((function(){t.deptLoading=!1})))},getApplInfoById:function(e){var t=this;this.isLoading=!0,this.$http.serviceGetAcctApplDetail({id:e}).then((function(e){t.form=Object(a["a"])({},e)})).finally((function(){t.isLoading=!1}))},onVerily:function(){var e=this;this.$refs.form.validate((function(t){if(!t)return!1;e.$confirm("是否".concat(e.isEditPage?"保存修改":"确认提交","？")).then((function(){e.onSubmit()}))}))},onSubmit:function(){var e=this;this.isSubmiting=!0,this.$http.serviceCreateAcct(this.form).then((function(t){e.$message.success("提交成功"),e.$router.replace({path:"/crdtAcctMgmt/acctApplDetail",query:{id:t.id}})})).catch((function(t){!t.code&&t.name?Promise.reject(t):e.$alert(t.message,"提交失败",{type:"error"})})).finally((function(){e.isSubmiting=!1}))},onCancel:function(){var e=this;this.$confirm("是否取消".concat(this.isEditPage?"编辑":"申请","？"),"取消确认",{type:"error"}).then((function(){e.$router.go(-1)}))},clearValidate:function(){this.$refs.form.clearValidate()}}},u=c,m=(r("6219"),r("2877")),p=Object(m["a"])(u,i,n,!1,null,"ab46bca6",null);t["default"]=p.exports},c740:function(e,t,r){"use strict";var i=r("23e7"),n=r("b727").findIndex,a=r("44d2"),o=r("ae40"),l="findIndex",s=!0,c=o(l);l in[]&&Array(1)[l]((function(){s=!1})),i({target:"Array",proto:!0,forced:s||!c},{findIndex:function(e){return n(this,e,arguments.length>1?arguments[1]:void 0)}}),a(l)},d723:function(e,t,r){},f509:function(e,t,r){"use strict";var i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"attachment-container",class:{isSmall:"small"===e.size}},["normal"===e.size?r("el-form-item",{attrs:{label:"附件:"}},[r("el-upload",{attrs:{action:"/attachment","show-file-list":!1,"before-upload":e.beforeUpload,"on-success":e.handleSuccess,"on-error":e.handleError,"on-progress":e.handleProgress,"file-list":e.fileList}},[r("el-button",{attrs:{size:"small",icon:"el-icon-upload2",loading:e.isUploading}},[e._v("点击上传")]),r("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("支持格式：.rar，.zip，.doc，.docx，.pdf，.xls，.xlsx，.txt，.jpg，.jpeg，.png，单个文件不能超过20M")])],1)],1):r("el-upload",{attrs:{action:"/attachment","show-file-list":!1,"before-upload":e.beforeUpload,"on-success":e.handleSuccess,"on-error":e.handleError,"on-progress":e.handleProgress,"file-list":e.fileList}},[r("el-button",{attrs:{size:"small",icon:"el-icon-upload2",loading:e.isUploading}},[e._v("选择附件")]),r("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("支持格式：.rar，.zip，.doc，.docx，.pdf，.xls，.xlsx，.txt，.jpg，.jpeg，.png，单个文件不能超过20M")])],1),r("el-table",{staticStyle:{width:"100%"},attrs:{data:e.fileList,"show-header":"normal"===e.size,size:"mini","empty-text":"暂无附件"}},[r("el-table-column",{attrs:{label:"序号",type:"index",align:"center"}}),r("el-table-column",{attrs:{label:"附件名称",prop:"name",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return["small"===e.size?r("span",[e._v(e._s(e._f("fmtName")(t.row.name,t.row,e.size)))]):e._e()]}}])}),"normal"===e.size?[r("el-table-column",{attrs:{label:"附件格式",prop:"format",align:"center"}}),r("el-table-column",{attrs:{label:"文件大小",prop:"size",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e._f("fmtSize")(t.row.size)))]}}],null,!1,3844785627)}),r("el-table-column",{attrs:{label:"上传时间",prop:"createTime",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e._f("fmtDateTime")(t.row.createTime)))]}}],null,!1,1832337739)}),r("el-table-column",{attrs:{label:"上传人",prop:"creater",align:"center"}})]:e._e(),r("el-table-column",{attrs:{label:"操作",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-link",{attrs:{icon:"el-icon-download"},on:{click:function(r){return e.onDownLoad(t.row.url)}}},[e._v("下载")]),r("el-popconfirm",{staticStyle:{"margin-left":"10px"},attrs:{title:"是否确认删除？",confirmButtonType:"danger"},on:{onConfirm:function(r){return e.onRemoveAttachment(t.row.fid)}}},[r("el-link",{attrs:{slot:"reference",icon:"el-icon-remove-outline",type:"danger"},slot:"reference"},[e._v("删除")])],1)]}}])})],2)],1)},n=[],a=(r("c740"),r("a434"),r("b0c0"),r("b680"),{name:"attachment",props:{list:Array,size:{type:String,default:"normal"}},data:function(){return{fileList:[],isUploading:!1}},watch:{list:{handler:function(e){this.fileList=e},immediate:!0}},filters:{fmtSize:function(e){return 0===parseInt(e/1024)?e+"B":0===parseInt(e/1024/1024)?parseFloat(e/1024).toFixed(2)+"KB":0===parseInt(e/1024/1024/1024)?parseFloat(e/1024/1024).toFixed(2)+"MB":void 0},fmtName:function(e,t,r){return e&&"small"===r&&t.format?e+"."+t.format.toLowerCase():e}},methods:{beforeUpload:function(e){var t=/[\s\S]*(.rar|.zip|.doc|.docx|.pdf|.xls|.xlsx|.txt|.jpg|.jpeg|.png)$/.test(e.name),r=e.size/1024/1024<20;return t||this.$message.error("文件格式只能是.rar，.zip，.doc，.docx，.pdf，.xls，.xlsx，.txt，.jpg，.jpeg，.png的!"),r||this.$message.error("单个文件不能超过20M!"),t&&r&&(this.isUploading=!0),t&&r},handleProgress:function(e,t,r){},handleSuccess:function(e,t,r){this.isUploading=!1,this.fileList.push(e.body),this.$emit("update:list",this.fileList)},handleError:function(e,t,r){this.$message.error("上传失败："+e),this.isUploading=!1},onDownLoad:function(e){},onRemoveAttachment:function(e){var t=this.fileList.findIndex((function(t){return t.fid===e}));t>=0&&this.fileList.splice(t,1)}}}),o=a,l=(r("7008"),r("2877")),s=Object(l["a"])(o,i,n,!1,null,"afcef4cc",null);t["a"]=s.exports},ffb4:function(e,t,r){"use strict";var i=r("4c73"),n=r.n(i);n.a}}]);
//# sourceMappingURL=chunk-210cf8a6.8c1a9c72.js.map