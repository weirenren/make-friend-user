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
				
				console.log('match users info:' + options.match_users)
			}
		},
		methods: {
			normalLikeCB(){
				// console.log('normalLikeCB')
				// this.decreaseRecommendView()
			},
			likeCB(){
				// console.log('likeCB')
				// this.decreaseRecommendView()
			},
			unlikeCB(){
				// console.log('unlikeCB')
				// this.decreaseRecommendView()
			},
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
