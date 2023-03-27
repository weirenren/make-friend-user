<template>
	<view>
		<view class="info-box">
			<view class="user-item">
				<image @click="jumpUser(postDetail.uid)" :src="postDetail.userInfo.avatar"></image>
				<view class="user-item-user">
					<text class="user-name">{{ postDetail.userInfo.username }}</text>
					<view class="cxplain">{{ postDetail.userInfo.intro }}</view>
				</view>
				<u-button v-show="postDetail.isFollow" size="mini" style="float:right;font-size: 11px;" @click="cancelFollow">已关注</u-button>
				<u-button v-show="!postDetail.isFollow" size="mini" style="float:right;font-size: 11px;" @click="follow">关注</u-button>
			</view>
			<view class="icon">
				<text>{{ postDetail.createTime | timeFormat }}</text>
			</view>
			<view class="hr"></view>
			<view class="post-title">{{ getTitle(postDetail) }}</view>
			<rich-text class="post-text" @longpress="onCopy" :nodes="postDetail.content"></rich-text>
			<!-- 图片 -->
			<block v-if="postDetail.type == 11 || postDetail.type == 1">
				<!--一张图片-->
				<block v-if="postDetail.media.length == 1">
					<image
						class="img-style-1"
						@tap.stop="previewImage"
						mode="aspectFill"
						:data-current="postDetail.media[0]"
						:data-image="postDetail.media"
						:src="postDetail.media[0]"
					></image>
				</block>
				<!--二张图片-->
				<block v-if="postDetail.media.length == 2">
					<view class="img-style-2">
						<image
							v-for="(mediaItem, index2) in postDetail.media"
							:key="index2"
							@tap.stop="previewImage"
							mode="aspectFill"
							:data-current="mediaItem"
							:data-image="postDetail.media"
							:src="mediaItem"
						></image>
					</view>
				</block>
				<!--三张以上图片-->
				<block v-if="postDetail.media.length == 4">
					<view class="img-style-4">
						<image
							v-for="(mediaItem, index2) in postDetail.media"
							:key="index2"
							@tap.stop="previewImage"
							mode="aspectFill"
							:data-current="mediaItem"
							:data-image="postDetail.media"
							:src="mediaItem"
						></image>
					</view>
				</block>
				<!--三张以上图片-->
				<block v-if="postDetail.media.length > 4||postDetail.media.length ==3">
					<view class="img-style-3">
						<image
							v-for="(mediaItem, index2) in postDetail.media"
							:key="index2"
							@tap.stop="previewImage"
							mode="aspectFill"
							:data-current="mediaItem"
							:data-image="postDetail.media"
							:src="mediaItem"
						></image>
					</view>
				</block>
			</block>
			<block v-if="postDetail.type == 2 && postDetail.media.length > 0"><video :controls="false" :autoplay="true" :src="postDetail.media[0]"></video></block>
			<!-- 投票 -->
			<view v-if="postDetail.type === 4" class="vote-box">
				<view class="title">{{ postDetail.voteInfo.title }}</view>
				<view class="expire-time" v-if="postDetail.voteInfo.type === 1">单选</view>
				<view class="expire-time" v-if="postDetail.voteInfo.type === 2">多选</view>
				<!-- 是否投票失效 -->
				<view class="expire-box" v-if="isVoteExpire">投票已过期</view>
				<view v-else class="expire-time">截止：{{ postDetail.voteInfo.time }}</view>
				<view
					class="vote-item"
					@click="castVote(index2, postDetail.voteInfo.type)"
					:class="{ active: item2.checked }"
					v-for="(item2, index2) in postDetail.voteInfo.options"
					:key="index2"
				>
					<text v-if="postDetail.isVoteResult || isVoteExpire">{{ item2.content }}<text style="color: #999;margin-left: 20rpx;">({{ item2.ticketNum }}票)</text></text>
					<text v-else="postDetail.isVoteResult">{{ item2.content }}</text>
				</view>
				<q-button v-if="!postDetail.isVoteResult && isVoteExpire === false" @click="voteSubmit">投票</q-button>
			</view>
			<!-- 圈子信息 -->
			<navigator class="topic-info" :url="'/pages/topic/detail?id=' + postDetail.topicId">
				<image mode="aspectFill" class="cover" :src="postDetail.topicInfo.coverImage"></image>
				<view class="center">
					<view class="desc">{{ postDetail.topicInfo.topicName.substring(0, 15) }}</view>
					<view class="count-txt">{{ postDetail.topicInfo.userCount }}人加圈 | {{ postDetail.topicInfo.postCount }}篇内容</view>
				</view>
				<view class="right">
					<text>去看看</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</navigator>
			<!--点赞、分享、评论-->
			<view class="p-footer">
				<block v-if="postDetail.isCollection">
					<view class="p-item" @click="cancelCollection">
						<text class="iconfont icon-lujing" style="color: #d81e06;"></text>
						<text>{{ postDetail.collectionCount }}</text>
					</view>
				</block>
				<block v-else>
					<view class="p-item" @click="addCollection">
						<text class="iconfont icon-shoucang"></text>
						<text>{{ postDetail.collectionCount }}</text>
					</view>
				</block>
				<view class="p-item" @click="focus = true">
					<text class="iconfont icon-pinglun"></text>
					<text>{{ postDetail.commentCount }}</text>
				</view>
				<view class="p-item" @click="showShare = true">
					<text class="iconfont icon-forward"></text>
					<text>分享</text>
				</view>
			</view>
		</view>
		<view class="comment-box">
			<view class="title">评论（{{ postDetail.commentCount }}）</view>
			<view style="margin-bottom: 40rpx;" v-for="(item, index) in commentList" :key="index">
				<view class="comment-item" @longpress="delComment(item, index)">
					<image @click="jumpUser(item.userInfo.uid)" class="avatar" :src="item.userInfo.avatar"></image>
					<view class="c-content" @click="onReply(item)">
						<view class="user">
							<text>{{ item.userInfo.username }}</text>
							<block v-if="item.isThumbs">
								<view @click.stop="cancelThumbs(item.id, index)" class="thumbs">
									<text class="num">{{ item.thumbs }}</text>
									<u-icon class="icon" size="40" name="heart-fill" color="#e62e00"></u-icon>
								</view>
							</block>
							<block v-else>
								<view @click.stop="onThumbs(item.id, index)" class="thumbs">
									<text class="num">{{ item.thumbs }}</text>
									<u-icon class="icon" size="40" name="heart-fill" color="#bfbfbf"></u-icon>
								</view>
							</block>
						</view>
						<text class="c-txt">{{ item.content }}</text>
						<text class="time">{{ item.createTime | timeFormat }}</text>
					</view>
				</view>
				<view
					@longpress="delComment(item, index, index2)"
					@click="onReply(item2, index, index2)"
					v-if="item.children.length > 0"
					v-for="(item2, index2) in item.children"
					:key="item2.id"
					class="sub-comment-item"
				>
					<view class="user">
						<u-avatar class="avatar" :size="40" :src="item2.userInfo.avatar"></u-avatar>
						<view class="u-head">
							<text>{{ item2.userInfo.username }}</text>
							<block v-if="item2.isThumbs">
								<view class="thumbs" @click.stop="cancelThumbs(item2.id, index, index2)">
									<text class="num">{{ item2.thumbs }}</text>
									<u-icon class="icon" size="40" name="heart-fill" color="#e62e00"></u-icon>
								</view>
							</block>
							<block v-else>
								<view class="thumbs" @click.stop="onThumbs(item2.id, index, index2)">
									<text class="num">{{ item2.thumbs }}</text>
									<u-icon class="icon" size="40" name="heart-fill" color="#bfbfbf"></u-icon>
								</view>
							</block>
						</view>
					</view>
					<view class="reply">
						<text>@</text>
						<navigator :url="'/pages/user/home?uid=' + item2.toUser.uid" hover-class="none" class="name">{{ item2.toUser.username }}</navigator>
						<text>：{{ item2.content }}</text>
						<view class="time">{{ item2.createTime | timeFormat }}</view>
					</view>
				</view>
			</view>
			<!-- 加载状态 -->
			<block v-if="commentList.length > 0">
				<view style="margin: 30rpx;"><u-loadmore :status="loadStatus" /></view>
			</block>
			<block v-else><u-empty text="暂无评论" mode="message"></u-empty></block>
		</view>
		<view style="height: 100rpx;"></view>
		<!-- 评论输入框 -->
		<view class="comment-tool">
			<textarea
				:placeholder="placeholder"
				@blur="onBlur"
				:focus="focus"
				fixed="true"
				cursor-spacing="5"
				v-model="form.content"
				auto-height="true"
				placeholder-class="txt-placeholder"
				confirm-type="send"
				style="width: 100%;"
				@confirm="addComment"
			></textarea>
			<u-button @click="addComment" :disabled="isSubmitD" :custom-style="btnStyle" style="border-radius: 0;">发布</u-button>
		</view>
		<!-- 分享选择弹窗 -->
		<q-popup v-model="showShare" height="240rpx">
			<view class="share-wrap" @click="showShare = false">
				<!-- #ifdef MP -->
				<button open-type="share" class="share-item u-reset-button">
					<image src="/static/wechat.png"></image>
					<text>微信好友</text>
				</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="share-item2" @click="copyPageUrl">
					<image src="/static/images/shareurl.png"></image>
					<text>分享链接</text>
				</view>
				<view class="share-item2" @click="copyPageDetail">
					<image src="/static/images/sharecontent.png"></image>
					<text>分享详情</text>
				</view>
				<!-- #endif -->
				<!-- <view class="share-item" @click="shareCanvas">
					<image src="/static/img.png"></image>
					<text>分享海报</text>
				</view> -->
			</view>
		</q-popup>
		<!-- 海报弹窗 todo-->
		<u-popup v-model="showCanvas" mode="center" width="80%">
			<view class="canvas-box">
				<canvas style="width: 300px;height: 450px;" canvas-id="shareCanvas"></canvas>
				<view class="footer"><u-button :custom-style="shareBtnStyle" @click="saveImgToAlbum" type="success" shape="circle">保存/分享</u-button></view>
			</view>
		</u-popup>
	</view>
