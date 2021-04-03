CREATE TABLE IF NOT EXISTS locations(
search_query VARCHAR(125) PRIMARY KEY,  --primary=uniec
formatted_query VARCHAR(256),
latitude FLOAT,
longitude FLOAT
);

-- DROP TABLE IF EXISTS weathers;
-- CREATE TABLE weathers(
--     search_query VARCHAR(100),
--     forecast VARCHAR(100),
--     time DATE
-- );

-- DROP TABLE IF EXISTS parks;
-- CREATE TABLE parks(
--     search_query VARCHAR(100),
--     name VARCHAR(100),
--     address VARCHAR(100),
--     fee FLOAT,
--     description VARCHAR(255),
--     url VARCHAR(100)
-- );