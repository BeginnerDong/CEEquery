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

		swiperIndex: 0,
		pArray: ['黑龙江'],
		yArray: [],
		bArray: [],
		index: 0,
		num: 0,
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
		searchItem: {
			thirdapp_id: 2,
		},
		yearIndex:0,
		batchIndex:0,
		type:'理科'
	},




	onLoad: function(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.getMainData()
	},

	bindYearChange(e) {
		const self = this;
		self.data.yearIndex = e.detail.value;
		self.setData({
			web_yearIndex: e.detail.value
		});
		self.changeContent()
	},

	bindChange(e) {
		const self = this;
		self.data.batchIndex = e.detail.value;
		self.setData({
			web_batchIndex: e.detail.value
		});
		self.changeContent()
	},


	changeType(e) {
		const self = this;
		var num = api.getDataSet(e, 'num')
		self.data.num = num;
		if (num == 0) {
			self.data.type = '理科'
		} else if (num == 1) {
			self.data.type = '文科'
		};
		self.setData({
			num: self.data.num
		})
		self.changeContent()
	},
	
	changeContent(){
		const self = this;
		var newData = [];
		var year = self.data.yArray[self.data.yearIndex];
		var batch = self.data.bArray[self.data.batchIndex];
		var type = self.data.type;
		console.log('type',type)
		console.log('self.data.mainData',self.data.mainData)
		for(var i = 0;i<self.data.mainData.length;i++){
			if(self.data.mainData[i].year==year&&self.data.mainData[i].local_type_name==type&&self.data.mainData[i].local_batch_name==batch){
				newData.push(self.data.mainData[i]);
			};
		};
		console.log('newData',newData);
		self.setData({
			web_mainData:newData
		})
	},

	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		delete self.data.searchItem.local_batch_name;
		delete self.data.searchItem.year;
		self.setData({
			web_bIndex: '',
			web_yIndex: ''
		});
		self.getMainData(true)

	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		// postData.tokenFuncName = 'getProjectToken';
		//postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.school_id = self.data.id;
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.mainData.push.apply(self.data.mainData, res.info.data);
					for (var i = 0; i < self.data.mainData.length; i++) {
						if (self.data.yArray.indexOf(self.data.mainData[i].year) == -1) {
							self.data.yArray.push(self.data.mainData[i].year)
						}
						if (self.data.bArray.indexOf(self.data.mainData[i].local_batch_name) == -1) {
							self.data.bArray.push(self.data.mainData[i].local_batch_name)
						}
					}
				} else {
					self.data.isLoadAll = true;
					api.showToast('暂无数据', 'none')
				};
				console.log('(self.data.yArray',self.data.yArray);
				if(self.data.yArray.indexOf(2018) != -1){
					self.data.yearIndex = self.data.yArray.indexOf(2018);
				};
				
				self.setData({
					web_yearIndex:self.data.yearIndex,
					web_batchIndex:self.data.batchIndex,
					web_yArray: self.data.yArray,
					web_bArray: self.data.bArray,	
				});
				self.changeContent();
			} else {
				api.buttonCanClick(self, true)
				api.showToast(res.msg, 'none')
			};
			setTimeout(function() {
				wx.hideNavigationBarLoading();
				wx.stopPullDownRefresh();
			}, 300);
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.yArray)
			console.log('getMainData', self.data.bArray)
		};
		api.planGet(postData, callback);
	},


	onReachBottom() {
		const self = this;
		/* if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		}; */
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
