const {
	defineConfig
} = require('@vue/cli-service')
const path = require('path')

const {
	NODE_ENV,
	VUE_APP_TITLE = ''
} = process.env

const config = {
	publicPath: '/', //这个必须，引入静态资源需要从根路径引入，否则会找不到静态资源

	transpileDependencies: false,
	productionSourceMap: NODE_ENV === 'production',
	chainWebpack: (setting) => {
		setting.plugin('html').tap((args) => {
			args[0].APP_TITLE = VUE_APP_TITLE
			return args
		})
	},
	css: {
		loaderOptions: {
			less: {
				lessOptions: {
					javascriptEnabled: true,
				}
			}
		}
	},
	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'less',
			patterns: [
				path.resolve(__dirname, 'src/styles/variable.less')
			]
		}
	},
	devServer: {
		open: true,
		port: 8080,
		host: 'localhost',
		// history模式下的url会请求到服务器端，但是服务器端并没有这一个资源文件，就会返回404，所以需要配置这一项
		historyApiFallback: {
			index: '/index.html' //与output的publicPath
		},
		proxy: {
			'/api': {
				target: 'https://localhost:8080',
				changeOrigin: true
			}
		}
	}
}

module.exports = defineConfig(config)
