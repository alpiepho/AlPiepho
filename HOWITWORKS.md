# Generate REAME - All Public

This project is an example of how I auto-generate the "Special" README for my github site.  If you don't know what that is, you need to search for it.  (basically, if you add a github repo with your user name, it becomes special and the README.md is displayed above the standard 'pinned repos' section on your Github overview page...fun).

You can certainly, go look at the source from my special repo, but I thought I would seperate this out as a seperate repo.

This version uses node and GH Actions to generate a new README.md with a list of all the public repos for
a user...in alphabetical order...and not paged.  (I have never figured out the sorting Github uses, and why can't I list them all?)

## What does what

package.json is used to setup commands for npm (maybe overkil, but works nicely with GH Actions).

build_readme.js is the work horse.


## Known Issues

- The Github user name for the Github API is hard coded.  Should be environment variable or something.
- The timestamps used for the last updated date of each repo is shown in Zulu time directly from the Github API.  Would like this in local time.