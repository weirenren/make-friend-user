const miniappName = "后厂花开"; //站点标题用于分享时的标题
var shareH5Url = "https://sharevideo.cn/#/"; //H5分享路径

const dev = false

//本地环境配置
// const baseUrl = "localhost:8080";
// const domain = 'http://' + baseUrl + "/app/"; 
// const dev = true
// //线上环境配置
var baseUrl = "sharevideo.cn";
var domain = 'https://' + baseUrl + "/app/";



if (dev == true) {
	baseUrl = "localhost:8080";
	domain = 'http://' + baseUrl + "/app/";

	shareH5Url = "http://localhost:8081/#/"
}


export default {
	baseUrl: baseUrl,
	domain: domain,
	miniappName: miniappName,
	shareH5Url: shareH5Url,
	dev: dev
}