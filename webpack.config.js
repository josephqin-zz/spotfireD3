const path = require('path');

module.exports = {
	entry: './src/spotfirePanel.js',
	output:{
		library:'spotfirePanel',
		libraryTarget:'umd',
		filename:'spotfirePanel.js'
	}
};