</template>x

<script>
	
import loveJsonRequestor from '../../utils/love-json-requestor.js'
import commonUtil from '../../utils/h-common.js'
export default {
	data() {
		return {
			btnStyle: {
				color: "#fff",
				backgroundColor: '#55aaff'
			},
			unitId: this.$c.postDetailAd,
			postId: 0,
			gender: '',
			postDetail: {
				comment: [],
				media: [],
				commentList: {
					data: []
				},
				topicInfo: {
					topicName: ''
				}
			},
			focus: false,
			isSubmitD: false,
			commentList: [],
			placeholder: '说点什么...',
			form: {
				pid: 0,
				type: 1,
				toUid: '',
				postId: '',
				content: ''
			},
			showShare: false,
			showCanvas: false,
			shareBtnStyle: {
				backgroundColor: '#333'
			},
			page: 1,
			loadStatus: 'loadmore',
			isVoteExpire:false,
			
		};
	},
	onLoad(options) {
		this.postId = options.id;

		if (options.scene) {
			this.postId = options.scene;
		}
		if(options.mid){
			this.messageRead(options.mid);
		}

		this.form.postId = this.postId;
		this.getPostDetail();
		this.getCommentList();

		//#ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		//#endif
	},
	onReachBottom() {
		this.page++;
		this.getCommentList();
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			
		}
		let imgURL;
		if (this.postDetail.media.length > 0) {
			imgURL = this.postDetail.media[0];
		}
		return {
			title: this.postDetail.content,
			path: '/pages/post/detail?id=' + this.postId,
			imageUrl: imgURL
		};
	},
	onShareTimeline() {
		let imgURL = (imgURL = this.postDetail.media[0]);
		return {
			title: this.postDetail.content,
			imageUrl: imgURL,
			query: 'id=' + this.postId
		};
	},
	methods: {
		getTitle(post) {
			if (this.gender != '') {
				return this.gender +'-'+ post.title
			}
			return post.title 				
		},
		messageRead(mid){
			// console.log('====>',this.postId,mid)
			this.$H
				.post('message/readMessage', {
					postId: this.postId,
					mid: mid
				})
				.then(res => {
					
				});
		},
		buildH5ShareContent() {
			return "[后厂花开—单身交友]" + commonUtil.stringSub(this.postDetail.content, 100) + "\n详情：" + this.$c.shareH5Url+'pages/post/detail?id=' + this.postId
		},
		voteSubmit() {
			let voteDate = [];
			this.postDetail.voteInfo.options.forEach(item => {
				if (item.checked) {
					voteDate.push(item.id);
				}
			});
			// console.log('==>',voteDate)
			this.$H
				.post('post/vote/userVote', {
					id: this.postDetail.voteInfo.id,
					vote: voteDate
				})
				.then(res => {
					if (res.code == 0) {
						this.getPostDetail();
						uni.showToast({
						  title: "投票成功",
						  icon: "none",
						  duration: 2000,
						});
					}
				});
		},
		castVote(index, type) {
			if (!this.postDetail.isVoteResult && !this.isVoteExpire) {
				if (type === 1) {
					this.postDetail.voteInfo.options.forEach(item => {
						this.$set(item, 'checked', false);
					});
				}
				let checked = this.postDetail.voteInfo.options[index].checked;
				if (checked) {
					this.$set(this.postDetail.voteInfo.options[index], 'checked', false);
				} else {
					this.$set(this.postDetail.voteInfo.options[index], 'checked', true);
				}
			}
		},
		copyPageUrl() {
			let that = this;
			uni.setClipboardData({
				data: this.$c.shareH5Url+'pages/post/detail?id=' + this.postId,
				success: function() {
					uni.hideToast();
					that.$q.toast('复制成功快分享给好友叭~', 'success');
					that.showShare = false;
				}
			});
		},
		copyPageDetail() {
			let that = this;
			uni.setClipboardData({
				data: this.buildH5ShareContent(),
				success: function() {
					uni.hideToast();
					that.$q.toast('复制成功快分享给好友叭~', 'success');
					that.showShare = false;
				}
			});
		},
		// 长按 删除评论
		delComment(e, index, index2) {
			let that = this;
			let user = uni.getStorageSync('userInfo');
			// console.log('e',e)
			// console.log('index',index)
			// console.log('index2',index2)
			//如果是子评论需要遍历子评论查询是否存在自己回复的评论消息
			var flag=false;//这个用来确定父评论下是否存在用户自己的子评论
			var i=0;//这个用来锁定子评论楼层位置
			e.children.map((item) =>{
			　　if(item.uid==user.uid){
					flag=true;
					e.id=item.id;
					if(index2){
						index2=i;
					}
				}
				i++;
			});
			// console.log(flag);
			
			if (e.uid != user.uid) {
				if(!flag){
					return;
				}
			}
			uni.showModal({
				title: '提示',
				content: '确定删除自己的评论嘛？',
				success: function(res) {
					if (res.confirm) {
						that.$H
							.post('comment/del', {
								id: e.id
							})
							.then(res2 => {
								if (res2.code == 0) {
									if (index2 || index2 === 0) {
										that.commentList[index].children.splice(index2, 1);
									} else {
										that.commentList.splice(index, 1);
									}
								}
							});
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				}
			});
		},
		onCopy() {
			let that = this;
			uni.setClipboardData({
				data: this.postDetail.content,
				success: function() {
					uni.hideToast();
					that.$q.toast('复制成功', 'success');
				}
			});
		},
		// 保存海报到相册
		saveImgToAlbum() {
			let that = this;
			uni.canvasToTempFilePath({
				x: 0,
				y: 0,
				width: 300,
				height: 450,
				canvasId: 'shareCanvas',
				success: function(res) {
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function() {
							that.showCanvas = false;
						}
					});
				}
			});
		},
		// 生成分享海报
		async shareCanvas() {
			uni.showLoading({
				mask: true,
				title: '正在生成海报'
			});

			this.showCanvas = true;
			this.showShare = false;
			var context = uni.createCanvasContext('shareCanvas');

			//白色背景矩形
			context.setFillStyle('#FFFFFF');
			context.fillRect(0, 0, 300, 450);

			//帖子封面
			let coverSrc;
			if (this.postDetail.media[0]) {
				coverSrc = this.postDetail.media[0];
			} else {
				coverSrc = 'https://' + this.$c.baseUrl + '/uploads/default_shre_bg.jpg';
			}

			let coverImg = await this.downloadFile(coverSrc);
			context.drawImage(coverImg, 0, 0, 300, 240);

			// 文字内容
			context.setFillStyle('#616161');
			context.setFontSize(14);
			this.drawText(context, this.postDetail['content'], 20, 270, 30, 260, 5);

			// 来源
			context.setFillStyle('#616161');
			context.setFontSize(14);
			context.fillText('来源：后厂花开', 20, 430, 300);

			// 圈子二维码
			let qrCode = await this.getQrCode();
			let tempQrCode = await this.downloadFile(qrCode);
			context.drawImage(tempQrCode, 220, 370, 70, 70);

			context.draw();

			uni.hideLoading();
		},
		/**
		 * 绘制多行文本
		 * ctx canvas对象
		 * str 文本
		 * leftWidth 距离左侧的距离
		 * initHeight 距离顶部的距离
		 * titleHeight 文本的高度
		 * canvasWidth 文本的宽度
		 * canvasWidth 文本行数
		 * @returns {*}
		 */
		drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth, maxRow) {
			let rowNum = 1;
			let lineWidth = 0;
			let lastSubStrIndex = 0; //每次开始截取的字符串的索引
			for (let i = 0; i < str.length; i++) {
				lineWidth += ctx.measureText(str[i]).width;
				if (lineWidth > canvasWidth && rowNum <= maxRow) {
					ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
					initHeight += 22; //22为 文字大小20 + 2
					lineWidth = 0;
					lastSubStrIndex = i;
					titleHeight += 22;

					rowNum++;
				}
				if (i == str.length - 1 && rowNum <= maxRow) {
					//绘制剩余部分
					ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
				}
			}
			// 标题border-bottom 线距顶部距离
			titleHeight = titleHeight + 10;
			return titleHeight;
		},
		downloadFile(url) {
			return new Promise(resolve => {
				uni.downloadFile({
					url: url,
					success: res => {
						resolve(res.tempFilePath);
					}
				});
			});
		},
		getQrCode() {
			return new Promise(resolve => {
				this.$H
					.get('post/qrCode', {
						id: this.postId
					})
					.then(res => {
						resolve(res.result);
					});
			});
		},
		// 点赞
		onThumbs(id, index, index2) {
			this.$H
				.post('comment/thumbs', {
					id: id
				})
				.then(res => {
					if (res.code == 0) {
						if (index2 || index2 == 0) {
							this.commentList[index].children[index2].isThumbs = true;
							this.commentList[index].children[index2].thumbs++;
						} else {
							this.commentList[index].isThumbs = true;
							this.commentList[index].thumbs++;
						}
					}
				});
		},
		// 取消点赞
		cancelThumbs(id, index, index2) {
			this.$H
				.post('comment/cancelThumbs', {
					id: id
				})
				.then(res => {
					if (res.code == 0) {
						if (index2 || index2 == 0) {
							this.commentList[index].children[index2].isThumbs = false;
							this.commentList[index].children[index2].thumbs--;
						} else {
							this.commentList[index].isThumbs = false;
							this.commentList[index].thumbs--;
						}
					}
				});
		},
		// 回复评论
		onReply(e) {
			this.placeholder = '回复：' + e.userInfo.username;
			this.focus = true;

			let pid = e.pid;
			// console.log('eee',e)
			if (pid === 0) {
				this.form.pid = e.id;
				// console.log('sss',this.form.pid)
			} else {
				this.form.pid = e.pid;
			}
			// console.log('======>',pid)
			this.form.toUid = e.userInfo.uid;
			this.form.postId = this.postId;
		},
		// 输入框失去焦点时
		onBlur() {
			this.placeholder = '留下你的精彩评论...';
			this.focus = false;
			// #ifdef MP
			this.form.pid = 0;
			// #endif
			// console.log('输入框失去焦点')
		},
		// 获取评论列表
		getCommentList() {
			this.loadStatus = 'loading';
			this.$H
				.get('comment/list', {
					postId: this.postId,
					page: this.page
				})
				.then(res => {
					if (res.code == 0) {
						this.commentList = this.commentList.concat(res.result.data);

						if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
							this.loadStatus = 'nomore';
						} else {
							this.loadStatus = 'loadmore';
						}
					}
				});
		},
		jumpUser(uid) {
			uni.navigateTo({
				url: '/pages/user/home?uid=' + uid
			});
		},
		addComment() {
			this.isSubmitD = true;
			if (this.form.content == '') {
				this.$u.toast('评论不能为空');
				this.isSubmitD = false;
				return;
			}

			uni.showLoading({
				mask: true,
				title: '发布中'
			});
			// console.log('pid=====>',this.form.pid)
			this.$H.post('post/addComment', this.form).then(res => {
				if (res.code == 0) {
					this.form.content = '';
					this.$u.toast('评论成功');
					this.page = 1;
					this.commentList = [];
					this.form.pid = 0;
					this.getCommentList();
				}
				this.isSubmitD = false;
				uni.hideLoading();
			});
		},
		getPostDetail() {
			this.$H
				.get('post/detail', {
					id: this.postId
				})
				.then(res => {
					if(res.code==500){
						this.$u.toast(res.msg);
						setTimeout(function() {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}, 1500);
					}
					this.postDetail = res.result;
					
					// console.log('====>',JSON.stringify(this.postDetail))
							
					if (this.postDetail.type == 11) {
						this.gender = loveJsonRequestor.getExactGenderFromPost(this.postDetail.content)
					
						this.postDetail.content = loveJsonRequestor.getExactContentFromPost(this.postDetail.content)
					}

					// 投票帖子
					if (res.result && res.result.voteId > 0) {
						res.result.voteInfo.options.forEach(item => {
							this.$set(item, 'checked', false);
						});

						let timestamp = Date.parse(new Date()) / 1000;
						if (res.result.voteInfo.expireTime < timestamp) {
							this.isVoteExpire = true;
						}
					}
				});
		},
		cancelCollection() {
			this.$H
				.post('post/cancelCollection', {
					id: this.postId
				})
				.then(res => {
					if (res.code === 0) {
						this.postDetail.isCollection = false;
						this.postDetail.collectionCount--;
					}
				});
		},
		addCollection() {
			this.$H
				.post('post/addCollection', {
					id: this.postId,
					uid: this.postDetail.uid
				})
				.then(res => {
					if (res.code === 0) {
						this.postDetail.isCollection = true;
						this.postDetail.collectionCount++;
					}
				});
		},
		addThumb() {
			this.$H
				.post('post/addThumb', {
					id: this.postId
				})
				.then(res => {
					if (res.code === 0) {
						this.postDetail.isThumb = true;
					}
				});
		},
		cancelThumb() {
			this.$H
				.post('post/cancelThumb', {
					id: this.postId,
					uid: this.postDetail.uid
				})
				.then(res => {
					if (res.code === 0) {
						this.postDetail.isThumb = false;
					}
				});
		},
		follow() {
			this.$H
				.post('user/addFollow', {
					id: this.postDetail.uid
				})
				.then(res => {
					if (res.code === 0) {
						this.postDetail.isFollow = true;
					} else {
						this.$refs.uToast.show({
							title: res.msg,
							type: 'error'
						});
					}
				});
		},
		cancelFollow() {
			this.$H
				.post('user/cancelFollow', {
					id: this.postDetail.uid
				})
				.then(res => {
					if (res.code === 0) {
						this.postDetail.isFollow = false;
					}
				});
		},
		previewImage(e) {
			uni.previewImage({
				current: e.currentTarget.dataset.current, // 当前显示图片的http链接
				urls: e.currentTarget.dataset.image // 需要预览的图片http链接列表
			});
		}
	}
};
</script>
<style>
	page {
		background-color: #f5f5f5;
		height: 100%;
	}
