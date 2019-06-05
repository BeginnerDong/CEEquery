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
		pArray: [],
		sArray:['综合类','理工类','财经类','农林类','医药类','师范类','体育类','政法类','艺术类','民族类','军事类','语言类'],
		searchItemSchool:{}
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.getSchoolMainData()
		self.getProvinceGet()
	},




	getProvinceGet() {
		const self = this;
		const postData = {
			searchItem: {
				thirdapp_id: 2
			}
		};
		postData.order = {
			code:'asc'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.pArray.push.apply(self.data.pArray, res.info.data)
			};
			self.setData({
				web_pArray:self.data.pArray
			})
		}
		api.provinceGet(postData, callback)
	},
	
	
	bindPickerChange(e){
		const self = this;
		console.log(e);
		self.data.searchItemSchool.province_name = self.data.pArray[e.detail.value].name;
		self.getSchoolMainData(true);
	},
	
	bindsStyleChange(e){
		const self = this;
		console.log(e);
		self.data.searchItemSchool.type_name = self.data.sArray[e.detail.value];
		self.getSchoolMainData(true);
	},

	changeType(e) {
		const self = this;
		api.buttonCanClick(self);
		var num = api.getDataSet(e, 'num')
		self.data.num = num;
		if (num == 0) {
			self.getSchoolMainData(true)
		} else if (num == 1) {
			self.getSpecialMainData(true)
		};
		self.setData({
			num: self.data.num
		})
	},


	getSchoolMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		/* 		postData.tokenFuncName = 'getProjectToken'; */
		postData.searchItem = api.cloneForm(self.data.searchItemSchool);
		postData.searchItem.thirdapp_id = getApp().globalData.thirdapp_id;
		postData.order = {
			view_month: 'desc'
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
					web_pArray: self.data.pArray,
					web_mainData: self.data.mainData,
				});
			} else {
				api.buttonCanClick(self, true)
				api.showToast(res.msg, 'none')
			};

			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
			console.log('getMainData', self.data.pArray)
		};
		api.schoolRankGet(postData, callback);
	},

	getSpecialMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		/* 		postData.tokenFuncName = 'getProjectToken'; */
		postData.searchItem = {};
		postData.searchItem.thirdapp_id = getApp().globalData.thirdapp_id;
		postData.order = {
			view_month: 'desc'
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

			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.specialRankGet(postData, callback);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			if (self.data.num == 0) {
				self.getSchoolMainData();
			} else {
				self.getSpecialMainData();
			}
		};
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
