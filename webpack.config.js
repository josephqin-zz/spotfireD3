const path = require('path');

module.exports = {
	entry: './build/spotfirePanel_node.js',
	output:{
		library:'spotfirePanel',
		libraryTarget:'umd',
		filename:'spotfirePanel.js'
	}
};