</style>
<style lang="scss" scoped>
.post-title{
	margin: 10rpx 0;
	font-size: 40rpx;
	color: #000;
	font-weight: bold;
}
.info-box {
	padding: 20rpx;
	background-color: #ffffff;
}

.icon text {
	font-size: 12px;
	color: #999;
	margin-right: 20rpx;
}

/*关注*/

.user-item {
	display: flex;
	.user-item-user {
		flex: 1;
		.cxplain {
			font-size: 11px;
			color: #999;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}
	}
	
	image {
		width: 80rpx;
		height: 80rpx;
		float: left;
		margin-right: 10rpx;
		border-radius: 50%;
	}
}

/*底部操作*/
.p-footer {
	margin: 30rpx;
	display: flex;
	font-size: 24rpx;
	color: #616161;
	.p-item {
		display: flex;
		align-items: center;
		.iconfont {
			font-size: 40rpx;
		}

		&:nth-child(2) {
			margin: 0 auto;
		}

		.iconfont {
			margin-right: 10rpx;
		}
	}
}

/*评论列表*/
.comment-box {
	background-color: #ffffff;
	margin-top: 20rpx;
	padding: 20rpx;
}

.comment-box > .title {
	margin-bottom: 20rpx;
}

.comment-item {
	display: flex;
	padding: 20rpx;
	&:active{
		background-color: #F5F5F5;
	}
	.c-content {
		display: flex;
		flex-direction: column;
		flex: 1;
		
		.time {
			color: #999;
			font-size: 10px;
		}
		
		.user{
			display: flex;
			.thumbs{
				margin-left: auto;
				display: flex;
				align-items: center;
				color: #bfbfbf;
				.num{
					margin-right: 10rpx;
				}
			}
		}
	}
	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}
}

