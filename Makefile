compile:
	npm version patch;
	npm run build;
commit:
	git commit -am 'commit compile file by makefile';
publish:
	git push origin master;
	npm publish;
