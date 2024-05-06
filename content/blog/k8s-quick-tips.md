---
title: "CKAD training tips to get faster!"
date: 2024-05-03T13:02:22+02:00
draft: false
subtitle: "Even a strong sailor needs tools to smoothly sailing exciting seas"
tags: ["ckad", "kubernetes"]
type: "postcard"
author: "Maria"
thumbnail: "images/masagu-sailor.svg"
---

If you are looking to fundamentally improve your performance regarding your CKAD speed skills, this blog post is for you!

<!--more-->

This is a list of short but sweet tricks. 
They will help you to avoid feeling like you are running out of time when doing the CKAD.

## Aliases 
I encourage you to repeatedly train (or use in your daily DevOps life) self-made aliases.
This is certainly the key to improve speed and accuracy.
In my own experience, the following are the only ones I needed, however this is rather a personal choice.


## Comparing rollouts
This is an AMAZING time saver!

```shell
$ kubectl rollout history deployment my-app --revision=1 > rev1.out
$ kubectl rollout history deployment my-app --revision=2 > rev2.out
```
And then...
```diff
$ diff one.out two.out
1c1
< deployment.apps/my-app with revision #1
---
> deployment.apps/my-app with revision #2
4c4,5
< pod-template-hash=123456
---
> pod-template-hash=098765
7c8
< Image: nginx:1.16.1
---
> Image: nginx:1.17.1
```

## Get only one column from a "kubectl get"

Example: get pod's name
```shell
kubectl get pods --no-headers -o custom-columns=":metadata.name"
```

## Change pod's image version
```shell
# kubectl set image POD/POD_NAME CONTAINER_NAME=IMAGE_NAME:TAG
kubectl set image pod/nginx nginx=nginx:1.7.1
```

## Label annotation magic ✨

1. Changing labels
```shell
kubectl label po nginx-pod app=v2 --overwrite
```

2. Add a new label for all objects with an specific label
```shell
kubectl label po -l "app in(v1,v2)" apptype=frontend
```

3. Add an annotation for all objects with an specific label
```shell
kubectl annotate po -l "app=v2" owner=marketing
```

4. Remove a label for all objects with an specific label
```shell
kubectl label po -l app app-
```

## BASH/ZSH loop practical use cases

1. running multiple k8s pods
```shell
$ for i in `seq 1 3`; do kubectl run nginx$i --image=nginx -l app=v1; done
pod/nginx1 created
pod/nginx2 created
pod/nginx3 created
```

2. Delete multiple numerically sequentiated pods
```shell
$ kubectl delete po nginx{1..3}
pod "nginx1" deleted
pod "nginx2" deleted
pod "nginx3" deleted
```

3. create multiple pods from yaml files
```shell
$ for i in nginx{1..3}; do kubectl run $i --image=nginx -l app=v1 --dry-run=client -oyaml | tee $i.yaml | kubectl create -f $i.yaml; done
pod/nginx1 created
pod/nginx2 created
pod/nginx3 created
$ ls nginx*
nginx1.yaml  nginx2.yaml  nginx3.yaml

```

## Bonus Track: CLI quickie tip - tee FTW

- Input
```shell
cat <<EOF | tee file.conf
> <more>
>   awesome conf
> </more>
> EOF
```
- Output
``` shell file.conf
# file.conf
 <more>
   awesome conf
 </more> 
```

Disclaimer: All tips were randomly ordered in this blog post. 
I will leave them up to you to decide how useful / useless you rate them 😅

If you like it, and found this useful, please don't forget to share the love with others!
Thanks for reading, I hope it is useful on your own path to become a [Kubestronaut](https://www.cncf.io/training/kubestronaut/)! 🚀