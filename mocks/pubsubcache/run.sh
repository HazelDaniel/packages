#!/usr/bin/bash

for i in *; do
	if eval "echo $i | grep -Piz '^(\./)?mr\d?.*' 1>/dev/null"; then
		bash "$i";
	fi
done
