echo "Running up MongoDB on port 27017"
docker run -d  -p 27888:27017 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo

# From https://www.code4it.dev/blog/run-mongodb-on-docker