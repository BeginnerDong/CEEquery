import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   currentId:0,

   mainData:[],
   getBefore:{},
   isFirstLoadAllStandard:['getMainData'],
   isShowMore:false
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.data.getBefore = {
      caseData:{
        tableName:'Label',
        searchItem:{
          title:['=',['招生政策']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    self.getMainData();
  },

  getMainData(isNew){
    const  self =this;
		api.buttonCanClick(self);
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.getBefore = api.cloneForm(self.data.getBefore);
    const callback =(res)=>{
			 api.buttonCanClick(self,true);
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
     
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },

   onPullDownRefresh(){
    const self = this;
    wx.showNavigationBarLoading(); 
    self.getMainData(true)

  },

  tab(e){
    const self = this;
    api.buttonCanClick(self);
    var currentId = api.getDataSet(e,'id');
    if(currentId==0){
      self.data.getBefore = {
        caseData:{
          tableName:'Label',
          searchItem:{
            title:['=',['招生政策']],
          },
          middleKey:'menu_id',
          key:'id',
          condition:'in',
        },
      }
    }else if(currentId==1){
      self.data.getBefore = {
        caseData:{
          tableName:'Label',
          searchItem:{
            title:['=',['批次录取政策']],
          },
          middleKey:'menu_id',
          key:'id',
          condition:'in',
        },
      }
    }else if(currentId==2){
			 self.data.getBefore = {
			  caseData:{
			    tableName:'Label',
			    searchItem:{
			      title:['=',['加分政策']],
			    },
			    middleKey:'menu_id',
			    key:'id',
			    condition:'in',
			  },
			}
		}
    self.setData({
      currentId:api.getDataSet(e,'id')
    });
    self.getMainData(true);
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
  
})

  