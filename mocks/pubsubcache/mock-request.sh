#!/bin/bash

check_success() {
  if [ $? -eq 0 ]; then
    echo "Success: $1"
  else
    echo "Failure: $1"
    exit 1
  fi
}
BASE_URL="http://localhost:3000"

echo "[$LINENO]: SHOULD MISS CACHE (/users/2)"
curl -sX GET http://localhost:3000/users/2
echo -e "\n"

echo "[$LINENO]: SHOULD HIT CACHE (/users/2)"
curl -sX GET http://localhost:3000/users/2
echo -e "\n"

sleep 5
clear

echo "[$LINENO]: adding new user to /users..."
curl -sX POST -H 'Content-Type: application/json' -d '{"name": "john doe'$RANDOM'", " news": []}' $BASE_URL/users
echo -e "\n"

echo "[$LINENO]: EVENT WAS: [POST] ON /users, SHOULD MISS CACHE (/users)"
curl -sX GET http://localhost:3000/users
echo -e "\n"

sleep 2
clear

echo "[$LINENO]: adding new user to /users..."
curl -sX POST -H 'Content-Type: application/json' -d '{"name": "john doe'$RANDOM'", " news": []}' $BASE_URL/users
echo -e "\n"

echo "[$LINENO]: EVENT WAS: [POST] ON /users, SHOULD MISS CACHE (/users)"
curl -sX GET http://localhost:3000/users
echo -e "\n"

echo "[$LINENO]: SHOULD HIT CACHE (/users/2)"
curl -sX GET http://localhost:3000/users
echo -e "\n"

sleep 5
clear

echo "[$LINENO]: Updating news details for user 2..."
curl -sX PUT -H 'Content-Type: application/json' -d '{"name": "john doe'$RANDOM'", " news": []}' $BASE_URL/users/2
echo -e "\n"
echo "[$LINENO]: EVENT WAS: [PUT] ON /users/2, SHOULD MISS CACHE (/users/2)"

curl -sX GET http://localhost:3000/users/2
echo -e "\n"


echo "[$LINENO]: SHOULD MISS CACHE (/users/1)"
# 2. GET /users/:user_id - Fetch details for the created user
echo "Fetching details for user ID: 1..."
curl -s "$BASE_URL/users/1"
check_success "User details fetched"
echo -e "\n"

sleep 2
clear

# 3. PUT /users/:user_id - Update user details
echo "[$LINENO]: Updating user details for user 1..."
curl -s -X PUT "$BASE_URL/users/1" -H "Content-Type: application/json" -d '{"name": "John Updated", "email": "johnupdated@example.com"}'
check_success "User updated"

echo "[$LINENO]: EVENT WAS: [PUT] ON /users/1 SHOULD MISS CACHE (/users/1)"
# 2. GET /users/:user_id - Fetch details for the created user
echo "Fetching details for user ID: 1..."
curl -s "$BASE_URL/users/1"
check_success "User details fetched"
echo -e "\n"

# 4. GET /users - Fetch list of all users
echo "[$LINENO]: SHOULD MISS CACHE (/users)"
echo "Fetching list of all users..."
curl -s "$BASE_URL/users"
check_success "Fetched all users"
echo -e "\n"

# 4. GET /users/:user_id - Fetch the recently fetched user
echo "[$LINENO]: SHOULD HIT CACHE (/users/1)"
echo "Fetching details for user ID: 1..."
curl -s "$BASE_URL/users/1"
check_success "User details fetched"
echo -e "\n"

# 4. GET /users - Fetch list of all users
echo "[$LINENO]: SHOULD HIT CACHE (/users)"
echo "Fetching list of all users..."
curl -s "$BASE_URL/users"
check_success "Fetched all users"
echo -e "\n"

sleep 5
clear

#---------------------------------------
#

echo "[$LINENO]: SHOULD MISS CACHE (/users/1/news)"
# 2. GET /users/:user_id/news - Fetch news for the created user
echo "Fetching news for user ID: 1..."
curl -s "$BASE_URL/users/1/news"
check_success "User news fetched"
echo -e "\n"

echo "[$LINENO]: SHOULD HIT CACHE (/users/1/news)"
# 2. GET /users/:user_id/news - Fetch news for the created user
echo "Fetching news for user ID: 1..."
curl -s "$BASE_URL/users/1/news"
check_success "User news fetched"
echo -e "\n"

sleep 5
clear

echo "[$LINENO]: adding a news to /users/1..."
curl -sX POST -H 'Content-Type: application/json' -d '{"title": "news content '$RANDOM'", " content": "hello world"}' $BASE_URL/users/1/news
echo -e "\n"

echo "[$LINENO]: EVENT WAS: [POST] ON /users/1/news, SHOULD MISS CACHE (/users/1/news)"
curl -s "$BASE_URL/users/1/news"
echo -e "\n"

sleep 2
sleep 2
clear

# 3. PUT /users/:user_id/news/:news_id - Update news details
echo "[$LINENO]: Updating news details for user 1..."
curl -s -X PUT "$BASE_URL/users/1/news/1" -H "Content-Type: application/json" -d '{"name": "John Updated", "email": "johnupdated@example.com"}'
check_success "User updated"

echo "[$LINENO]: EVENT WAS: [PUT] ON /users/1/news/1, SHOULD MISS CACHE (/users/1/news)"
echo "Fetching news for user ID: 1..."
curl -s "$BASE_URL/users/1/news"
echo -e "\n"

echo "[$LINENO]: SHOULD MISS CACHE (/users/1/news/1)"
# 2. GET /users/:user_id/news/1 - Fetch news detail for the created user
echo "Fetching news 1 detail for user ID: 1..."
curl -s "$BASE_URL/users/1/news/1"
check_success "User news detail fetched"
echo -e "\n"

# echo "[$LINENO]: SHOULD MISS CACHE (/users/1)"
# # 2. GET /users/:user_id - Fetch details for the created user
# echo "Fetching details for user ID: 1..."
# curl -s "$BASE_URL/users/1"
# check_success "User details fetched"
# echo -e "\n"

# # 4. GET /users - Fetch list of all users
# echo "[$LINENO]: SHOULD MISS CACHE (/users)"
# echo "Fetching list of all users..."
# curl -s "$BASE_URL/users"
# check_success "Fetched all users"
# echo -e "\n"

# # 4. GET /users/:user_id - Fetch the recently fetched user
# echo "[$LINENO]: SHOULD HIT CACHE (/users/1)"
# echo "Fetching details for user ID: 1..."
# curl -s "$BASE_URL/users/1"
# check_success "User details fetched"
# echo -e "\n"

# # 4. GET /users - Fetch list of all users
# echo "[$LINENO]: SHOULD HIT CACHE (/users)"
# echo "Fetching list of all users..."
# curl -s "$BASE_URL/users"
# check_success "Fetched all users"
# echo -e "\n"

# sleep 2
# clear
