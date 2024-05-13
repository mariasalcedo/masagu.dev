---
title: "KCNA prep: Reviewing Cloud-Native Tools origin and intentionality"
date: 2024-05-13T15:25:16+02:00
draft: false
subtitle: "The landscape looks good from up here :)"
tags: ["kubernetes", "KNCA", "CNCF"]
type: "postcard"
author: "Maria"
---

From where the CNCF came from, and what is trying to achieve: a highly democratized environment of cloud native tools. Moreover, to empower tool makers by ensuring innovation, extensibility and interoperability inside an ecosystem with open standards.
To be able to choose the right tool for the right problem, while multiple solutions to a problem is widely embraced in the community. 

The following is an high level overview of it.

<!--more-->

Prior to understand kubernetes tooling, is relevant to understand its root: Containers, its primitives, and what OCI entails. 

## Container primitives

Available on the linux kernel from 2008, these following two components were key to the realization of what's today a container.
- **cgroups (control groups)**: limits, accounts for, and isolates the resource usage (CPU, memory, disk I/O, etc.) of a collection of processes.
- **namespaces**: a.k.a partition kernel resources.  One set of processes sees one set of resources, while another set of processes sees a different set of resources

## Open Container Initiative (OCI)

The OCI mainly creates open industry standards around container formats and runtimes.
These are governed by the following Core principles and Specifications.

### Core principles
- **composable**: every container should be run independently, portable and secured
- **decentralized**: containers should run similarly on different platforms and different environments
- **minimalist**: containers must run simple processes, plugged to different processes, or be experimented upon them

### Specifications
The OCI currently contains three specifications: 
- **Image**: image index layers, configuration files, file systems, etc.
- **Runtime**: governs initialization and execution
- **Distribution**: actions on construction of registries (push, pull, list, tags, delete), outlines how to run a “filesystem bundle” that is unpacked on disk

At a high-level an OCI implementation would:
1. download an OCI Image,
2. unpack that image into an OCI Runtime filesystem bundle
3. the OCI Runtime Bundle would be run by an OCI Runtime of your choice

## Interfaces: Extending Kubernetes with tools

Interfaces intercept any request from the kubernetes API and ensures that the containers are created on the node with the right specification.
Interfaces provide an abstraction layer over the integration of container runtimes, network, storage, etc., to make future developments easier.
The idea behind is to make kubernetes extendable and democratizable (this word doesn't exist, but you get my point).
From this concept, is how tools come into play.

Fundamental Interfaces up to this day are:

1. **Container Runtime Interfaces (CRI)**
Initially provided by docker and rocket, runtime component was originally tightly coupled to the kubernetes source code. It was then switched to Container Runtime Interfaces (CRI). Rtk has been archived, while `dockershim` support has been removed from kubernetes, after 1.20. Some examples of CRIs are:
- CRI-O
- container-d
- kata, etc.

2. **Container Network Interfaces (CNI)**
CNI's consists of a specification and libraries for writing plugins to configure network interfaces in Linux containers, along with a number of supported plugins. While some CNIs concerns itself only with network connectivity of containers and removing allocated resources when the container is deleted, some others also provide network security policy support, load balancing, etc.
The kubelet is responsible for setting up the network for new Pods using the CNI plugin specified in the configuration file located in the `/etc/cni/net.d/` directory on the node. Some examples are:
- Cilium
- container network interface (CNI) (incubating)
- Flannel
- Calico
- WeaveNet etc.

3. **Container Storage Interfaces (CSI)**
Introduced in Kubernetes 1.9 and move to general availability in 1.13, CSI concentrates into how services can consume storage outside of the cluster. Some examples of CSI are:
- Rook
- Longhorn
- cubeFS
- ceph
- velero, etc

4. **Service mesh interfaces (SMI)**
As an Orchestration and Management component, example of SMI that integrate with kubernetes are:
- istio
- linkerd
- consul, etc.

5. **Cloud provider Interfaces (CPI)**
Heavily used by cluster API, CPI describes how the entire ecosystem of interfaces can also be used interchangeably between different platforms.
Platforms don't provide new functionality, instead, they bundle multiple tools across the different layers together, configuring and fine-tuning them so they are ready to be used. This eases the adoption of cloud native technologies and may even be the only way organizations are able to leverage them. Examples are:
- Google Cloud
- Azure
- Amazon Web Services
- Digital Ocean, etc.

6. **Observability stack**
This category isn't necessarily an interface, however extremely important.
It serves tools that monitor across the entire ecosystem, to help flag when something is wrong.
It simplifies orchestration, standardizing formats and frameworks to ensure visibility and transparency across the stack, collecting:
- metrics: to be able to diagnose, verify and define the state of an application.
- logs: high fidelity data for debugging purposes, to be able to recreate step by step what exactly are the functions called within the system
- traces: specially necessary for service and event oriented architectures, where to serve one request has invoked one or more multiple other services, to be able to recreate a full end-to-end path
- events: (as a high abstraction level) to provide these historical data points of when exactly an action happened within the system

Examples are:
- Opentelemetry
- Prometheus
- Grafana
- Fluentd, etc.

## CNCF Landscape

The landscape provides an overall layer by layer overview of the entire cloud native ecosystem.
This layers can be summarized / keyworded as follows:
- provisioning layer -> infrastructure foundation (automation, security policies, certificates & key management, compliance, container registry, )
- runtime layer -> everything around containers (storage, network, runtime)
- orchestration and management layer -> service mesh, service discovery, scheduling autoscaling, scheduling control planes provisioning, serverless provisioning, API gateways, service proxy, RPCs, coordination. 
- application and definition and development layer -> cloud-native language-related frameworks, package/templating management, API specification guidelines, serverless specifications, image build and management, continuous integration and delivery pipelines, application build/test/deployment automation, canary/blue-green deployments
- observability -> trace, debug, metrics
- platform -> cloud managed provisioning options

For getting the big "picture" of how far Kubernetes has been expended can be found at the [Cloud Native Landscape Website](landscape.cncf.io)

I hope this helps on your way to a successful KCNA exam!

Please feel free to correct me if you notice any errors. 
Thanks for reading until now and see you on the next one.