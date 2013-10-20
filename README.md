# Beer counter

two routes :
 - '/' (GET) : show the number of beers
 - '/newbeer' (GET) : to be called when a beer is opened

# Running on heroku
 - need addon mongohq, providing MONGOHQ_URL env var
 - need to enable websockets on Heroku : "heroku labs:enable websockets"
