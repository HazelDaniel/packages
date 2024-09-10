#!/bin/bash

clear

check_success() {
  if [ $? -eq 0 ]; then
    echo "Success: $1"
  else
    echo "Failure: $1"
    exit 1
  fi
}
BASE_URL="http://localhost:3000"

echo "[$LINENO]: SHOULD MISS CACHE (/users/2/news/102/comments)"
curl -sX GET $BASE_URL/users/2/news/102/comments
echo -e "\n"

echo "[$LINENO]: SHOULD HIT CACHE (/users/2/news/102/comments)"
curl -sX GET $BASE_URL/users/2/news/102/comments
echo -e "\n"

sleep 5
clear

echo "[$LINENO]: SHOULD MISS CACHE (/users/2/news/102)"
echo "fetching news details for user ID: 2..."
curl -sX GET $BASE_URL/users/2/news/102
echo -e "\n"

echo "[$LINENO]: adding new comment to /user/2/news/102/comments..."
curl -sX POST -H 'Content-Type: application/json' -d '{"content": "john doe'$RANDOM'", " news comment": []}' $BASE_URL/users/2/news/102/comments
echo -e "\n"

echo "[$LINENO]: EVENT WAS: [POST] ON /users/2/news/102/comments SHOULD MISS CACHE (/users/2/news/102)"
echo "fetching news details for user ID: 2..."
curl -sX GET $BASE_URL/users/2/news/102
echo -e "\n"

echo "[$LINENO]: SHOULD HIT CACHE (/users/2/news/102)"
echo "fetching news details for user ID: 2..."
curl -sX GET $BASE_URL/users/2/news/102
echo -e "\n"

sleep 5
clear


echo "[$LINENO]: SHOULD MISS CACHE (/users/3/news/103)"
echo "fetching news details for user ID: 3..."
curl -sX GET $BASE_URL/users/3/news/103
echo -e "\n"

echo "[$LINENO]: SHOULD MISS CACHE (/users/1/news/101)"
echo "fetching news details for user ID: 1..."
curl -sX GET $BASE_URL/users/1/news/101
echo -e "\n"

echo "[$LINENO]: deleting a comment with id 3 from /user/3/news/103/comments..."
curl -sX DELETE $BASE_URL/users/3/news/103/comments/3
echo -e "\n"

echo "[$LINENO]: EVENT WAS: [DELETE] ON /users/3/news/103/comments/3, SHOULD MISS CACHE (/users/3/news/103)"
echo "fetching news details for user ID: 3..."
curl -sX GET $BASE_URL/users/3/news/103
echo -e "\n"

sleep 2
clear

echo "[$LINENO]: SHOULD MISS CACHE (/users/1/news/101)"
echo "fetching news details for user ID: 1..."
curl -sX GET $BASE_URL/users/1/news/101
echo -e "\n"

echo "[$LINENO]: SHOULD HIT CACHE (/users/3/news/103)"
echo "fetching news details for user ID: 3..."
curl -sX GET $BASE_URL/users/3/news/103
echo -e "\n"

echo "[$LINENO]: SHOULD HIT CACHE (/users/1/news/101)"
echo "fetching news details for user ID: 1..."
curl -sX GET $BASE_URL/users/1/news/101
echo -e "\n"

sleep 5
clear

# echo "[$LINENO]: adding new user to /users..."
# curl -sX POST -H 'Content-Type: application/json' -d '{"name": "john doe'$RANDOM'", " news": []}' $BASE_URL/users
# echo -e "\n"

# echo "[$LINENO]: EVENT WAS: [POST] ON /users, SHOULD MISS CACHE (/users)"
# curl -sX GET $BASE_URL/users
# echo -e "\n"

# echo "[$LINENO]: SHOULD HIT CACHE (/users/2)"
# curl -sX GET $BASE_URL/users
# echo -e "\n"

# sleep 5
# clear

# echo "[$LINENO]: Updating news details for user 2..."
# curl -sX PUT -H 'Content-Type: application/json' -d '{"name": "john doe'$RANDOM'", " news": []}' $BASE_URL/users/2
# echo -e "\n"
# echo "[$LINENO]: EVENT WAS: [PUT] ON /users/2, SHOULD MISS CACHE (/users/2)"

# curl -sX GET $BASE_URL/users/2
# echo -e "\n"


