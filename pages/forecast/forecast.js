import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

//index.js
//获取应用实例
//触摸开始的事件

Page({
	data: {

		num: 0,
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
		searchItem: {}
	},




	onLoad: function(options) {
		const self = this;
		api.commonInit(self);
		if(options.score&&options.type){
			self.data.type = options.type
			self.data.score = options.score
		}else{
			api.showToast('数据错误','none')
			wx.navigateBack({
				delta:1
			})
		};
		self.data.searchItem.min = ['between',[self.data.score-10,parseInt(self.data.score)]] 
		self.getMainData()
	},

	changeType(e) {
		const self = this;
		var num = api.getDataSet(e, 'num')
		self.data.searchItem ={};
		self.data.num = num;
		if (num == 0) {
			self.data.searchItem.min = ['between',[self.data.score-10,parseInt(self.data.score)]] 
		}else if (num == 1) {
			self.data.searchItem.min = ['between',[self.data.score-50,self.data.score-20]] 
		}else if(num==2){
			self.data.searchItem.max = ['between',[self.data.score-10,parseInt(self.data.score)]] 
		}
		
		self.setData({
			num:self.data.num
		})
		self.getMainData(true)
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		// postData.tokenFuncName = 'getProjectToken';
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.local_type_name = self.data.type;
		postData.searchItem.thirdapp_id = 2;
		postData.searchItem.local_province_name  = '黑龙江';
		postData.searchItem.year = '2017';
		postData.getAfter = {
			school:{
				tableName:'SchoolRank',
				middleKey:'school_id',
				key:'school_id',
				condition:'=',
				searchItem:{
					status:1
				}
			},
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.mainData.push.apply(self.data.mainData, res.info.data);
				} else {
					self.data.isLoadAll = true;
					api.showToast('没有更多了', 'none')
				}
				self.setData({
					web_mainData: self.data.mainData,
				});
			} else {
				api.buttonCanClick(self, true)
				api.showToast(res.msg, 'none')
			};

			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.schoolProvinceScoreGet(postData, callback);
	},


	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},


	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	}

})
