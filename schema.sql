CREATE TABLE IF NOT EXISTS locations(
search_query VARCHAR(125) PRIMARY KEY,  --primary=uniec
formatted_query VARCHAR(256),
latitude FLOAT,
longitude FLOAT
);