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

		searchItem: {},

		pArray: ['黑龙江'],
		yArray: ['2018年', '2017年', '2016年', '2015年', '2014年'],
		jArray: ['语文', '英语', '数学（文）', '数学（理）', '综合（文）', '综合（理）'],
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
		index: 0,
	},



	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['真题']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in',
			},
		};
		self.getMainData();
	},

	bindYearChange(e) {
		const self = this;
		self.data.searchItem.description = self.data.yArray[e.detail.value];
		self.setData({
			web_yIndex: e.detail.value
		});
		self.getMainData(true)
	},

	bindProjectChange(e) {
		const self = this;
		self.data.searchItem.keywords = self.data.jArray[e.detail.value];
		self.setData({
			web_jIndex: e.detail.value
		});
		self.getMainData(true)
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.getBefore = api.cloneForm(self.data.getBefore);
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'fail');
			};
			api.buttonCanClick(self, true);
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			setTimeout(function()
			{
			  wx.hideNavigationBarLoading();
			  wx.stopPullDownRefresh();
			},300);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.articleGet(postData, callback);
	},


	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		delete self.data.searchItem.description;
		delete self.data.searchItem.keywords;
		self.setData({
			web_jIndex:'',
			web_yIndex:''
		});
		self.getMainData(true)

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
