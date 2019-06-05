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
		is_play: false,
		is_show: false,
		autoplay: true,
		duration: 1000,
		circular: true,
		vertical: false,
		interval: 3000,
		arr: [
			'../../image/home-img%20.png',
			'../../image/home-img%20.png',
			'../../image/home-img%20.png',
			'../../image/home-img%20.png',
			'../../image/home-img%20.png'
		],
		pArray: ['黑龙江'],
		isFirstLoadAllStandard: ['getOrderData', 'getMainData','getSliderData'],
		num: 0,
		local_type_name: '文科',
		submitData: {
			score: ''
		},
		orderData: []
	},

	onLoad: function(options) {
		const self = this;
		api.commonInit(self);
		self.data.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['招生政策']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in',
			},
		};
		self.getMainData();
		self.getOrderData();
		self.getSliderData()
	},


	getSliderData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			title: '首页轮播'
		};
		const callback = (res) => {
			console.log(1000, res);
			if (res.info.data.length > 0) {
				self.data.sliderData = res.info.data[0];
			
			}
			self.setData({
				web_sliderData: self.data.sliderData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getSliderData', self);
		};
		api.labelGet(postData, callback);
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = {
			thirdapp_id: getApp().globalData.solely_thirdapp_id
		};
		postData.getBefore = api.cloneForm(self.data.getBefore);
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.articleGet(postData, callback);
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



	changeType(e) {
		const self = this;
		var num = api.getDataSet(e, 'num')
		self.data.num = num;
		if (num == 0) {
			self.data.local_type_name = '文科'
		} else if (num == 1) {
			self.data.local_type_name = '理科'
		};
		console.log(self.data.local_type_name)
		self.setData({
			num: self.data.num
		})
	},

	changeBind(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitData[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitData');
		};
		self.setData({
			web_submitData: self.data.submitData,
		});
		console.log(self.data.submitData)
	},

	goSearch() {
		const self = this;
		if (self.data.orderData.length > 0) {
			if (self.data.submitData.score == '') {
				api.showToast('请输入您的分数')
			} else {
				wx.navigateTo({
					url: '/pages/forecast/forecast?type=' + self.data.local_type_name + '&score=' + self.data.submitData.score
				});
			}

			self.data.submitData.score = '',
				self.setData({
					web_submitData: self.data.submitData,
				});
		} else {
			self.show()
		}

	},



	show(e) {
		const self = this;
		self.data.is_show = !self.data.is_show;
		self.setData({
			is_show: self.data.is_show
		})
	},

	play(e) {
		const self = this;
		self.data.is_play = !self.data.is_play;
		self.setData({
			is_play: self.data.is_play
		})
	},


	bindPickerChange(e) {
		const self = this;
		console.log(e);
		self.data.index = e.detail.value;
		self.setData({
			index: self.data.index
		})
	},

	swiperChange(e) {
		this.setData({
			swiperIndex: e.detail.current
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
