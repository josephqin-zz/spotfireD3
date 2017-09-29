const path = require('path');

module.exports = {
	entry: './js/controlbar.js',
	output:{
		library:'spotfirePanel',
		libraryTarget:'umd',
		filename:'spotfirePanel.js'
	}
};