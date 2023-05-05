const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const API_TOKEN = "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";

const profilePicture = document.querySelector(".profile-pic"),
  detailsDiv = document.querySelector(".profile-details"),
  followersCount = document.querySelector(".followers"),
  company = document.querySelector(".company"),
  locationDiv = document.querySelector(".location"),
  socials = document.querySelector(".socials"),
  allRepos = document.querySelector(".repos"),
  repoCount = document.querySelector("#repo-count");

//async function to run our http request immediately we run the web server
(async function () {
  //variable holding the requested user's username
  const username = "IdyUkpong";
  //graphql query to get needed data
  const data = {
    query: `
        query {
            user(login: "${username}") {
              name
              bio
              avatarUrl
              company
              location
              email
              url
              followers {
                totalCount
              }
              following {
                totalCount
              }
              repositories(first: 20, orderBy: {field: PUSHED_AT, direction: DESC}) {
                totalCount
                nodes {
                  name
                  description
                  updatedAt
                  url
                  primaryLanguage {
                    name
                  }
                }
              }
              contributionsCollection {
                totalCommitContributions
                totalPullRequestContributions
                totalRepositoriesWithContributedCommits
                totalRepositoriesWithContributedPullRequests
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                    }
                  }
                }
              }
              organizations(first: 10) {
                nodes {
                  name
                  url
                }
              }
              twitterUsername
            }
          }
    `,
  };

  console.log(data);
  //declaring variables in graphql queries

  //awaiting fetch request
  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "post",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      const userData = data.data.user;
      console.log(userData);
      profilePicture.src = userData.avatarUrl;
      const fullName = document.createElement("span");
      fullName.innerHTML = userData.name;
      const indexToInsert = 0;
      const existingListItem = detailsDiv.childNodes[indexToInsert];
      detailsDiv.insertBefore(fullName, existingListItem);
      const userName = document.createElement("span");
      userName.innerHTML = userData.url.split("/")[3];
      const existingListItem1 = detailsDiv.childNodes[1];
      detailsDiv.insertBefore(userName, existingListItem1);
      const userBio = document.createElement("span");
      userBio.innerHTML = userData.bio;
      const existingListItem2 = detailsDiv.childNodes[2];
      detailsDiv.insertBefore(userBio, existingListItem2);
      const keys = Object.keys(userData);
      const count = document.createElement("span");
      count.innerHTML = `${userData.followers.totalCount} ${keys[7]} . ${userData.following.totalCount} ${keys[8]}`;
      followersCount.appendChild(count);
      const companyName = document.createElement("span");
      companyName.innerHTML = userData.company;
      company.appendChild(companyName);
      const locationName = document.createElement("span");
      locationName.innerHTML = userData.location;
      locationDiv.appendChild(locationName);
      const twitterHandle = document.createElement("span");
      twitterHandle.innerHTML = userData.twitterUsername;
      socials.appendChild(twitterHandle);
      repoCount.innerHTML = userData.repositories.totalCount;
      const repoArr = userData.repositories.nodes;
      console.log(repoArr)
      const repoIndexArr = [0, 1, 2, 5, 7,8, 16, 18, 19];
      repoIndexArr.map((repoIndex) => {
        const repoDiv = document.createElement("div");
        const repoName = document.createElement("a");
        const repoDescription = document.createElement("span");
        const repoPriLang = document.createElement("span");
        const repoUpdatedAt = document.createElement("span");
        const repoDate = repoArr[repoIndex].updatedAt;
        const date = new Date(repoDate);
        const requiredDate = date.toLocaleString("en-us", {
          month: "short",
          day: "numeric",
        });
        repoName.innerHTML = repoArr[repoIndex].name;
        repoName.href = repoArr[repoIndex].url;
        repoDescription.innerHTML = repoArr[repoIndex].description;
        if (repoArr[repoIndex].primaryLanguage) {
          repoPriLang.innerHTML = repoArr[repoIndex].primaryLanguage.name;
        }
        repoUpdatedAt.innerHTML = `Updated on ${requiredDate}`;
        repoDiv.classList.add("repo");
        repoName.classList.add("repo-name");
        repoDescription.classList.add("repo-desc");
        repoPriLang.classList.add("repo-lang");
        repoUpdatedAt.classList.add("repo-update");
        repoDiv.appendChild(repoName);
        repoDiv.appendChild(repoDescription);
        repoDiv.appendChild(repoPriLang);
        repoDiv.appendChild(repoUpdatedAt);
        allRepos.appendChild(repoDiv);
      });
    })
    .catch((err) => console.log(err));
})();
