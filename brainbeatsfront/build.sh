rm release.zip
rm -R release -f
mkdir release
cp -R src release/src
cp -R public release/public
cp README.md release/README.md
cp package.json release/package.json
cp requirements.txt release/requirements.txt
zip -r release.zip release

