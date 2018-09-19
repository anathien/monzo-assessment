# Assessment notes

I spent a total of 4.2 hours coding on this exercise (with a couple errand breaks that gave me some unfair thinking time)... but I can explain it! Okay, no, I can't. I just simply couldn't let it go when I was so close to finishing.

So, with that out of the way, let's get to implementation details, regrets and pitfalls.

## The decisions

### Why not Redux?

Well, that's pretty simple... I haven't used Redux before and I felt that learning on this exercise would slow me down too much. I felt that getting an MVP ready was more important than trying to showcase my non-existent Redux skills, so I went for an easier / hackier approach instead.

### What would I have used in a non-exercise scenario?

For authentication, I would have used an enter hook on the React Route to check if the user is allowed to see the page in question. If not, pop up the login dialog. The rest is pretty much the same.

For data, I would have added a GraphQL layer that would abstract out all the handling and chaining of API calls and simply return the information needed for the UI. Unfortunately I had to decide against this, as setting up the server would have taken too much time.

### Okay, so what is this state store and why am I re-querying the data for individual apps?

The state store is a stripped down idea borrowed from Flux. It's basically an EventEmitter singleton that acts as the source of truth for the whole application and to which components can subscribe if they want. I chose it because it makes it very easy to notify all components that the auth session has started / ended.

As for re-querying data for individual apps... Simply lack of time. This is the place where GraphQL would have had it's chance to really shine. It would have taken simply an appId and an offset and would have returned the data collated, as the UI requested. As I didn't have time to add the server, I opted for a viably suboptimal solution to get the MVP out the door.

### Why a login dialog and not a page?

There are so many things that can go wrong with redirects and redirects encoded into query params inside of redirects. Having the login dialog on a layer displaying on top of the content makes it easy to "pop it up" from wherever in the application, without the components handling it themselves.

However, as soon as I implemented the modal and tried it out, I had to realize that it doesn't really give security to the app, since it can just be removed from the DOM and then the user is still free peruse the content (even though new queries to the API wouldn't work any more). I fixed this (okay, hacked) by the components handling the logged out state themselves, rendering nothing - this was made easy by the state store, as they were notified of the auth change immediately.

## The changes I would make if I had more time

Brace for the long list...
* Redo the setup of the whole project so it's starting with a blank slate instead of create-react-app, as it adds a whole load of dependencies I don't even use
* Add GraphQL to the project and do the data layer properly
* Add the entry hooks to the React Routes
* Research other options besides sessionStorage for storing data across refreshes
* Figure out why the update app call doesn't update the app
* Enter and tab handling on the login screen, starting with the e-mail field preselected
* User feedback (toast messages) across the board when things go wrong
* Proper error handling on the middle end (either in GraphQL or the utils), so the user can be shown the relevant message for the error that occurred
* More nullchecks across the board
* Input validation
  * Checking for injections / empty string / whether the e-mail is an actual e-mail on the login screen
  * Checking for injections / empty string / whether the password conforms to guidelines (even with just a dummy function) on the login screen
  * Checking for injections / empty string for the app name when updating an app
* Adding the ability to change the icon of the app as well, not just the name (either with an uploader or via link)
* Better placement / design of the save app button
* Better placement for the back to app list navigation
* Moving button styles into a common css instead of redefining them twice
* If possible, add proper logic for the next page button on the user list. Figure out if there's a way to determine how many pages there are in total.
* Proper empty states for the views
* Proper design
* Rename either the main `App.js` file or the `App.js` in views, as they are name clashing
* Maybe prod config with hashed files - but that's really overkill for an exercise

I'm pretty sure I forgot a couple of things, but that's about it.
