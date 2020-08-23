
var axios = require("axios")
var fs = require('fs');


var MAX_GHAPI_PAGEPER = 100
var MAX_GHAPI_MAXPAGES = 2
var github_base =
  "https://api.github.com/users/alpiepho/repos?per_page=" +
  MAX_GHAPI_PAGEPER +
  "&page="

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key].toLowerCase()
    var y = b[key].toLowerCase()
    return x < y ? -1 : x > y ? 1 : 0
  })
}

function getCounts(array) {
  privateCount = 0
  publicCount = 0
  forkCount = 0
  array.forEach((element) => {
    if (element.private) privateCount += 1
    if (!element.private) publicCount += 1
    if (element.fork) forkCount += 1
  })
  return [privateCount, publicCount, forkCount]
}

function finishSpecialReadme(jsonData) {
  jsonData = sortByKey(jsonData, "name")
  //DEBUG
  //console.log(JSON.stringify(jsonData, null, 2))

  let privateCount, publicCount, forkCount
  [privateCount, publicCount, forkCount] = getCounts(jsonData)
  publicCount -= forkCount

  fileData = ""

  fileData += "\n### All Public Repositories Alphabetically\n\n(" + jsonData.length + " Total, " + publicCount + " Public, " + forkCount + " Forks)<br>\n"
  today = new Date()
  fileData += "<sup><sub>(updated " + today + ")</sub></sup>\n"
  fileData += "\n"

  jsonData.forEach((element, index) => {
    subscriptStr = "(public)"
    if (element.fork) subscriptStr = "(fork)"
    if (element.hasREADMEmd) {
      fileData += "[" + element.name + "](" + element.html_url + "/blob/master/README.md) <sup><i>" + subscriptStr + "</i></sup> <br>" + "\n"
    } else {
      fileData += "[" + element.name + "](" + element.html_url + ") <sup><i>" + subscriptStr + "</i></sup> <br>" + "\n"
    }
    description = "(see link)"
    if (element.description) description = element.description
    fileData += description + "<br>" + "\n"

    switch(element.language) {
      case "C":
        fileData += "![##545454](https://placehold.it/15/545454/000000?text=+) C<br>" + "\n"
        break;
      case "C++":
        fileData += "![##F34B7C](https://placehold.it/15/f34b7/000000?text=+) C++<br>" + "\n"
        break;
      case "C#":
        fileData += "![##178600](https://placehold.it/15/178600/000000?text=+) C#<br>" + "\n"
        break;
      case "CSS":
        fileData += "![##58407E](https://placehold.it/15/58407e/000000?text=+) CSS<br>" + "\n"
        break;
      case "Go":
        fileData += "![##00ADD8](https://placehold.it/15/00add8/000000?text=+) Go<br>" + "\n"
        break;
      case "HTML":
        fileData += "![##E34C27](https://placehold.it/15/e34c27/000000?text=+) HTML<br>" + "\n"
        break;
      case "Java":
        fileData += "![##B07218](https://placehold.it/15/b07218/000000?text=+) Java<br>" + "\n"
        break;
      case "JavaScript":
        fileData += "![#F1E05A](https://placehold.it/15/f1e05a/000000?text=+) JavaScript<br>" + "\n"
        break;
      case "PHP":
        fileData += "![##4F5D94](https://placehold.it/15/4f5d94/000000?text=+) PHP<br>" + "\n"
        break;
      case "Python":
        fileData += "![##3571A5](https://placehold.it/15/3571a5/000000?text=+) Python<br>" + "\n"
        break;
      case "Shell":
        fileData += "![##89E050](https://placehold.it/15/89e050/000000?text=+) Shell<br>" + "\n"
        break;
      case "TypeScript":
        fileData += "![##2B7489](https://placehold.it/15/2b7489/000000?text=+) TypeScript<br>" + "\n"
        break;
      default:
        fileData += "![#000000](https://placehold.it/15/000000/000000?text=+) unknown language<br>" + "\n"
        break;
    }
    //TODO fix this
    // localDate = Date(element.updated_at);
    // console.log(element.updated_at)
    // console.log(localDate.toString())
    localDate = element.updated_at;
    fileData += "<sup><sub>" + localDate + "</sub></sup><br>" + "\n"
    fileData += "\n"
  })
  fs.writeFileSync("README_public_repos.md", fileData)
}


let options = {}
let promises = []
let jsonData = []
for (i = 1; i <= MAX_GHAPI_MAXPAGES; i++) {
  promises.push(
    axios.get(github_base + i, options).then((response) => {
      response.data.forEach((element) => {
        jsonData.push(element)
      })
    })
    .catch(error => {
      console.log(error.response.data)
    })
  )
}

Promise.all(promises).then(() => {
  let promises = []
  jsonData.forEach(element => {
    promises.push(
      axios.get(element.html_url + "/blob/master/README.md").then((response) => {
        element.hasREADMEmd = true
      })
      .catch(error => {})
    )
  })
  Promise.all(promises).then(() => {
    finishSpecialReadme(jsonData);
  })
})
