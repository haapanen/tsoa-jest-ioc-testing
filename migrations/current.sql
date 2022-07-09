-- Enter migration here
create table todos ( 
    id serial primary key,
    title text not null,
    description text not null,
    done boolean not null default false
)