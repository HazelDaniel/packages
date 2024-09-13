#!/usr/bin/bash

clear

BASE_URL="http://localhost:3000"

i=0;
while [[ $i -lt 5 ]]; do
	if [[ $((i % 2)) -eq 0 ]]; then
		intent=MISS
	else
		intent=HIT
	fi
	route=$BASE_URL/"$RANDOM"url/route
	echo "[$LINENO]: SHOULD $intent CACHE ($route)"
	curl -sX GET $route
	echo -e "\n"

	if [[ $i -eq 0 ]]; then
		intent=MISS
	else
		intent=HIT
	fi
	echo "[$LINENO]: SHOULD $intent CACHE (/owners/$i)"
	curl -sX GET $BASE_URL/owners/$i
	echo -e "\n"
	((i++));
done
