mkdir temp
cp src/* temp
git checkout release
cp temp/* .
rm -rf temp

