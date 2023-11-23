hexo.extend.filter.register('theme_inject', function(injects) {
	injects.head.raw('js', '<script src="https://unpkg.com/@waline/client@v2/dist/waline.js"></script>');
	injects.head.raw('css', '<link rel="stylesheet" href="https://unpkg.com/@waline/client@v2/dist/waline.css">');
});