<template>
	<view>
		<love-match-mainview :like="likeCB" :unlike="unlikeCB" :normalLike="normalLikeCB" :loadLoveMatchList="loveMatchList"> </love-match-mainview>
		
	</view>
</template>

<script>
	import LoveMatchMainView from '../../../components/love-match-mainview/love-match-mainview.vue'
		
	export default {
		data() {
			return {
				loveMatchList: []
			}
		},
		onLoad(options) {
			if (options.match_users) {
				this.loveMatchList =  JSON.parse(options.match_users)
				
				console.log('love personal match users info:' + options.match_users)
			}
		},
		methods: {
			normalLikeCB(taUid){
				// console.log('normalLikeCB')
				// this.decreaseRecommendView()

				this.jump(taUid)
			},
			likeCB(uid){
				// console.log('likeCB')
				// this.decreaseRecommendView()

				this.jump(uid)
			},
			unlikeCB(uid){
				// console.log('unlikeCB')
				// this.decreaseRecommendView()

			},
			jump(taUid) {
				uni.navigateTo({
					url: '/pages/user/love/love-couple?ta_uid=' + taUid
				});
			}
			
		}
	}
</script>
<style>
	page {
		background-color: #f5f5f5;
		height: 100%;
	}
</style>
<style lang="scss">

</style>
