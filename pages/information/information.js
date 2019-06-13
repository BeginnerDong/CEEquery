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
		currentId: 0,

		mainData: [],
		getBefore: {},
		isFirstLoadAllStandard: ['getMainData'],
		isShowMore: false,
		submitData: {
			title: ''
		}
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['招生快讯']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in',
			},
		};
		self.getMainData();
	},

	getMainData(isNew) {
		const self = this;
		api.buttonCanClick(self);
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = {
			thirdapp_id: getApp().globalData.solely_thirdapp_id
		};
		postData.getBefore = api.cloneForm(self.data.getBefore);
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);

			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'fail');
			};

			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.articleGet(postData, callback);
	},

	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		self.getMainData(true)

	},

	tab(e) {
		const self = this;
		api.buttonCanClick(self);
		var currentId = api.getDataSet(e, 'id');
		if (currentId == 0) {
			self.data.getBefore = {
				caseData: {
					tableName: 'Label',
					searchItem: {
						title: ['=', ['招生快讯']],
					},
					middleKey: 'menu_id',
					key: 'id',
					condition: 'in',
				},
			}
		} else if (currentId == 1) {
			self.data.getBefore = {
				caseData: {
					tableName: 'Label',
					searchItem: {
						title: ['=', ['招生章程']],
					},
					middleKey: 'menu_id',
					key: 'id',
					condition: 'in',
				},
			}
		}
		self.setData({
			currentId: api.getDataSet(e, 'id')
		});
		self.getMainData(true);
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
	
	search(){
		const self = this;
		if(self.data.submitData.title==''){
			api.showToast('请输入搜索条件','none')
		}else{
			wx.navigateTo({
				url:'/pages/search/search?title='+self.data.submitData.title
			});
			self.data.submitData.title = '';
			self.setData({
				web_submitData:self.data.submitData
			})
		}
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedi(e) {
		const self = this;
		wx.navigateBack({
			delta: 1
		})
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

})
