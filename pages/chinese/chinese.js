//logs.js
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
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
	},

	onLoad(options) {
		const self = this;
		console.log(options)
		self.data.id = options.id;
		self.data.num = options.num;
		api.commonInit(self);

		self.setData({
			web_num: self.data.num
		});
		self.getMainData();
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			id: self.data.id,
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
			api.buttonCanClick(self,true);
		};
		api.articleGet(postData, callback);
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	tab(e) {
		const self = this;
		api.buttonCanClick(self);
		var num = api.getDataSet(e, 'num');

		self.setData({
			web_num: num
		});
		self.getMainData(true);
	},

})
