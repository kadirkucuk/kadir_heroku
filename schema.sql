create extension postgis;
CREATE TABLE public.trees (
tree_type varchar NULL,
geom geometry(POINT, 4326) NULL
);