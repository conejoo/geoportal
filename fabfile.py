# -*- coding: utf-8 -*-
import datetime
import re

import getpass # just for demonstration
from fabric.api import env, run
from fabric.colors import yellow, red
from fabric.context_managers import cd, shell_env
from fabric.operations import sudo, run, settings
from fabric.contrib.files import exists


REPOSITORY = (
        'git@colossus-website-project:scspa/colossus_website.git',
        'colossus_website',
        'master'
    )


def development(user):
    env.hosts = ['colossus.cl']
    env.user = user
    env.deploy_user = 'colossus-website'
    env.deploy_user_home = '/home/%s' % env.deploy_user
    env.repos_dir = '%s/repos' % env.deploy_user_home
    env.sd_password = getpass.getpass('Enter password for your user: ')

def update_repos():
    print yellow('\nUpdating project GitHub repos')
    with shell_env(HOME=env.deploy_user_home):
        with settings(password=env.sd_password):
            if not exists(env.repos_dir):
                sudo('mkdir %s' % env.repos_dir)
                sudo('chown -R %s:%s %s' % (env.deploy_user, env.deploy_user, env.repos_dir))
            with cd(env.repos_dir):
                if not exists('%s/%s' % (env.repos_dir, REPOSITORY[1])):
                    sudo('git clone %s %s' % (REPOSITORY[0], REPOSITORY[1]), user=env.deploy_user)
                with cd(REPOSITORY[1]):
                    sudo('git checkout %s' % REPOSITORY[2], user=env.deploy_user)
                    sudo('git pull origin %s' % REPOSITORY[2], user=env.deploy_user)


def bower_install():
    print yellow('\nInstalling Bower dependencies')
    with shell_env(HOME=env.deploy_user_home):
        with settings(password=env.sd_password):
            with cd('%s/%s' % (env.repos_dir, REPOSITORY[1])):
                sudo('npm install -d', user=env.deploy_user)
                sudo('bower update', user=env.deploy_user)


def grunt_build():
    print yellow('\nBuilding project static files')
    with shell_env(HOME=env.deploy_user_home):
        with settings(password=env.sd_password):
            with cd('%s/%s' % (env.repos_dir, REPOSITORY[1])):
                sudo('grunt build')

def restart_nginx():
    print yellow('\nRestarting Gunicorn')
    with settings(password=env.sd_password):
        sudo('service nginx restart')

#fab development:user=<conejo|rcanepa|pillin> update_repos bower_install grunt_build restart_nginx