# echo "[$LINENO]: SHOULD MISS CACHE (/users/1)"
# # 2. GET /users/:user_id - Fetch details for the created user
# echo "Fetching details for user ID: 1..."
# curl -s "$BASE_URL/users/1"
# check_success "User details fetched"
# echo -e "\n"

# sleep 2
# clear

# # 3. PUT /users/:user_id - Update user details
# echo "[$LINENO]: Updating user details for user 1..."
# curl -s -X PUT "$BASE_URL/users/1" -H "Content-Type: application/json" -d '{"name": "John Updated", "email": "johnupdated@example.com"}'
# check_success "User updated"
# echo -e "\n"

# echo "[$LINENO]: EVENT WAS: [PUT] ON /users/1 SHOULD MISS CACHE (/users/1)"
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

# sleep 5
# clear

# #---------------------------------------
# #

# echo "[$LINENO]: SHOULD MISS CACHE (/users/1/news)"
# # 2. GET /users/:user_id/news - Fetch news for the created user
# echo "Fetching news for user ID: 1..."
# curl -s "$BASE_URL/users/1/news"
# check_success "User news fetched"
# echo -e "\n"

# echo "[$LINENO]: SHOULD HIT CACHE (/users/1/news)"
# # 2. GET /users/:user_id/news - Fetch news for the created user
# echo "Fetching news for user ID: 1..."
# curl -s "$BASE_URL/users/1/news"
# check_success "User news fetched"
# echo -e "\n"

# sleep 5
# clear

# echo "[$LINENO]: SHOULD MISS CACHE (/users/2/news)"
# # 2. GET /users/:user_id/news - Fetch news for the created user
# echo "Fetching news for user ID: 2..."
# curl -s "$BASE_URL/users/2/news"
# check_success "User news fetched"
# echo -e "\n"

# echo "[$LINENO]: adding a news to /users/1..."
# curl -sX POST -H 'Content-Type: application/json' -d '{"title": "news content '$RANDOM'", " content": "hello world"}' $BASE_URL/users/1/news
# echo -e "\n"

# echo "[$LINENO]: EVENT WAS: [POST] ON /users/1/news, SHOULD MISS CACHE (/users/1/news)"
# curl -s "$BASE_URL/users/1/news"
# echo -e "\n"

# echo "[$LINENO]: SHOULD HIT CACHE (/users/2/news)"
# # 2. GET /users/:user_id/news - Fetch news for the created user
# echo "Fetching news for user ID: 2..."
# curl -s "$BASE_URL/users/2/news"
# check_success "User news fetched"
# echo -e "\n"

# sleep 5
# sleep 2
# clear

# echo "[$LINENO]: SHOULD MISS CACHE (/users/1/news/101)"
# # 2. GET /users/:user_id/news/101 - Fetch news detail for the created user
# echo "Fetching news 101 detail for user ID: 1..."
# curl -s "$BASE_URL/users/1/news/101"
# check_success "User news detail fetched"
# echo -e "\n"

# # 3. PUT /users/:user_id/news/:news_id - Update news details
# echo "[$LINENO]: Updating news details for user 1..."
# curl -s -X PUT "$BASE_URL/users/1/news/101" -H "Content-Type: application/json" -d '{"title": "John Updated news", "content": "this is an awesome news"}'
# check_success "User updated"
# echo -e "\n"

# echo "[$LINENO]: EVENT WAS: [PUT] ON /users/1/news/101, SHOULD MISS CACHE (/users/1/news)"
# echo "Fetching news for user ID: 1..."
# curl -s "$BASE_URL/users/1/news"
# echo -e "\n"

# echo "[$LINENO]: SHOULD MISS CACHE (/users/1/news/101)"
# # 2. GET /users/:user_id/news/101 - Fetch news detail for the created user
# echo "Fetching news 101 detail for user ID: 1..."
# curl -s "$BASE_URL/users/1/news/101"
# check_success "User news detail fetched"
# echo -e "\n"

# echo "[$LINENO]: SHOULD HIT CACHE (/users/1/news/101)"
# # 2. GET /users/:user_id/news/102 - Fetch news detail for the created user
# echo "Fetching news 102 detail for user ID: 1..."
# curl -s "$BASE_URL/users/1/news/101"
# check_success "User news detail fetched"
# echo -e "\n"
