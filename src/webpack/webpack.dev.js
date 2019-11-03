module.export = options => ({
    devServer: {
        stats: options.stats,
        hot: true,
        // contentBase: './target/classes/static/',
        proxy: [{
            // context: [
            //   '/api'
            // ],
            target: `http${options.tls ? 's' : ''}://localhost:9060`,
            secure: false,
            changeOrigin: options.tls
        }],
        watchOptions: {
            ignored: /node_modules/
        },
        https: options.tls
    },
})