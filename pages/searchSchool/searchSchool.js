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
		sForm: {
			item: ''
		},
		searchItem: {},
		contrastsSchoolData:[],
		isShow:false
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.data.contrastsSchoolData = api.getStorageArray('contrastsSchoolData');
		self.getOrderData();
		self.getMainData()

	},

	onShow() {
		const self = this;
		
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
		if(self.data.buttonCanClick){
			api.buttonCanClick(self,false);
		}else{
			return;
		};
		
		console.log('self.data.sForm.item', self.data.sForm.item)
		self.data.labelData = [];
		if (self.data.sForm.item) {
			console.log(666)
			self.data.searchItem.name = ['LIKE', ['%' + self.data.sForm.item + '%']],
				self.getMainData(true);

		} else if (self.data.sForm.item == '') {
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
					
					for (var i = 0; i < res.info.data.length; i++) {
						res.info.data[i].school_url = 'https://static-data.eol.cn/upload/logo/'+res.info.data[i].school_id+'.jpg'	
					};
					self.data.mainData.push.apply(self.data.mainData, res.info.data);
					for (var i = 0; i < self.data.mainData.length; i++) {
						self.data.mainData[i].isInContrastsSchoolData = false;
						if(api.findItemInArray(self.data.contrastsSchoolData, 'id', self.data.mainData[i].id)){
							self.data.mainData[i].isInContrastsSchoolData = true
						}
					}
				} else {
					self.data.isLoadAll = true;
					api.showToast('没有更多了', 'none');
				};
				self.setData({
					web_mainData: self.data.mainData,
				});
			} else {
				api.showToast(res.msg, 'none')
			};
			api.buttonCanClick(self, true)
			setTimeout(function() {
				wx.hideNavigationBarLoading();
				wx.stopPullDownRefresh();
			}, 300);
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.schoolGet(postData, callback);
	},

	contrasts(e) {
		const self = this;
		self.data.isShow = true;
		var index = api.getDataSet(e,'index');
		self.data.mainData[index].index = index;
		console.log(self.data.mainData[index].isInContrastsSchoolData)
		console.log(self.data.contrastsSchoolData)
		if (self.data.mainData[index].isInContrastsSchoolData) {
			api.delStorageArray('contrastsSchoolData', self.data.mainData[index], 'id');
		} else {
			if (self.data.contrastsSchoolData.length == 2) {
				api.delStorageArray('contrastsSchoolData', self.data.contrastsSchoolData[0], 'id');
				self.data.mainData[self.data.contrastsSchoolData[0].index].isInContrastsSchoolData = false;
				api.setStorageArray('contrastsSchoolData', self.data.mainData[index], 'id', 999);
			} else {
				api.setStorageArray('contrastsSchoolData', self.data.mainData[index], 'id', 999);
			}

		};
		self.data.contrastsSchoolData = api.getStorageArray('contrastsSchoolData');
		self.data.mainData[index].isInContrastsSchoolData = api.findItemInArray(self.data.contrastsSchoolData, 'id', self.data.mainData[index].id);
		
		self.setData({
			web_contrastsSchoolData: self.data.contrastsSchoolData,
			isShow: self.data.isShow,
			web_mainData:self.data.mainData
		});
	},

	delete(e) {
		const self = this;
		var index = api.getDataSet(e, 'index');
		api.delStorageArray('contrastsSchoolData', self.data.contrastsSchoolData[index], 'id');
		self.data.contrastsSchoolData = api.getStorageArray('contrastsSchoolData');
		self.data.isInContrastsSchoolData = api.findItemInArray(self.data.contrastsSchoolData, 'id', self.data.id);
		self.setData({
			web_contrastsSchoolData: self.data.contrastsSchoolData,
			web_isInContrastsSchoolData: self.data.isInContrastsSchoolData
		});
	},

	goContrasts(e) {
		const self = this;
		if (self.data.contrastsSchoolData.length >= 2) {
			api.pathTo(api.getDataSet(e, 'path'), 'nav');
		} else {
			api.showToast('无法对比', 'none')
		}
	},



	show() {
		const self = this;
		self.data.is_show = !self.data.is_show;
		self.setData({
			is_show: self.data.is_show
		})
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

	show1(e) {
		const self = this;
		self.data.isShow = !self.data.isShow;
		self.setData({
			isShow: self.data.isShow
		})
	},

	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		delete self.data.searchItem.name;
		self.data.sForm.item = '';
		self.setData({
			web_sForm: self.data.sForm
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
