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
		currentId: 20,
		searchItem:{},
		mainData: [],
		labelData:[],
		isFirstLoadAllStandard: ['getMainData'],
		isShowMore: false
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.setData({
			currentId: self.data.currentId
		});
		self.data.searchItem.menu_id = self.data.currentId;
		self.getMainData();
		self.getLabelData()
	},

	getLabelData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id:2
		}
		postData.getBefore = {
		  caseData:{
					tableName:'Label',
					searchItem:{
						title:['=',['资讯课堂']],
					},
					middleKey:'parentid',
					key:'id',
					condition:'in'
			}
		};
		postData.order ={
			create_time:'asc'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.labelData.push.apply(self.data.labelData, res.info.data);
			}
			api.buttonCanClick(self, true);
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getLabelData', self);
			self.setData({
				web_labelData: self.data.labelData,
			});
		};
		api.labelGet(postData, callback);
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = api.cloneForm(self.data.searchItem);
		
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'fail');
			};
			api.buttonCanClick(self, true);
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.articleGet(postData, callback);
	},

	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		self.getMainData(true)

	},

	tab(e) {
		const self = this;
		api.buttonCanClick(self);
		var currentId = api.getDataSet(e, 'id');
		self.data.searchItem.menu_id = currentId
		self.setData({
			currentId: currentId
		});
		self.getMainData(true);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedi(e) {
		const self = this;
		wx.navigateBack({
			delta: 1
		})
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

})
