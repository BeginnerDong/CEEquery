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
		isShow: false,
		is_show: false
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;

		var collectSchoolData = api.getStorageArray('collectSchoolData');
		self.data.isInCollectSchoolData = api.findItemInArray(collectSchoolData, 'id', self.data.id);
		
		
		self.data.contrastsSchoolData = api.getStorageArray('contrastsSchoolData');
		self.data.isInContrastsSchoolData = api.findItemInArray(self.data.contrastsSchoolData, 'id', self.data.id);
		console.log(self.data.isInContrastsSchoolData)
		self.getMainData();
		self.setData({
			web_contrastsSchoolData:self.data.contrastsSchoolData,
			web_isInContrastsSchoolData: self.data.isInContrastsSchoolData,
			web_isInCollectSchoolData: self.data.isInCollectSchoolData,
		});
		console.log('222',self.data.contrastsSchoolData)
	},
	


	collect() {
		const self = this;

		if (self.data.isInCollectSchoolData) {
			api.delStorageArray('collectSchoolData', self.data.mainData, 'id');
		} else {
			api.setStorageArray('collectSchoolData', self.data.mainData, 'id', 999);
		};
		var collectSchoolData = api.getStorageArray('collectSchoolData');
		self.data.isInCollectSchoolData = api.findItemInArray(collectSchoolData, 'id', self.data.id);
		self.setData({
			
			web_isInCollectSchoolData: self.data.isInCollectSchoolData,
		});
	},

	contrasts() {
		const self = this;
		self.data.is_show = true;
		if (self.data.isInContrastsSchoolData) {
			api.delStorageArray('contrastsSchoolData', self.data.mainData, 'id');
		} else {
			if(self.data.contrastsSchoolData.length==2){
				api.delStorageArray('contrastsSchoolData', self.data.contrastsSchoolData[0], 'id');
				api.setStorageArray('contrastsSchoolData', self.data.mainData, 'id', 999);
			}else{
				api.setStorageArray('contrastsSchoolData', self.data.mainData, 'id', 999);
			}
			
		};
		self.data.contrastsSchoolData = api.getStorageArray('contrastsSchoolData');
		self.data.isInContrastsSchoolData = api.findItemInArray(self.data.contrastsSchoolData, 'id', self.data.id);
		self.setData({
			web_contrastsSchoolData:self.data.contrastsSchoolData,
			is_show: self.data.is_show,
			web_isInContrastsSchoolData: self.data.isInContrastsSchoolData,
		});
	},
	
	delete(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		api.delStorageArray('contrastsSchoolData', self.data.contrastsSchoolData[index], 'id');
		self.data.contrastsSchoolData = api.getStorageArray('contrastsSchoolData');
		self.data.isInContrastsSchoolData = api.findItemInArray(self.data.contrastsSchoolData, 'id', self.data.id);
		self.setData({
			web_contrastsSchoolData:self.data.contrastsSchoolData,
			web_isInContrastsSchoolData: self.data.isInContrastsSchoolData
		});
	},
	
	goContrasts(e){
		const self = this;
		if(self.data.contrastsSchoolData.length>=2){
			api.pathTo(api.getDataSet(e, 'path'), 'nav');
		}else{
			api.showToast('无法对比','none')
		}
	},

	showMore() {
		const self = this;
		self.data.isShow = !self.data.isShow;
		self.setData({
			isShow: self.data.isShow
		})
	},

	show() {
		const self = this;
		self.data.is_show = !self.data.is_show;
		self.setData({
			is_show: self.data.is_show
		})
	},

	getMainData() {
		const self = this;
		const postData = {};
		// postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			thirdapp_id: 2,
			id: self.data.id
		};
		postData.getAfter = {
			special: {
				tableName: 'SchoolSpecial',
				middleKey: 'school_id',
				key: 'school_id',
				condition: '=',
				searchItem: {
					status: 1
				}
			},
			detail: {
				tableName: 'SchoolDetail',
				middleKey: 'school_id',
				key: 'school_id',
				condition: '=',
				searchItem: {
					status: 1
				}
			},
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
					self.data.mainData = res.info.data[0]
					self.data.mainData.detail[0].content = api.wxParseReturn(res.info.data[0].detail[0].content).nodes;
				}
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
		api.schoolGet(postData, callback);
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
