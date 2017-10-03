spotfirePanel.js implement D3V4 to simulate some basic functions of Spotfire for Web Application

documents:
test.html: demo html
test.js: data sample


libarary API:

namespace: "spotfirePanel"

spotfirePanel.mavenData(Array) : setup Maven Dataset 


spotfirePanel.sampleData(Array): setup samples Information Dataset


spotfirePanel.trellisOpts(Array): setup the list of options for Trellis the dataSet 

    				
spotfirePanel.yValueOpts(Array): setup the list of options for Y-axis 


spotfirePanel.groupsOpts(Array): setup the list of options for groups the dataSet

container.call(spotfirePanel) or spotfirePanel(container): render the panel
														   containser should be D3.selection object