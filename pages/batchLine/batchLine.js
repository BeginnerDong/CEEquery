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
		searchItem:	{
			local_province_name: '黑龙江',

		},
		data: {
			2018: {
				'文科': {
					'本科一批': '',
					'本科二批': '',
					'本科三批': '',
					'专科批': ''
				},
				'理科': {
					'本科一批': '',
					'本科二批': '',
					'本科三批': '',
					'专科批': ''
				}
			},
			2017: {
				'文科': {
					'本科一批': '',
					'本科二批': '',
					'本科三批': '',
					'专科批': ''
				},
				'理科': {
					'本科一批': '',
					'本科二批': '',
					'本科三批': '',
					'专科批': ''
				}
			},
			2016: {
				'文科': {
					'本科一批': '',
					'本科二批': '',
					'本科三批': '',
					'专科批': ''
				},
				'理科': {
					'本科一批': '',
					'本科二批': '',
					'本科三批': '',
					'专科批': ''
				}
			},
			2015: {
				'文科': {
					'本科一批': '',
					'本科二批': '',
					'本科三批': '',
					'专科批': ''
				},
				'理科': {
					'本科一批': '',
					'本科二批': '',
					'本科三批': '',
					'专科批': ''
				}
			},
			2014: {
				'文科': {
					'本科一批': '',
					'本科二批': '',
					'本科三批': '',
					'专科批': ''
				},
				'理科': {
					'本科一批': '',
					'本科二批': '',
					'本科三批': '',
					'专科批': ''
				}
			},
		}
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		console.log(self.data.data)
		self.getMainData();
		self.setData({
			web_year:2018
		})
	},
	
	changeYear(e){
		const self = this;
		self.data.searchItem.year = api.getDataSet(e,'year');
		self.setData({
			web_year:self.data.searchItem.year
		})
	},



	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.thirdapp_id = getApp().globalData.thirdapp_id;
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.mainData.push.apply(self.data.mainData, res.info.data);
					for (var i = 0; i < self.data.mainData.length; i++) {
						self.data.data[self.data.mainData[i].year][self.data.mainData[i].local_type_name][self.data.mainData[i].local_batch_name]=self.data.mainData[i].average
					}
				} else {
					self.data.isLoadAll = true;
					api.showToast('没有更多了', 'none');
				};
				self.setData({
					web_data:self.data.data,
					web_mainData: self.data.mainData,
				});
			} else {
				api.buttonCanClick(self, true)
				api.showToast(res.msg, 'none')
			};
			console.log('self.data.data',self.data.data)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.scoreGet(postData, callback);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
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
