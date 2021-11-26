# MERNSTACKBLOGS

## Link to the website goes here:
[MernStackBlogs](https://mernstackblogs.prabhatkumar123.repl.co/ "MernStackBlogs")

## Listing the routes and purpose of pages served on those routes

1. / GET

Homepage of the website. It displays welcome info to users and displays most viewed 4 articles and 4 questions.

2. /articles GET

Articles posted on the website can be all accessed from this route. There is server side pagination in the backend. 4 articles are displayed per page. Users and click on the header and access full article. They can also comment if they wish to and read other people's comments. They can also click on the tags and open articles including the tags they click on.

3. /questions GET

Users can access all questions posted on the website from this route. Again, the comment, tags and server side pagination features are also there.

4. /search GET

Users can search for articles or questions by entering some text and if that text is present in the title or description of the article or question then it will show in the search results.

7. /about GET

This route has a page with info about me, the creator of the website and the website itself.

8. /admin GET

This route is protected so users who are the admin of the website can access this route. They can list article, delete them, edit them and create new articles. 

9. /user 

This route is for users who login or signup. They can view their profile, update their profile. They can list their saved articles. Of course, there is server side pagination feature so the list will contain link to 4 articles per page and a delete button for each article. Users can delete their saved articles.

10. /auth

This route is their for users to login or signup. The form is served at these routes. They can fill in the form and create their account or log in to one of they have it. They can also log out but the link to log out is on the homepage. 

This covers most of what users can do on this application.

Thanks for reading...