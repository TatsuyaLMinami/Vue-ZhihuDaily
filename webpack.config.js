var path = require("path");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
	//单入口
	entry:{
		main:"./main"
	},
	//存放打包后文件的输出目录
	output:{
		path: path.join(__dirname,"./dist"),
		//指定资源文件引用的目录
		publicPath: "/dist/",
		//指定输出文件的名称
		filename: "main.js"
	},
	mode:"production",
	module:{
		rules:[
			{
				test: /\.vue$/,
				/*use:["vue-loader",MiniCssExtractPlugin.loader,"css-loader","vue-style-loader"]*/
				loader: "vue-loader",
				options:{
					loaders:{
						css: {
							use:["css-loader"],
							fallback: "vue-style-loader"
						}
					}
				}
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				 use : [
					MiniCssExtractPlugin.loader,
					{ loader: "css-loader" }
				]
			},
			{
				test:/\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
				loader:"url-loader?limit=1024"
			}
		]
	},
	plugins:[
		//重命名提取后的css文件
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: "main.css"
		}),
		
	],
	/*dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/flask-api': {//前端路由匹配模式
                target: "http://news-at.zhihu.com/api/4",  //后端请求服务域名和端口
                changeOrigin: true,   //设置请求头
                pathRewrite: {
                    '^/flask-api': '/'   //路径重写  前端/flask-api 对应 后端/
                },
            }
        },
		hostname : "localhost",
		port : 8010,
		imgPort : 8011,
	},*/
};
