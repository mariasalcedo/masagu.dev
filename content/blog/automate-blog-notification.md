---
title: "Automate new blog posts announcements"
date: 2024-04-24T16:14:13+02:00
draft: false
subtitle: "Because I am lazy"
tags: ["github workflows", "go", "rss", "mastodon", "automation"]
type: "postcard"
author: "Maria"
---

Everytime I publish a blog, I want to announce it across the internet. Although I feel I waste my time doing so.
Therefore, I dedicate a blog post on how I managed to automate it.

Which for me means...

<!--more-->

I want my GitHub account's main page and mastodon account to be ✨automagically✨updated/tooted/announced with the info of any newly fresh blog post there is and will ever be.
## Update GitHub repo's README.md

Since I am using Hugo on this website, it conveniently comes with an [Atom's feed](https://www.masagu.dev/index.xml) out of the box.
With it, one can check the latest post's metadata (e.g. title and URL).

Then, with the help of some golang magic:
1. Using the library [gofeed](https://github.com/mmcdole/gofeed), retrieve and parse the feed's metadata.
```golang
    fp := gofeed.NewParser()
    feed, err := fp.ParseURL("https://masagu.dev/index.xml")
```
2. Since `Items` contain all blog post's metadata, ordered from most recent, the first item matches the latest blog entry.
```golang
    blogItem := feed.Items[0]
```
3. From the original `README.md`, divided in two static parts: `PRE-README.md` and `POST-README.md`, content will be used to paste the retrieved info in the right order.
```golang
    pre, err := ReadFileAsString("./PREREADME.md")
    blog := "- Latest blog post :page_facing_up: [" + blogItem.Title + "](" + blogItem.Link + ")"
	post, err := ReadFileAsString("./POSTREADME.md")
	data := fmt.Sprintf("%s\n%s\n%s", pre, blog, post)
```

4. The final parsed string will be then stored in a new `README.md` file. And that's it, yay!

## Call Mastodon's API

Following [Mastodon's API](https://docs.joinmastodon.org/api/guidelines/) specs, I ended up making a golang [simple bot](https://github.com/mariasalcedo/mariasalcedo/tree/0959a543a178c1bac61f86acf1f8b9151c4bf3d7/mastodon-notifier) to toot the latest blog post information to Mastodon.

Output from the previous go script (title and URL) will serve as input for the new toot's message.
For that, I have used the `flag` library, 
```golang
var msgArg, visibilityArg string
flag.StringVar(&msgArg, "message", "my test message", "message to toot")
flag.StringVar(&visibilityArg, "visibility", "unlisted", "visibility flag")
```

so inputs can be easily given on cli
```golang
go run main.go --message='my message' --visibility='public'
```
Mastodon's API offer two auth token types: User authentication token and app authentication token.
Write scopes aren't allowed for app authenticated tokens obtained through `grant_type:client_credentials`.
Write scope is required for calling `POST /api/v1/statuses` used to toot a message.


For that, Mastodon's API oauth model offers either:
- app-authorized short-lived token:
```golang
	params := url.Values{
		"client_id":     {c.Config.ClientID},
		"client_secret": {c.Config.ClientSecret},
		"grant_type":    {"authorization_code"},
		"redirect_uri":  {"urn:ietf:wg:oauth:2.0:oob"},
		"scope":         {"read write"},
		"code":          {c.Config.ClientCode},
	}
```
- or, long term bearer token, used directly to call the API:
```golang
	request := MastodonClientRequest{
		RequestBody: bytes.NewBuffer(payload),
		Headers: http.Header{
			"Content-Type":  {"application/json"},
			"Authorization": {"Bearer " + c.Config.AccessToken},
		},
		Prefix: "Post Toot",
		Path:   "/api/v1/statuses",
		Method: http.MethodPost,
	}
```

## Orchestrate results on GitHub Workflows

On GitHub Workflows, a pipeline scheduled to run every once per week will execute both golang scripts.
Steps of this job are:
1. Test go scripts and oauth credentials
2. Generate `README.md` with new blog post information
3. If README contains new info, push it to the repository
4. If file's pushed, toot info on my [Mastodon account](https://mastodon.green/@masagu). Important fact is to store Mastodon Credentials at a repository level, as GitHub Actions secrets.

Differences with the current `README.md` and the generated one will be checked, making use of git:
```bash
  if ! git diff-index --quiet HEAD; then
    git commit -am "Update README.md with new blogpost!"
    git push --all -f https://${{ secrets.GITHUB_TOKEN }}@github.com/${GITHUB_REPOSITORY}.git
  fi
```

If the current `README.md` looks the same, the pipeline won't commit anything to the repository, and will prevent from spectacularly failing with code 1.


Sources of the go scripts as well as the [Github Workflows](https://github.com/mariasalcedo/mariasalcedo/blob/0959a543a178c1bac61f86acf1f8b9151c4bf3d7/.github/workflows/update.yml) are located at my main repository [https://www.github.com/mariasalcedo/mariasalcedo](https://www.github.com/mariasalcedo/mariasalcedo), if you want to check them out in detail.

Thanks for reading this post, I hope you enjoyed it!
I look forward to your comments :)
