import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();
import wxCharts from '../../utils/wxcharts-min.js'
//index.js
//获取应用实例
//触摸开始的事件

Page({
			data: {

				mainData: [],
				isFirstLoadAllStandard: ['getMainData'],


			},


			onLoad(options) {
				const self = this;
				api.commonInit(self);

				self.data.id = options.id;
				self.getMainData()
			},




			getMainData() {
				const self = this;
				const postData = {};
				// postData.tokenFuncName = 'getProjectToken';
				postData.searchItem = {
					thirdapp_id: 2,
					id: self.data.id
				};
				const callback = (res) => {
						if (res.solely_code == 100000) {
							api.buttonCanClick(self, true)
							if (res.info.data.length > 0) {
								self.data.mainData = res.info.data[0]
								self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;

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
						
					}
					api.specialGet(postData, callback);
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
