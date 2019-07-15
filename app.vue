<template>
	<div class="daily">
		<div class="daily-menu">
			<div class="daily-menu-item" :class="{on:type==='recommend'}"  @click="handleToRecommend">每日推荐</div>
			<div class="daily-menu-item" :class="{on:type==='daily'}" @click="showThemes= !showThemes">主题日报</div>
			<ul v-show="showThemes">
				<li v-for="item in themes">
					<a :class="{on:item.id === themeId && type === 'daily'}" @click="handleToTheme(item.id)">{{item.name}}</a>
				</li>
			</ul>
		</div>
		<div class="daily-list" ref="list">
			<template v-if="type === 'recommend'">
				<div v-for="list in recommendList">
					<div class="daily-date">{{formatDay(list.date)}}</div>
					<Item v-for="item in list.stories" :data="item" :key="item.id"
						  @click.native="handleClick(item.id)"></Item>
				</div>
			</template>
			<button v-show="isScroll === true" id="more"class="daily-more" @click="loadingMore()" ref="more" >加载更多</button>
			<template v-if="type ==='daily'">
				<Item v-for="item in list" :data="item" :key="item.id"
					  @click.native="handleClick(item.id)"></Item>
			</template>		
		</div>
		<daily-article :id="articleId"></daily-article>
	</div>
</template>
<script>
	import Item from "./components/item.vue";
	import dailyArticle from "./components/daily-article.vue";

	import $ from "./libs/util.js";
	
	export default{
		components:{
			Item,
			dailyArticle
		},
		data(){
			return {
				themes:[],
				showThemes:false,
				type:"recommend",
				themeId:0,
				list:[],
				recommendList:[],
				dailyTime:$.getTodayTime(),
				isLoading:false,
				articleId:0,
				isScroll:true,
			}
		},
		methods:{
			getThemes(){
				//console.log(111);
				//var that = this;
				//发起axios get请求
				$.ajax.get("themes").then(res =>{
					//console.log(res);
					this.themes = res.others;
				}).catch(function(error){
					console.log(error.config);					
				})
			},
			handleToTheme(id){
				//改变分类菜单
				this.type = "daily";
				//设置当前点击子类的主体日报id
				this.themeId = id;
				//清空中间栏的数据
				this.list = [];
				$.ajax.get("theme/" + id).then(res => {
					//过滤掉类型为1的文章，该类型下的文章为空
					this.list = res.stories.filter(item => item.type !== 1);
				}).catch(function(error){
					console.log(error.config);					
				})
			},
			handleToRecommend(){
				this.type = "recommend";
				this.recommendList = [];
				this.dailyTime = $.getTodayTime();
				this.getRecommendList();
			},
			getRecommendList(){
				this.isLoading = true;
				const prevDay = $.prevDay(this.dailyTime + 86400000);
				$.ajax.get("news/before/" + prevDay).then(res =>{	
					this.recommendList.push(res);
					this.isLoading = false;
				}).catch(function(error){
					console.log(error.message);					
				})
			},
			formatDay(date){
				let month = date.substr(4,2);
				let day = date.substr(6,2);
				if(month.substr(0,1) === "0") month = month.substr(1,1);
				if(day.substr(0,1) === "0") day = day.substr(1,1);
				return `${month}月 ${day} 日`;
			},
			handleClick(id){
				this.articleId = id;
			},
			loadingMore(){
                this.dailyTime -= 86400000;
                this.getRecommendList();
            }
		},
		mounted(){			
			this.getRecommendList();			
			this.getThemes();			
			const $list = this.$refs.list;
			const $loading = this.$refs.more;
			//this.isScroll = $list.height < document.body.clientHeight;
			//console.log($list);
			$list.addEventListener("scroll",()=> {
				if(this.type === "daily || this.isLoading") return;
				if($list.scrollTop + document.body.clientHeight >= $list.scrollHeight){
					//this.isScroll = false;
					//this.dailyTime -= 86400000;
					//this.getRecommendList();
					
				}
			});
			
		}
		//等同于data:function(){}
		/*data(){
			return {
				name: "Vue.js"
			}
		}*/
	}
</script>
