import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

//index.js
//获取应用实例
//触摸开始的事件

Page({
  data: {
		 is_play:false,
		 is_show:false,
		 autoplay:true,
		 duration:1000,
		 circular:true,
		 vertical:false,
		 interval:3000,
		 arr:[
		 	'../../image/home-img%20.png',
		 	'../../image/home-img%20.png',
			'../../image/home-img%20.png',
			'../../image/home-img%20.png',
		 	'../../image/home-img%20.png'
		 ],
   },
		
	show(e){
		const self=this;
		self.data.is_show=!self.data.is_show;
		self.setData({
			web_current:self.data.current,
			is_show:self.data.is_show
		})
	},
	play(e){
		const self=this;
		self.data.is_play=!self.data.is_play;
		self.setData({
			is_play:self.data.is_play
		})
	},
	onLoad: function (options) {
		
	},
	 swiperChange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
	
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  }
	})
