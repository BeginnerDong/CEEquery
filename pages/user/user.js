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
		orderData: [],
		isFirstLoadAllStandard: ['getOrderData','getLabelData'],
		labelData: []
	},
	onLoad: function() {
		const self = this;
		api.commonInit(self);
		self.getLabelData()
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
			};
			self.setData({
				web_orderData: self.data.orderData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getOrderData', self);
		};
		api.orderGet(postData, callback);
	},

	getLabelData() {
		const self = this;
		const postData = {
			searchItem: {
				thirdapp_id: 2,
				title: '平台客服'
			}
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.labelData = res.info.data[0]
			};
			self.setData({
				web_labelData: self.data.labelData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getLabelData', self);
		};
		api.labelGet(postData, callback);
	},

	phoneCall() {
		const self = this;
		wx.makePhoneCall({
			phoneNumber: self.data.labelData.description,
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
