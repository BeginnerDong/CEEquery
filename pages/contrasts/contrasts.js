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
			
		isFirstLoadAllStandard:['getMainData'],
		mainData: []
	},




	onLoad: function(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData()
	},

	getMainData() {
		const self = this;
		//self.data.mainData = api.jsonToArray(wx.getStorageSync('collectData'),'unshift');
		self.data.mainData = api.getStorageArray('contrastsSchoolData');

		console.log('getMainData', self.data.mainData);
		self.setData({
			web_mainData:self.data.mainData
		});
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
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
