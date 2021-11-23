# MERNSTACKBLOGS

## Link to the website goes here:
[MernStackBlogs](https://mernstackblogs.prabhatkumar123.repl.co/ "MernStackBlogs")

## Listing the routes

1. / GET

2. /articles GET
    1. / GET
    2. /:id GET
    3. /tags/:tag GET
    4. /:id POST Comments
    5. /viewcount

3. /questions GET
    1. / GET
    2. / POST Questions
    2. /:id GET
    2. /:id POST Comments
    3. /new GET
    4. /tags/:tag GET
    5. /viewcount GET

4. /search GET

5. /searcharticle POST

6. /searchquestion POST

7. /about GET

8. /admin GET
    1. / GET
    2. / POST
    3. /list
    4. /new
    5. /list/edit/:id GET
    5. /list/:id PATCH
    6. /list/:id DELETE

9. /user 
    1. /profile GET
    2. /update GET
    3. /update POST

10. /auth
    1. /login GET
    1. /login POST
    1. /signup GET
    1. /signup POST
    1. /logout GET