import config from './config.js';
export default {
	request(options = {}) {
		return new Promise((resolve, reject) => {
			let url = options.url;
			if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) {
				options.url = config.domain + url;
			}
			options.header.token = uni.getStorageSync("token");
			options.complete = (response) => {
				if (response.statusCode == 200 || response.statusCode == 0) {
					if (response.data.code == 401 || response.data.code == 420) {
						// #ifdef MP-WEIXIN
						uni.navigateTo({
							url: "/pages/user/login"
						})
						// #endif

						// #ifdef H5
						uni.navigateTo({
							url: "/pages/user/go-login"
						})
						// #endif
					}

					if (response.data.code == 500) {
						uni.showToast({
							title: response.data.msg,
							icon: "none",
							duration: 2000
						});
						// #ifdef MP-WEIXIN
						uni.navigateTo({
							url: "/pages/user/login"
						})
						// #endif
					}
					resolve(response.data)
				} else {
					uni.showToast({
						title: '请求异常！',
						icon: "none"
					});

					// uni.removeStorageSync("hasLogin");
					// uni.removeStorageSync("token");
					// uni.removeStorageSync("userInfo");
					// uni.switchTab({
					// 	url: "/pages/index/index"
					// })

				}
			}

			uni.request(options)
		})
	},

	post(url, data = {}, header = {}) {

		let options = {
			url: url,
			data: data,
			header: header,
			method: "POST"
		}

		return this.request(options);
	},

	get(url, data = {}, header = {}) {
		let options = {
			url: url,
			data: data,
			header: header
		}

		return this.request(options);
	},



	hookImg() {
		if (config.dev == false) {
			return
		}

		const property = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
		const nativeSet = property.set;

		function customiseSrcSet(url) {

			var http = "http://"
			if (url.indexOf("https://") != -1) {
				http = "https://"
			}
			// do something

			var array = url.split('/')
			var domain = ''
			if (array.length > 3) {
				domain = array[2]
			}
		
			var domainEndIndex = 0
			if (domain.indexOf("127.0.0.1") != -1) {

				domainEndIndex = url.indexOf(domain) + domain.length
				domain = "sharevideo.cn"
			}

			var newUrl = http + domain + url.substring(domainEndIndex)

			nativeSet.call(this, newUrl);
		}
		Object.defineProperty(Image.prototype, 'src', {
			set: customiseSrcSet,
		});
	}

};
