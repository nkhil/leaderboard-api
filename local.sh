docker run -d  --name mongo-on-docker  -p 27888:27017 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo

# From https://www.code4it.dev/blog/run-mongodb-on-docker