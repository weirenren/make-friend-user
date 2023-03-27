import config from './config.js';

const miniappName = "后厂花开"; //站点标题用于分享时的标题
const shareH5Url = "https://sharevideo.cn/#/"; //H5分享路径

//本地环境配置
const baseUrl = "localhost:8080";
const domain = 'http://' + baseUrl + "/app/"; 

if (config.dev == false) {
	// //线上环境配置
	baseUrl = "sharevideo.cn";
	domain = 'https://' + baseUrl + "/app/"; 
}




export default {
	baseUrl: baseUrl,
	domain: domain,
	miniappName: miniappName,
	shareH5Url: shareH5Url
}
