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
		num: 0,
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
		isShow: false,

	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.data.id = options.id;

		var collectSpecialData = api.getStorageArray('collectSpecialData');
		self.data.isInCollectSpecialData = api.findItemInArray(collectSpecialData, 'id', self.data.id);
		self.getMainData();
		self.setData({
			web_isInCollectSpecialData: self.data.isInCollectSpecialData,
		});

	},

	collect() {
		const self = this;

		if (self.data.isInCollectSpecialData) {
			api.delStorageArray('collectSpecialData', self.data.mainData, 'id');
		} else {
			api.setStorageArray('collectSpecialData', self.data.mainData, 'id', 999);
		};
		var collectSpecialData = api.getStorageArray('collectSpecialData');
		self.data.isInCollectSpecialData = api.findItemInArray(collectSpecialData, 'id', self.data.id);
		self.setData({
			web_isInCollectSpecialData: self.data.isInCollectSpecialData,
		});
	},

	showMore() {
		const self = this;
		self.data.isShow = !self.data.isShow;
		self.setData({
			isShow: self.data.isShow
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
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.mainData = res.info.data[0]
					self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
					self.data.mainData.rate = self.data.mainData.rate.split(':');
					var rate = [];
					var area = [];
					var areaRate = [];
					for (var i = 0; i < self.data.mainData.jobrate.length; i++) {
						rate.push(self.data.mainData.jobrate[i].rate.split('-')[0])
					};
					for (var i = 0; i < self.data.mainData.jobdetail[2].length; i++) {
						area.push(self.data.mainData.jobdetail[2][i].area);
						areaRate.push(parseFloat(self.data.mainData.jobdetail[2][i].rate))
					};
					console.log('area',area)
					console.log('areaRate',areaRate)
					new wxCharts({
						animation: true,
						canvasId: 'ringCanvas',
						type: 'ring',
						extra: {
							ringWidth: 10,
						},
						series: [{
							name: '男',
							data: parseInt(self.data.mainData.rate[0]),
							stroke: false
						}, {
							name: '女',
							data: parseInt(self.data.mainData.rate[1]),
							stroke: false
						}],
						disablePieStroke: true,
						width: 300,
						height: 300,
						dataLabel: true,
						legend: true,
						padding: 0
					});
					new wxCharts({
						animation: true, //是否有动画
						canvasId: 'pieCanvas',
						type: 'pie',
						series: [{
								name: self.data.mainData.jobrate[0].year,
								data: parseInt(rate[0]),
							},
							{
								name: '未就业',
								data: 100 - parseInt(rate[0]),
							}
						],
						width: 300,
						height: 300,
						dataLabel: true,
					});
					new wxCharts({
						animation: true, //是否有动画
						canvasId: 'pieCanvasTwo',
						type: 'pie',
						series: [{
								name: self.data.mainData.jobrate[1].year,
								data: parseInt(rate[1]),
							},
							{
								name: '未就业',
								data: 100 - parseInt(rate[1]),
							}
						],
						width: 300,
						height: 300,
						dataLabel: true,
					});
					new wxCharts({
						animation: true, //是否有动画
						canvasId: 'pieCanvasThree',
						type: 'pie',
						series: [{
								name: self.data.mainData.jobrate[2].year,
								data: parseInt(rate[2]),
							},
							{
								name: '未就业',
								data: 100 - parseInt(rate[2]),
							}
						],
						width: 300,
						height: 300,
						dataLabel: true,
					});
					
					new wxCharts({
						
						canvasId: 'canvas3',
						type: 'column',
						categories: area,
						series: [{
							name: '就业比例',
							data:areaRate
						}],
						yAxis: {
							format: function (val) {
								return val + '%';
							}
						},
						width: 320,
						height: 200
						
						
						
						
					});
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
