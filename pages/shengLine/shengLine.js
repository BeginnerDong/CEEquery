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
		index: 0,
		num: 0,
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
		searchItem: {
			local_type_name: '理科',
			thirdapp_id: 2,
		}
	},




	onLoad: function(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.getMainData()
	},

	changeType(e) {
		const self = this;
		var num = api.getDataSet(e, 'num')
		self.data.num = num;
		if (num == 0) {
			self.data.searchItem.local_type_name = '理科'
		} else if (num == 1) {
			self.data.searchItem.local_type_name = '文科'
		};
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
					}
				} else {
					self.data.isLoadAll = true;
					api.showToast('没有更多了', 'none')
				}
				self.setData({
					web_yArray: self.data.yArray,
					web_mainData: self.data.mainData,
				});
			} else {
				api.buttonCanClick(self, true)
				api.showToast(res.msg, 'none')
			};

			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.yArray)
			console.log('getMainData', self.data.bArray)
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