.sub-comment-item {
	margin-left: 100rpx;
	padding: 10rpx;
	&:active{
		background-color: #F5F5F5;
	}
	.user {
		display: flex;
		align-items: center;
		.name {
			color: #616161;
		}
		.avatar {
			margin-right: 10rpx;
		}
		
		.u-head{
			flex: 1;
			display: flex;
			.thumbs{
				margin-left: auto;
				display: flex;
				align-items: center;
				color: #bfbfbf;
				.num{
					margin-right: 10rpx;
				}
			}
		}
	}
	.reply {
		.time {
			margin-left: auto;
			font-size: 16rpx;
			color: #999;
		}
		.name {
			display: inline-block;
			color: #55aaff;
			font-weight: 600;
		}
	}
}

/* 评论tool */
.comment-tool {
	position: fixed;
	bottom: 0;
	// width: 100%;
	// min-width: 750rpx;
    margin: 0 auto;
	left: 0.1%;
	right: 0.1%;
	max-width: 1000rpx;
	
	background-color: #fff;
	padding: 20rpx;
	display: flex;
	z-index: 999;

	.txt-placeholder {
		font-size: 26rpx;
	}
	
}

.comment-tool textarea {
	background-color: #f5f5f5;
	padding: 20rpx;
	border-radius: 10rpx;
	min-height: 40rpx;
	font-size: 26rpx;
}

