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
		schoolMainData: [],
		specialMainData: [],
		num: 0,
		isFirstLoadAllStandard:['getMainData']
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
	},

	changeType(e) {
		const self = this;
		var num = api.getDataSet(e, 'num')
		self.data.num = num;
		self.setData({
			num: self.data.num
		})
	},

	getMainData() {
		const self = this;
		//self.data.mainData = api.jsonToArray(wx.getStorageSync('collectData'),'unshift');
		self.data.schoolMainData = api.getStorageArray('collectSchoolData');
		self.data.specialMainData = api.getStorageArray('collectSpecialData');
		console.log('getMainData', self.data.schoolMainData);
		self.setData({
			web_schoolMainData: self.data.schoolMainData,
			web_specialMainData: self.data.specialMainData,
		});
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
	},

	del(e) {
		const self = this;
		var index = api.getDataSet(e, 'index');
		api.showToast('已取消', 'none');
		api.delStorageArray('collectData', self.data.mainData[index], 'id');
		self.getMainData()
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
