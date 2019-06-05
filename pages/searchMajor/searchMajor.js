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
		array: ['哲学', '经济学', '法学', '教育学', '文学', '历史学', '理学', '工学', '农学', '医学', '管理学', '艺术学', '农林牧渔大类', '资源环境与安全大类',
			'能源动力与材料大类', '土木建筑大类',
			'水利大类', '装备制造大类', '生物与化工大类', '轻工纺织大类', '食品药品与粮食大类', '交通运输大类', '电子信息大类', '医药卫生大类', '财经商贸大类', '旅游大类', '文化艺术大类',
			'新闻传播大类',
			'教育与体育大类', '公安与司法大类', '公共管理与服务大类'
		],
		searchItem: {}
	},




	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.searchItem.level2_name   = self.data.array[0];
		self.setData({
			web_type: self.data.searchItem.level2_name  
		})
		self.getMainData()

	},

	onShow() {
		const self = this;
		self.getOrderData()
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

	changeSearch(e) {
		const self = this;
		api.buttonCanClick(self);
		if (self.data.searchItem.level2_name != api.getDataSet(e, 'name')) {
			self.data.searchItem.level2_name = api.getDataSet(e, 'name');
			self.setData({
				web_type: self.data.searchItem.level2_name
			});
			self.getMainData(true)
		}

	},


	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};

		/* 		postData.tokenFuncName = 'getProjectToken'; */
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.thirdapp_id = getApp().globalData.thirdapp_id;
		postData.order = {
			special_id: 'asc'
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					var test = {};
					for (var i = 0; i < res.info.data.length; i++) {
						if (!test[res.info.data[i].level3_name]) {
							test[res.info.data[i].level3_name] = {
								title: res.info.data[i].level3_name,
								child: []
							}
						};
						test[res.info.data[i].level3_name].child.push(res.info.data[i])
					};
					for (var key in test) {
						self.data.mainData.push(test[key])
					};
					console.log('test', test);
					console.log('self.data.mainData', self.data.mainData)
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
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.specialRankGet(postData, callback);
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



	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},


	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	}
})