.comment-tool .u-btn {
	margin-left: 10rpx;
}


/*文章图片*/
.img-style-1 {
	display: block;
	width: 100%;
	max-height: 600rpx;
	border-radius: 5px;
}

.img-style-2 {
	display: flex;
}

.img-style-2 image {
	margin: 5rpx;
	border-radius: 5px;
	width: 100%;
	height: 294rpx;
}

.img-style-3 {
	display: flex;
	flex-wrap: wrap;
}

.img-style-3 image {
	width: 31.3%;
	height: 200rpx;
	margin: 1%;
	border-radius: 5px;
}

.img-style-4 {
	display: flex;
	flex-wrap: wrap;
}
.img-style-4 image {
	width: 48%;
	height: 320rpx;
	margin: 0.5%;
}
// 圈子信息
.topic-info {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	background-color: #f5f5f5;
	margin: 20rpx 0;
	.cover {
		width: 100rpx;
		height: 100rpx;
		margin-right: 20rpx;
	}
	.center {
		flex: 1;
		.count-txt {
			color: #999;
		}
	}
	.right {
		margin-left: 20rpx;
		color: #55aaff;
	}
}
// 分享弹窗
.share-wrap{
	display: flex;
	padding: 30rpx;
	width: 80%;
	margin: 0 auto;
	justify-content: space-between;
	// align-items: center;
	.share-item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		&:nth-child(1){
			margin-right: auto;
		}
		image{
			width: 100rpx;
			height: 100rpx;
		}
		text{
			font-size: 24rpx;
			margin-top: 20rpx;
		}
	}
	.share-item2{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// &:nth-child(1){
		// 	margin: auto;
		// }
		image{
			width: 80rpx;
			height: 80rpx;
		}
		text{
			font-size: 24rpx;
			margin-top: 20rpx;
		}
	}
}

//海报弹窗
.canvas-box{
	height: 500px;
	position: relative;
	.footer{
		position: absolute;
		bottom: 20rpx;
		left: 20rpx;
		right: 20rpx;
	}
}

// 投票
.vote-box{
	background-color: #F5F5F5;
	border-radius: 20rpx;
	padding: 20rpx;
	margin: 20rpx;
	.title{
		font-weight: bold;
	}
	.expire-time{
		font-size: 24rpx;
		margin: 20rpx 0;
	}
	.vote-item{
		font-size: 24rpx;
		font-weight: bold;
		padding: 20rpx;
		border-radius: 20rpx;
		border: 1px solid #999;
		text-align: center;
		margin-bottom: 20rpx;
		&:last-child{
			margin-bottom: 0;
		}
	}
	
	.active{
		background-color: #333;
		color: #fff;
	}
}

.expire-box{
	background-color: #999;
	color: #fff;
	font-size: 24rpx;
	display: inline-block;
	padding: 0 20rpx;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
}

video {
	width: 100%;
}

.post-text {
	// white-space: pre-wrap;
	// color: #565656;
	font-size: 32rpx;
}
</style>
