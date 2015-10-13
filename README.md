### What is this repository for? ###
* Colossus SPA website!
* Version 0.1

### How do I get set up? ###

Dependencies:


```
#!bash

sudo apt-get install ruby compass npm python2.7 python2.7-dev python-pip
sudo npm install -g bower
sudo npm install -g grunt-cli
pip install fabric # (global)
```


Install Proyect:


```
#!bash

clone git@bitbucket.org:scspa/colossus_website.git
cd colossus_website
npm install
bower update
grunt build
```



### How to run project in development ###:


```
#!bash

cd <project_folder>
grunt serve
```


### how to deploy project ###


```
#!bash

fab development:user=<conejo|rcanepa|pillin> update_repos bower_install grunt_build restart_nginx
```