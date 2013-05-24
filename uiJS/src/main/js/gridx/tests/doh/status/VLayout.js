define([
	'dojo/dom-geometry',
	'../GTest'
], function(domGeo, GTest){
	GTest.statusCheckers.push(
	{
		id: 'VLayout 1',
		name: 'grid parameter "autoHeight" is true, body height = grid height - header height - footer height',
		condition: function(grid){
			return grid.autoHeight;
		},
		checker: function(grid, doh){
			doh.is(grid.bodyNode.clientHeight, grid.domNode.clientHeight - grid.headerNode.clientHeight - grid.footerNode.clientHeight);
		}
	},
	{
		id: 'VLayout 2',
		name: 'grid parameter "autoWidth" is false  the body width = the grid width - row header width - virtical scroll bar width',
		condition: function(grid){
			return !grid.autoWidth;
		},
		checker: function(grid, doh){
			var rhw = grid.rowHeader? grid.rowHeader.bodyNode.offsetWidth: 0;
			var vsw = grid.vScrollerNode.style.display === 'none'? 0 : grid.vScrollerNode.offsetWidth;
			doh.is(grid.bodyNode.clientWidth,  grid.domNode.clientWidth - rhw - vsw);
		}
	}
	);
});
