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
		orderData: [],
		sForm:{
			item:''
		},
		searchItem:{}
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.getMainData()

	},

	onShow() {
		const self = this;
		self.getOrderData()
	},

	changeBind(e) {
		const self = this;
		api.fillChange(e, self, 'sForm');
		console.log(self.data.sForm);
		self.setData({
			web_sForm: self.data.sForm
		})
	},

	search() {
		const self = this;
		console.log('self.data.sForm.item', self.data.sForm.item)
		self.data.labelData = [];
		if (self.data.sForm.item) {
			console.log(666)
			self.data.searchItem.name = ['LIKE', ['%' + self.data.sForm.item + '%']],
				self.getMainData(true);

		} else if(self.data.sForm.item==''){
			delete self.data.searchItem.name;
			console.log(666)
			self.getMainData(true)
		}
	},

	getOrderData() {
		const self = this;
		const postData = {
			tokenFuncName: 'getProjectToken',
			searchItem: {
				pay_status: 1
			}
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.orderData = res.info.data
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getOrderData', self);
		};
		api.orderGet(postData, callback);
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		/* 		postData.tokenFuncName = 'getProjectToken'; */
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.thirdapp_id = getApp().globalData.thirdapp_id;
		postData.order = {
			school_id: 'asc'
		};
		postData.getAfter = {
			rank: {
				tableName: 'SchoolRank',
				middleKey: 'school_id',
				key: 'school_id',
				condition: '=',
				searchItem: {
					status: 1
				},
				info: ['view_month']
			},
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.mainData.push.apply(self.data.mainData, res.info.data);
				} else {
					self.data.isLoadAll = true;
					api.showToast('没有更多了', 'none');
				};
				self.setData({
					web_mainData: self.data.mainData,
				});
			} else {
				api.buttonCanClick(self, true)
				api.showToast(res.msg, 'none')
			};
			setTimeout(function()
			{
			  wx.hideNavigationBarLoading();
			  wx.stopPullDownRefresh();
			},300);
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.schoolGet(postData, callback);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	goDetail(e) {
		const self = this;
		if (self.data.orderData.length == 0) {
			self.show()
		} else {
			api.pathTo(api.getDataSet(e, 'path'), 'nav');
		}
	},

	show(e) {
		const self = this;
		self.data.is_show = !self.data.is_show;
		self.setData({
			is_show: self.data.is_show
		})
	},
	
	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		delete self.data.searchItem.name;
		self.data.sForm.item = '';
		self.setData({
			web_sForm:self.data.sForm
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
